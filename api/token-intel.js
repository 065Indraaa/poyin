import { buildSmartWalletRegistry } from './smart-wallets.js';

const MADEONSOL_API = 'https://madeonsol.com/api/v1';
const TOKEN_PROGRAM_IDS = new Set([
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'TokenzQdBNbLqP5VEi98vJb2t1B4jWsXg41dRT5sPp'
]);

const HTTP_TIMEOUT_MS = 12000;
const INTEL_CACHE_TTL_MS = 75 * 1000;
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ca = String(req.query?.ca || req.query?.address || '').trim();
  if (!isSolanaAddress(ca)) {
    return res.status(400).json({ error: 'Contract address tidak valid' });
  }

  const cacheKey = ca;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    setCacheHeaders(res, Math.ceil((cached.expiresAt - Date.now()) / 1000));
    return res.status(200).json({ ...cached.payload, cached: true });
  }

  try {
    const payload = await buildTokenIntel(ca);
    cache.set(cacheKey, {
      payload,
      expiresAt: Date.now() + INTEL_CACHE_TTL_MS
    });
    setCacheHeaders(res, INTEL_CACHE_TTL_MS / 1000);
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    if (cached?.payload) {
      setCacheHeaders(res, 30);
      return res.status(200).json({
        ...cached.payload,
        cached: true,
        stale: true,
        warning: 'Token intel cache lama dipakai karena provider gagal.'
      });
    }

    return res.status(500).json({
      error: 'Gagal memuat token intelligence',
      message: error.message
    });
  }
}

async function buildTokenIntel(ca) {
  const [mint, tokenSupply, largestAccounts, smartRegistry, madeOnSolIntel] = await Promise.all([
    fetchMintInfo(ca).catch(() => null),
    rpc('getTokenSupply', [ca, { commitment: 'confirmed' }]).catch(() => null),
    rpc('getTokenLargestAccounts', [ca, { commitment: 'confirmed' }]),
    buildSmartWalletRegistry().catch(() => ({ labels: {}, size: 0, source: 'registry gagal dimuat' })),
    fetchMadeOnSolTokenIntel(ca).catch(() => null)
  ]);

  const accounts = largestAccounts?.value || [];
  if (!accounts.length) {
    return {
      ca,
      top10Pct: null,
      uniqueOwnerCount: 0,
      commonFunderWallets: null,
      smartMoneyCount: 0,
      whales: 0,
      burners: 0,
      holderDetails: [],
      walletIntel: [],
      madeOnSolIntel,
      globalFees: madeOnSolIntel?.globalFees || null,
      smartWalletRegistrySize: smartRegistry.size || 0,
      smartWalletSource: smartRegistry.source || 'belum dikonfigurasi',
      insightSummary: ['Top holder belum tersedia dari RPC.']
    };
  }

  const totalSupply = Number(tokenSupply?.value?.amount || mint?.supply || 0);
  const topAccounts = accounts.slice(0, 10);
  const top10Amount = topAccounts.reduce((sum, account) => sum + Number(account.amount || 0), 0);
  const top10Pct = totalSupply > 0 ? (top10Amount / totalSupply) * 100 : null;
  const tokenAccountInfos = await rpc('getMultipleAccounts', [
    topAccounts.map((account) => account.address),
    { encoding: 'jsonParsed', commitment: 'confirmed' }
  ]);

  const holderDetails = topAccounts.map((account, index) => {
    const owner = tokenAccountInfos?.value?.[index]?.data?.parsed?.info?.owner || null;
    const label = owner ? smartRegistry.labels?.[owner] : null;

    return {
      rank: index + 1,
      tokenAccount: account.address,
      owner,
      amount: Number(account.amount || 0),
      pct: totalSupply > 0 ? (Number(account.amount || 0) / totalSupply) * 100 : null,
      solBalance: null,
      label: label?.name || null,
      type: label?.type || null,
      source: label?.source || null,
      winRate: label?.winRate || null,
      pnl: label?.pnl || null,
      roi: label?.roi || null,
      confidence: label?.confidence || null,
      txSample: null,
      lastActivityAt: null,
      sampleOldestActivityAt: null,
      tags: []
    };
  });

  const uniqueOwners = [...new Set(holderDetails.map((holder) => holder.owner).filter(Boolean))];
  const ownerInfos = uniqueOwners.length
    ? await rpc('getMultipleAccounts', [uniqueOwners, { encoding: 'jsonParsed', commitment: 'confirmed' }]).catch(() => null)
    : null;

  const ownerBalances = new Map();
  ownerInfos?.value?.forEach((info, index) => {
    if (!info) return;
    ownerBalances.set(uniqueOwners[index], Number(info.lamports || 0) / 1e9);
  });

  const activityRows = await Promise.all(
    uniqueOwners.slice(0, 10).map((owner) => fetchOwnerActivity(owner).catch(() => ({ owner, txSample: 0 })))
  );
  const activityMap = new Map(activityRows.map((row) => [row.owner, row]));

  let whales = 0;
  let burners = 0;
  let smartMoneyCount = 0;
  let kol = null;

  holderDetails.forEach((holder) => {
    const solBalance = ownerBalances.get(holder.owner);
    const activity = activityMap.get(holder.owner);
    holder.solBalance = Number.isFinite(solBalance) ? solBalance : null;
    holder.txSample = activity?.txSample ?? null;
    holder.lastActivityAt = activity?.lastActivityAt || null;
    holder.sampleOldestActivityAt = activity?.sampleOldestActivityAt || null;
    holder.tags = buildHolderTags(holder);

    if (holder.type === 'KOL') kol = { address: holder.owner, name: holder.label, type: holder.type, source: holder.source };
    if (['KOL', 'Smart Wallet', 'Alpha Wallet'].includes(holder.type)) smartMoneyCount++;
    if (Number(holder.solBalance || 0) >= 250) whales++;
    if (Number(holder.solBalance || 0) <= 0.05) burners++;
  });

  const commonFunderWallets = estimateClusterRisk(top10Pct, uniqueOwners.length, burners, holderDetails);
  const walletIntel = holderDetails.map((holder) => ({
    owner: holder.owner,
    rank: holder.rank,
    pct: holder.pct,
    label: holder.label,
    type: holder.type,
    solBalance: holder.solBalance,
    txSample: holder.txSample,
    tags: holder.tags,
    score: scoreHolder(holder)
  }));

  return {
    ca,
    top10Pct,
    uniqueOwnerCount: uniqueOwners.length,
    commonFunderWallets,
    smartMoneyCount,
    accounts: topAccounts,
    holderDetails,
    walletIntel,
    kol,
    whales,
    burners,
    mint,
    madeOnSolIntel,
    globalFees: madeOnSolIntel?.globalFees || null,
    smartWalletRegistrySize: smartRegistry.size || 0,
    smartWalletSource: smartRegistry.source || 'belum dikonfigurasi',
    insightSummary: buildInsightSummary({ top10Pct, uniqueOwnerCount: uniqueOwners.length, commonFunderWallets, smartMoneyCount, whales, burners, madeOnSolIntel })
  };
}

async function fetchMintInfo(ca) {
  const data = await rpc('getAccountInfo', [
    ca,
    {
      encoding: 'jsonParsed',
      commitment: 'confirmed'
    }
  ]);

  const value = data?.value;
  if (!value) return null;
  const parsed = value.data?.parsed?.info;

  return {
    provider: 'Solana RPC getAccountInfo',
    exists: true,
    tokenProgram: TOKEN_PROGRAM_IDS.has(value.owner),
    owner: value.owner,
    decimals: parsed?.decimals ?? null,
    supply: Number(parsed?.supply || 0),
    mintAuthority: parsed?.mintAuthority || null,
    freezeAuthority: parsed?.freezeAuthority || null
  };
}

async function fetchOwnerActivity(owner) {
  const signatures = await rpc('getSignaturesForAddress', [
    owner,
    { limit: 20, commitment: 'confirmed' }
  ]);

  const rows = Array.isArray(signatures) ? signatures : [];
  return {
    owner,
    txSample: rows.length,
    lastActivityAt: rows[0]?.blockTime ? new Date(rows[0].blockTime * 1000).toISOString() : null,
    sampleOldestActivityAt: rows[rows.length - 1]?.blockTime ? new Date(rows[rows.length - 1].blockTime * 1000).toISOString() : null
  };
}

async function fetchMadeOnSolTokenIntel(ca) {
  const apiKey = (
    process.env.MADEONSOL_API_KEY ||
    process.env.VITE_MADEONSOL_API_KEY ||
    process.env.ONSOL_API_KEY ||
    process.env.ON_SOL_API_KEY ||
    process.env.MADE_ON_SOL_API_KEY ||
    ''
  ).trim();

  if (!apiKey) return null;

  const response = await fetchWithTimeout(`${MADEONSOL_API}/token/${ca}`, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`MadeOnSol token intel ${response.status}`);
  }

  const payload = await response.json();
  const token = payload?.token || payload?.data || payload;
  if (!token || typeof token !== 'object') return null;

  return {
    provider: 'MadeOnSol token intelligence',
    priceUsd: numberOrNull(token.price_usd || token.priceUsd),
    marketCapUsd: numberOrNull(token.market_cap || token.marketCap || token.fdv),
    volume24hUsd: numberOrNull(token.volume_24h_usd || token.volume24hUsd),
    trades24h: numberOrNull(token.trades_24h || token.trades24h),
    firstSeenAt: token.first_seen_at || token.firstSeenAt || null,
    ageSeconds: numberOrNull(token.age_seconds || token.ageSeconds),
    blacklisted: Boolean(token.is_blacklisted || token.blacklisted),
    blacklistCategory: token.blacklist_category || null,
    mcChangePct: token.mc_change_pct || token.mcChangePct || null,
    volumeUsd: token.volume_usd || token.volumeUsd || null,
    mevVolumePct: token.mev_volume_pct || token.mevVolumePct || null,
    globalFees: normalizeGlobalFees(token),
    deployer: token.deployer || null,
    kolActivity: token.kol_activity || token.kolActivity || null
  };
}

function normalizeGlobalFees(token = {}) {
  const feeSource = token.global_fees || token.globalFees || token.fees || token.fee || {};
  const windows = {
    m5: firstNumber(
      feeSource.m5,
      feeSource['5m'],
      feeSource.fiveMinute,
      token.fees_5m_usd,
      token.fee_5m_usd,
      token.global_fee_5m_usd
    ),
    h1: firstNumber(
      feeSource.h1,
      feeSource['1h'],
      feeSource.hour,
      token.fees_1h_usd,
      token.fee_1h_usd,
      token.global_fee_1h_usd
    ),
    h24: firstNumber(
      feeSource.h24,
      feeSource['24h'],
      feeSource.day,
      token.fees_24h_usd,
      token.fee_24h_usd,
      token.global_fee_24h_usd,
      token.total_fees_24h_usd
    )
  };

  const currentUsd = firstNumber(
    feeSource.currentUsd,
    feeSource.current_usd,
    feeSource.usd,
    token.global_fees_usd,
    token.global_fee_usd,
    token.fees_usd,
    token.fee_usd,
    token.trading_fee_usd,
    token.protocol_fee_usd,
    windows.m5,
    windows.h1,
    windows.h24
  );

  if (currentUsd == null && windows.m5 == null && windows.h1 == null && windows.h24 == null) return null;

  return {
    provider: 'MadeOnSol token intelligence',
    exact: true,
    currentUsd,
    windows,
    rateBps: firstNumber(feeSource.rateBps, feeSource.rate_bps, token.fee_rate_bps),
    updatedAt: token.updated_at || token.updatedAt || new Date().toISOString()
  };
}

function firstNumber(...values) {
  for (const value of values) {
    const num = numberOrNull(value);
    if (num != null) return num;
  }
  return null;
}

function buildHolderTags(holder) {
  const tags = [];
  const balance = Number(holder.solBalance || 0);
  const pct = Number(holder.pct || 0);

  if (holder.type) tags.push(holder.type);
  if (balance >= 250) tags.push('Whale');
  else if (balance >= 75) tags.push('Large Wallet');
  else if (balance <= 0.05) tags.push('Burner');
  if (pct >= 10) tags.push('Supply besar');
  if (holder.txSample != null && holder.txSample <= 2) tags.push('Aktivitas minim');
  if (holder.roi || holder.pnl || holder.winRate) tags.push('Ada performa registry');

  return tags;
}

function scoreHolder(holder) {
  let score = 45;
  const balance = Number(holder.solBalance || 0);
  const pct = Number(holder.pct || 0);

  if (['KOL', 'Smart Wallet', 'Alpha Wallet'].includes(holder.type)) score += 22;
  if (holder.winRate >= 55) score += 8;
  if (holder.roi > 0 || holder.pnl > 0) score += 8;
  if (balance >= 250) score += 10;
  else if (balance >= 75) score += 6;
  else if (balance <= 0.05) score -= 18;
  if (pct >= 15) score -= 12;
  else if (pct >= 8) score -= 6;
  if (holder.txSample != null && holder.txSample <= 2) score -= 8;

  return clamp(Math.round(score), 0, 100);
}

function estimateClusterRisk(top10Pct, uniqueOwnerCount, burners, holders) {
  if (top10Pct == null) return null;

  let score = 0;
  if (top10Pct >= 70) score += 4;
  else if (top10Pct >= 55) score += 3;
  else if (top10Pct >= 42) score += 2;
  if (uniqueOwnerCount > 0 && uniqueOwnerCount <= 4) score += 2;
  else if (uniqueOwnerCount > 0 && uniqueOwnerCount <= 7) score += 1;
  if (burners >= 4) score += 2;
  else if (burners >= 2) score += 1;
  if (holders.filter((holder) => Number(holder.txSample || 0) <= 2).length >= 4) score += 1;
  return clamp(score, 0, 8);
}

function buildInsightSummary({ top10Pct, uniqueOwnerCount, commonFunderWallets, smartMoneyCount, whales, burners, madeOnSolIntel }) {
  const summary = [];

  if (top10Pct != null) summary.push(`Top 10 memegang ${top10Pct.toFixed(1)}% supply.`);
  summary.push(`${uniqueOwnerCount} owner unik terbaca dari top holder.`);
  if (madeOnSolIntel?.ageSeconds != null) summary.push(`Umur indexer MadeOnSol sekitar ${formatAgeSeconds(madeOnSolIntel.ageSeconds)}.`);
  if (madeOnSolIntel?.kolActivity?.signal) summary.push(`KOL flow MadeOnSol: ${madeOnSolIntel.kolActivity.signal}.`);
  if (madeOnSolIntel?.blacklisted) summary.push(`MadeOnSol menandai blacklist: ${madeOnSolIntel.blacklistCategory || 'kategori tidak diketahui'}.`);
  if (smartMoneyCount > 0) summary.push(`${smartMoneyCount} holder cocok dengan registry Smart Money/KOL.`);
  if (whales > 0) summary.push(`${whales} whale terdeteksi di top holder.`);
  if (burners > 0) summary.push(`${burners} burner wallet terdeteksi.`);
  if (commonFunderWallets >= 5) summary.push('Risiko cluster/bundle tinggi dari konsentrasi holder dan burner.');
  else if (commonFunderWallets >= 3) summary.push('Ada indikasi cluster yang perlu dipantau.');
  else summary.push('Belum ada indikasi cluster berat dari proxy holder.');

  return summary;
}

async function rpc(method, params) {
  const response = await fetchWithTimeout(resolveRpcUrl(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'sia-token-intel',
      method,
      params
    })
  });

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || `RPC ${method} failed`);
  }
  return payload.result;
}

function resolveRpcUrl() {
  const heliusKey = (
    process.env.HELIUS_API_KEY ||
    process.env.VITE_HELIUS_API_KEY ||
    process.env.SOLANA_RPC_API_KEY ||
    ''
  ).trim();

  if (process.env.SOLANA_RPC_URL) return process.env.SOLANA_RPC_URL;
  if (heliusKey) return `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;
  return 'https://api.mainnet-beta.solana.com';
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function setCacheHeaders(res, maxAgeSeconds) {
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(15, Math.floor(maxAgeSeconds))}, stale-while-revalidate=120`);
}

function isSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(value || ''));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function formatAgeSeconds(value) {
  const seconds = Number(value || 0);
  if (seconds < 60) return `${Math.round(seconds)} detik`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam`;
  return `${Math.floor(seconds / 86400)} hari`;
}
