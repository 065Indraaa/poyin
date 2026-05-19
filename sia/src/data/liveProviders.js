const DEX_API = 'https://api.dexscreener.com';
const PUMP_PORTAL_WS = 'wss://pumpportal.fun/api/data';
const HELIUS_KEY = (import.meta.env.VITE_HELIUS_API_KEY || '').trim();
const SOLANA_RPC = HELIUS_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
  : 'https://api.mainnet-beta.solana.com';
const TOKEN_PROGRAM_IDS = new Set([
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'TokenzQdBNbLqP5VEi98vJb2t1B4jWsXg41dRT5sPp'
]);

const PUMP_PROGRAM_ID = '6EF8rrecthR5Dk4r49j5b3m1TQBTciV4Xed2sW6qx6';
const WS_TIMEOUT_MS = 4800;
const HTTP_TIMEOUT_MS = 9500;
const DEX_DISCOVERY_MAX_AGE_MINUTES = 3 * 24 * 60;

export async function fetchDiscoveryFeed() {
  const [dexFeed, pumpFeed] = await Promise.all([
    fetchDexDiscoveryFeed().catch(() => []),
    collectPumpPortalNewTokens({ limit: 4, timeoutMs: 1800 }).catch(() => [])
  ]);

  const tokens = uniqueTokens([...pumpFeed, ...dexFeed]);

  if (!tokens.length) {
    throw new Error('No live tokens returned from DexScreener');
  }

  return {
    tokens,
    provider: pumpFeed.length ? 'PumpPortal stream + DexScreener live API' : 'DexScreener live API (Boosts & Latest)',
    fetchedAt: new Date().toISOString(),
    degraded: false
  };
}

export async function fetchTokenMarketSnapshots(addresses = []) {
  const uniqueAddresses = [...new Set(addresses.map((address) => String(address || '').trim()).filter(Boolean))];
  if (!uniqueAddresses.length) return [];

  const chunks = [];
  for (let index = 0; index < uniqueAddresses.length; index += 25) {
    chunks.push(uniqueAddresses.slice(index, index + 25));
  }

  const responses = await Promise.allSettled(
    chunks.map((chunk) => fetchJson(`${DEX_API}/tokens/v1/solana/${chunk.join(',')}`))
  );

  const pairs = responses
    .flatMap((response) => (response.status === 'fulfilled' ? normalizeList(response.value) : []))
    .filter((pair) => pair?.chainId === 'solana' && pair?.baseToken?.address);

  const bestByAddress = new Map();
  pairs.forEach((pair) => {
    const address = pair.baseToken.address;
    const current = bestByAddress.get(address);
    if (!current || Number(pair.liquidity?.usd || 0) > Number(current.liquidity?.usd || 0)) {
      bestByAddress.set(address, pair);
    }
  });

  return Array.from(bestByAddress.values())
    .map((pair) => normalizeDexPair(pair, {}))
    .filter(Boolean);
}

async function fetchDexDiscoveryFeed() {
  const [profiles, boosts] = await Promise.allSettled([
    fetchJson(`${DEX_API}/token-profiles/latest/v1`),
    fetchJson(`${DEX_API}/token-boosts/latest/v1`)
  ]);

  const profileItems = profiles.status === 'fulfilled' ? normalizeList(profiles.value) : [];
  const boostItems = boosts.status === 'fulfilled' ? normalizeList(boosts.value) : [];
  const candidates = uniqueByAddress([...boostItems, ...profileItems])
    .filter((item) => item.chainId === 'solana' && item.tokenAddress);

  const pairs = await fetchPairsForCandidates(candidates);
  const boostMap = mapBoosts(boostItems);
  const tokens = pairs
    .filter(isLiveDiscoveryPair)
    .sort(sortDiscoveryPairs)
    .map((pair) => normalizeDexPair(pair, { boosted: boostMap.get(pair.baseToken?.address) }))
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error('DexScreener returned no Solana pairs');
  }

  return tokens;
}

export async function collectPumpPortalNewTokens({ limit = 6, timeoutMs = 2600 } = {}) {
  return new Promise((resolve) => {
    if (typeof WebSocket === 'undefined') {
      resolve([]);
      return;
    }

    const tokens = [];
    const ws = new WebSocket(PUMP_PORTAL_WS);
    const timer = window.setTimeout(() => {
      cleanup();
      resolve(tokens);
    }, timeoutMs);

    function cleanup() {
      window.clearTimeout(timer);
      try {
        ws.close();
      } catch {
        // noop
      }
    }

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
    });

    ws.addEventListener('message', (event) => {
      try {
        const token = normalizePumpPortalToken(JSON.parse(event.data));
        if (!token) return;
        tokens.push(token);
        if (tokens.length >= limit) {
          cleanup();
          resolve(tokens);
        }
      } catch {
        // Ignore malformed stream packets and keep the feed alive until timeout.
      }
    });

    ws.addEventListener('error', () => {
      cleanup();
      resolve(tokens);
    });
  });
}

export async function fetchTokenSnapshot(address) {
  const normalizedAddress = address.trim();
  const [dexResult, mintResult, pumpResult, ordersResult] = await Promise.allSettled([
    fetchDexPairs(normalizedAddress),
    fetchMintAuthority(normalizedAddress),
    fetchPumpPortalSnapshot(normalizedAddress),
    fetchDexOrders(normalizedAddress)
  ]);

  const dexPairs = dexResult.status === 'fulfilled' ? dexResult.value : [];
  const bestPair = pickBestPair(dexPairs);
  const mint = mintResult.status === 'fulfilled' ? mintResult.value : null;
  const pump = pumpResult.status === 'fulfilled' ? pumpResult.value : null;
  const dexOrders = ordersResult.status === 'fulfilled' ? ordersResult.value : [];
  const holdersResult = await Promise.allSettled([
    fetchTopHolders(normalizedAddress, mint?.supply ?? null)
  ]);
  const holders = holdersResult[0].status === 'fulfilled' ? holdersResult[0].value : null;

  if (!bestPair && !mint && !pump) {
    throw new Error('No live provider returned token data');
  }

  return normalizeTokenSnapshot({
    address: normalizedAddress,
    dexPair: bestPair,
    mint,
    pump,
    dexOrders,
    holders,
    dexPairs,
    providerErrors: {
      dex: dexResult.status === 'rejected' ? dexResult.reason?.message : null,
      solanaRpc: mintResult.status === 'rejected' ? mintResult.reason?.message : null,
      pumpPortal: pumpResult.status === 'rejected' ? pumpResult.reason?.message : null,
      dexOrders: ordersResult.status === 'rejected' ? ordersResult.reason?.message : null,
      holders: holdersResult[0].status === 'rejected' ? holdersResult[0].reason?.message : null
    }
  });
}

export async function fetchPumpPortalSnapshot(address) {
  const target = address.toLowerCase();

  return new Promise((resolve, reject) => {
    if (typeof WebSocket === 'undefined') {
      reject(new Error('WebSocket unavailable'));
      return;
    }

    let settled = false;
    const ws = new WebSocket(PUMP_PORTAL_WS);
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('PumpPortal stream timeout'));
    }, WS_TIMEOUT_MS);

    function cleanup() {
      settled = true;
      window.clearTimeout(timer);
      try {
        ws.close();
      } catch {
        // noop
      }
    }

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ method: 'subscribeTokenTrade', keys: [address] }));
    });

    ws.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data);
        const mint = String(payload.mint || payload.tokenAddress || '').toLowerCase();
        if (!mint || mint !== target) return;
        cleanup();
        resolve({
          provider: 'PumpPortal live websocket',
          raw: payload,
          virtualSolReserves: Number(payload.virtualSolReserves || 0),
          virtualTokenReserves: Number(payload.virtualTokenReserves || 0),
          txType: payload.txType || null,
          traderPublicKey: payload.traderPublicKey || null
        });
      } catch {
        if (!settled) {
          cleanup();
          reject(new Error('PumpPortal payload parse failed'));
        }
      }
    });

    ws.addEventListener('error', () => {
      if (!settled) {
        cleanup();
        reject(new Error('PumpPortal websocket error'));
      }
    });
  });
}

async function fetchPairsForCandidates(candidates) {
  const chunks = [];
  for (let index = 0; index < candidates.length; index += 8) {
    chunks.push(candidates.slice(index, index + 8));
  }

  const responses = await Promise.allSettled(
    chunks.map((chunk) =>
      fetchJson(`${DEX_API}/tokens/v1/solana/${chunk.map((item) => item.tokenAddress).join(',')}`)
    )
  );

  return responses
    .flatMap((response) => (response.status === 'fulfilled' ? normalizeList(response.value) : []))
    .filter((pair) => pair?.chainId === 'solana' && pair?.baseToken?.address);
}

async function fetchDexPairs(address) {
  const data = await fetchJson(`${DEX_API}/tokens/v1/solana/${address}`);
  return normalizeList(data).filter((pair) => pair?.chainId === 'solana');
}

async function fetchDexOrders(address) {
  const data = await fetchJson(`${DEX_API}/orders/v1/solana/${address}`);
  return normalizeList(data).filter((order) => order?.status === 'approved' || order?.paymentTimestamp);
}

async function fetchMintAuthority(address) {
  const data = await rpc('getAccountInfo', [
    address,
    {
      encoding: 'jsonParsed',
      commitment: 'confirmed'
    }
  ]);

  const value = data?.value;
  if (!value) return null;

  const owner = value.owner;
  const parsed = value.data?.parsed?.info;
  const tokenProgram = TOKEN_PROGRAM_IDS.has(owner);

  return {
    provider: 'Solana RPC getAccountInfo',
    exists: true,
    tokenProgram,
    owner,
    decimals: parsed?.decimals ?? null,
    supply: Number(parsed?.supply || 0),
    mintAuthority: parsed?.mintAuthority || null,
    freezeAuthority: parsed?.freezeAuthority || null,
    isPumpProgramAccount: owner === PUMP_PROGRAM_ID
  };
}

const WALLET_LABELS = parseWalletLabels(import.meta.env.VITE_SMART_WALLETS || '');

async function fetchTopHolders(address, supplyFromMint = null) {
  try {
    const [largestAccounts, tokenSupply] = await Promise.all([
      rpc('getTokenLargestAccounts', [
        address,
        { commitment: 'confirmed' }
      ]),
      supplyFromMint != null
        ? Promise.resolve({ value: { amount: String(supplyFromMint) } })
        : rpc('getTokenSupply', [address, { commitment: 'confirmed' }]).catch(() => null)
    ]);

    const data = largestAccounts;
    const accounts = data?.value;
    if (!accounts || !accounts.length) return null;

    let top10Amount = 0;
    const totalSupply = Number(tokenSupply?.value?.amount || supplyFromMint || 0);

    accounts.slice(0, 10).forEach((acc) => {
      top10Amount += Number(acc.amount || 0);
    });

    const top10Pct = totalSupply > 0 ? (top10Amount / totalSupply) * 100 : null;
    const topAccounts = accounts.slice(0, 10);
    const top10TokenAccounts = topAccounts.map(a => a.address);
    const holderDetails = topAccounts.map((account, index) => ({
      rank: index + 1,
      tokenAccount: account.address,
      owner: null,
      amount: Number(account.amount || 0),
      pct: totalSupply > 0 ? (Number(account.amount || 0) / totalSupply) * 100 : null,
      solBalance: null,
      label: null,
      type: null
    }));

    // 2. DATA REAL HELIUS: Ambil data Owner dari tiap Token Account
    const accountInfos = await rpc('getMultipleAccounts', [
      top10TokenAccounts,
      { encoding: 'jsonParsed', commitment: 'confirmed' }
    ]);

    let kolDetected = null;
    let smartMoneyCount = 0;

    // 3. Cocokkan Owner dengan Database Label kita (GMGN Method)
    const owners = [];
    if (accountInfos?.value) {
      accountInfos.value.forEach((info, index) => {
        const ownerWallet = info?.data?.parsed?.info?.owner;
        if (ownerWallet) {
          owners.push(ownerWallet);
          holderDetails[index].owner = ownerWallet;
          if (WALLET_LABELS[ownerWallet]) {
            const label = WALLET_LABELS[ownerWallet];
            if (label.type === 'KOL') kolDetected = { address: ownerWallet, ...label };
            if (label.type === 'Smart Wallet') smartMoneyCount++;
            holderDetails[index].label = label.name;
            holderDetails[index].type = label.type;
          }
        }
      });
    }

    // 4. ON-CHAIN ALGORITHMIC DETECTION (Mendeteksi Paus & Insider Burner)
    let whales = 0;
    let burners = 0;
    let algorithmicSmartWallets = 0;
    const uniqueOwners = [...new Set(owners)];

    if (uniqueOwners.length > 0) {
      const ownerInfos = await rpc('getMultipleAccounts', [
        uniqueOwners,
        { encoding: 'jsonParsed', commitment: 'confirmed' }
      ]);
      
      if (ownerInfos?.value) {
        ownerInfos.value.forEach((info, index) => {
          if (info) {
            const solBalance = (info.lamports || 0) / 1e9;
            const owner = uniqueOwners[index];
            holderDetails
              .filter((holder) => holder.owner === owner)
              .forEach((holder) => {
                holder.solBalance = solBalance;
              });
            if (solBalance >= 250) whales++;       // Balance > 250 SOL = Whale
            if (solBalance >= 75) algorithmicSmartWallets++; // Proxy smart holder dari Helius balance, bukan label palsu.
            else if (solBalance <= 0.05) burners++; // Balance < 0.05 SOL = Fresh Burner Wallet (Indikasi dev/bundle proxy)
          }
        });
      }
    }

    // Cabal/common-funder real butuh graph transaksi backend. Jangan pakai random agar verdict konsisten.
    const bundleCount = estimateCommonFunderProxy(top10Pct, uniqueOwners.length, burners);

    return {
      top10Pct,
      commonFunderWallets: bundleCount,
      smartMoneyCount: smartMoneyCount + algorithmicSmartWallets,
      accounts: topAccounts,
      holderDetails,
      uniqueOwnerCount: uniqueOwners.length,
      kol: kolDetected,
      whales,
      burners
    };
  } catch (error) {
    return null;
  }
}

async function rpc(method, params) {
  const response = await fetchWithTimeout(SOLANA_RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'should-i-ape',
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

function estimateCommonFunderProxy(top10Pct, uniqueOwnerCount, burners) {
  if (top10Pct == null) return null;

  let score = 0;
  if (top10Pct >= 70) score += 4;
  else if (top10Pct >= 55) score += 3;
  else if (top10Pct >= 42) score += 2;

  if (uniqueOwnerCount > 0 && uniqueOwnerCount <= 4) score += 2;
  else if (uniqueOwnerCount > 0 && uniqueOwnerCount <= 7) score += 1;

  if (burners >= 4) score += 2;
  else if (burners >= 2) score += 1;

  return clamp(score, 0, 8);
}

function parseWalletLabels(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((labels, item) => {
      const [address, name = 'Configured Smart Wallet', type = 'Smart Wallet', x = null] = item.split(':').map((part) => part.trim());
      if (address) labels[address] = { name, type, x };
      return labels;
    }, {});
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url, {
    headers: {
      accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.pairs)) return value.pairs;
  if (Array.isArray(value?.profiles)) return value.profiles;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function normalizeWebsites(websites = []) {
  return normalizeList(websites)
    .map((item) => ({
      label: item.label || 'Website',
      url: item.url || null
    }))
    .filter((item) => item.url);
}

function normalizeSocials(socials = []) {
  return normalizeList(socials)
    .map((item) => ({
      type: item.type || item.label || 'social',
      url: item.url || null
    }))
    .filter((item) => item.url);
}

function uniqueByAddress(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.chainId}:${item.tokenAddress || item.baseToken?.address || ''}`;
    if (!item.tokenAddress || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueTokens(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.ca || seen.has(item.ca)) return false;
    seen.add(item.ca);
    return true;
  });
}

function mapBoosts(items) {
  const map = new Map();
  items.forEach((item) => {
    if (!item.tokenAddress) return;
    map.set(item.tokenAddress, {
      active: Number(item.amount || 0) > 0,
      amount: Number(item.amount || 0),
      totalAmount: Number(item.totalAmount || 0),
      url: item.url || null
    });
  });
  return map;
}

function normalizePumpPortalToken(payload) {
  const mint = payload?.mint || payload?.tokenAddress;
  if (!mint) return null;

  const symbol = payload.symbol || payload.ticker || shortAddress(mint);
  const name = payload.name || 'Pump.fun Live Token';
  const marketCapSol = Number(payload.marketCapSol || 0);
  const initialBuy = Number(payload.initialBuy || payload.solAmount || 0);

  return {
    id: payload.signature || mint,
    phase: 'fresh',
    name,
    ticker: symbol,
    ca: mint,
    pairAddress: null,
    source: 'PumpPortal live Pump.fun stream',
    age: 'live',
    ageMinutes: 0,
    curve: 1,
    buySell: initialBuy ? '1/0' : '0/0',
    devTx: null,
    sniperWallets: null,
    lpStatus: 'Bonding curve',
    marketCap: marketCapSol ? `${marketCapSol.toFixed(marketCapSol >= 10 ? 1 : 2)} SOL` : 'bonding',
    volume5m: 'new token',
    priceUsd: 0,
    liquidityUsd: 0,
    priceChange: { m5: 0, h1: 0, h6: 0, h24: 0 },
    url: `https://pump.fun/coin/${mint}`,
    flags: {
      mintRevoked: null,
      freezeActive: null,
      lpBurned: false,
      devSoldPct: null,
      top10Pct: null,
      commonFunderWallets: null,
      firstMinuteHoldingPct: null,
      cabalSync: initialBuy > 5 ? 58 : 34,
      reportedVolume: 0,
      feeCollected: null,
      dexPaidTiming: 'none',
      activeBoosts: 0,
      pumpFromLowPct: 0,
      candleConfirmation: initialBuy > 0 ? 44 : 28,
      volumeLiquidityRatio: 0,
      txns5m: initialBuy ? 1 : 0,
      buys5m: initialBuy ? 1 : 0,
      sells5m: 0,
      pumpPortalTradeSeen: true
    },
    provider: 'PumpPortal live websocket',
    providerConfidence: 'low',
    feedInsight: 'Token baru dari stream Pump.fun. Scan CA untuk cek authority, Dex pair, dan risiko bundle sebelum entry.'
  };
}

function pickBestPair(pairs) {
  return [...pairs].sort((a, b) => Number(b.liquidity?.usd || 0) - Number(a.liquidity?.usd || 0))[0] || null;
}

function normalizeDexPair(pair, extras = {}) {
  if (!pair?.baseToken?.address) return null;

  const createdAtMs = Number(pair.pairCreatedAt || 0);
  const ageMinutes = createdAtMs ? Math.max(0, Math.floor((Date.now() - createdAtMs) / 60000)) : null;
  const fdv = Number(pair.fdv || pair.marketCap || 0);
  const txns5m = sumTxns(pair.txns?.m5);
  const buys5m = Number(pair.txns?.m5?.buys || 0);
  const sells5m = Number(pair.txns?.m5?.sells || 0);
  const volume5m = Number(pair.volume?.m5 || 0);
  const volumeH1 = Number(pair.volume?.h1 || 0);
  const volumeH6 = Number(pair.volume?.h6 || 0);
  const volumeH24 = Number(pair.volume?.h24 || 0);
  const liquidityUsd = Number(pair.liquidity?.usd || 0);
  const priceChange = {
    m5: Number(pair.priceChange?.m5 || 0),
    h1: Number(pair.priceChange?.h1 || 0),
    h6: Number(pair.priceChange?.h6 || 0),
    h24: Number(pair.priceChange?.h24 || 0)
  };

  return {
    id: pair.pairAddress || pair.url || pair.baseToken.address,
    phase: inferPhase(ageMinutes, fdv, pair.dexId),
    name: pair.baseToken.name || 'Unknown Token',
    ticker: pair.baseToken.symbol || '???',
    ca: pair.baseToken.address,
    pairAddress: pair.pairAddress || null,
    pairCreatedAt: createdAtMs || null,
    source: labelSource(pair),
    age: formatAge(ageMinutes),
    ageMinutes,
    curve: inferCurve(pair, ageMinutes),
    buySell: `${buys5m}/${sells5m}`,
    devTx: null,
    sniperWallets: null,
    lpStatus: inferLpStatus(pair, liquidityUsd),
    marketCap: formatUsd(fdv),
    volume5m: formatUsd(volume5m),
    priceUsd: Number(pair.priceUsd || 0),
    liquidityUsd,
    pairDex: pair.dexId || null,
    pairUrl: pair.url || null,
    websites: normalizeWebsites(pair.info?.websites),
    socials: normalizeSocials(pair.info?.socials),
    metrics: {
      volume: { m5: volume5m, h1: volumeH1, h6: volumeH6, h24: volumeH24 },
      txns: {
        m5: txns5m,
        h1: sumTxns(pair.txns?.h1),
        h6: sumTxns(pair.txns?.h6),
        h24: sumTxns(pair.txns?.h24)
      },
      buys: {
        m5: buys5m,
        h1: Number(pair.txns?.h1?.buys || 0),
        h6: Number(pair.txns?.h6?.buys || 0),
        h24: Number(pair.txns?.h24?.buys || 0)
      },
      sells: {
        m5: sells5m,
        h1: Number(pair.txns?.h1?.sells || 0),
        h6: Number(pair.txns?.h6?.sells || 0),
        h24: Number(pair.txns?.h24?.sells || 0)
      }
    },
    priceChange,
    url: pair.url || null,
    flags: {
      mintRevoked: null,
      freezeActive: null,
      lpBurned: false,
      devSoldPct: null,
      top10Pct: null,
      commonFunderWallets: null,
      firstMinuteHoldingPct: null,
      cabalSync: inferCabalSync({ txns5m, buys5m, sells5m, volume5m, liquidityUsd, priceChange }),
      reportedVolume: volume5m,
      feeCollected: null,
      dexPaidTiming: extras.boosted?.active ? inferDexPaidTiming(ageMinutes, priceChange) : 'none',
      activeBoosts: extras.boosted?.amount || 0,
      pumpFromLowPct: inferPumpFromLow(priceChange),
      candleConfirmation: inferCandleConfirmation(priceChange, buys5m, sells5m),
      volumeLiquidityRatio: liquidityUsd > 0 ? volume5m / liquidityUsd : 0,
      txns5m,
      buys5m,
      sells5m
    },
    provider: 'DexScreener live API',
    providerConfidence: 'medium',
    feedInsight: buildFeedInsight({ txns5m, buys5m, sells5m, volume5m, liquidityUsd, priceChange, boosted: extras.boosted })
  };
}

function isLiveDiscoveryPair(pair) {
  if (!pair?.baseToken?.address) return false;

  const createdAtMs = Number(pair.pairCreatedAt || 0);
  if (!createdAtMs) return false;

  const ageMinutes = Math.max(0, (Date.now() - createdAtMs) / 60000);
  if (ageMinutes > DEX_DISCOVERY_MAX_AGE_MINUTES) return false;

  const liquidityUsd = Number(pair.liquidity?.usd || 0);
  const volume5m = Number(pair.volume?.m5 || 0);
  const txns5m = sumTxns(pair.txns?.m5);
  const buys5m = Number(pair.txns?.m5?.buys || 0);
  const sells5m = Number(pair.txns?.m5?.sells || 0);
  const priceM5 = Number(pair.priceChange?.m5 || 0);
  const priceH1 = Number(pair.priceChange?.h1 || 0);
  const fdv = Number(pair.fdv || pair.marketCap || 0);

  if (liquidityUsd < 2500) return false;
  if (fdv > 0 && fdv < 3000) return false;
  if (priceM5 <= -18 || priceH1 <= -38) return false;
  if (sells5m > buys5m * 3 + 4) return false;

  const hasFreshActivity = txns5m >= 4 || volume5m >= 800;
  const hasSustainedActivity = txns5m >= 12 || volume5m >= 3500 || liquidityUsd >= 25000;

  if (ageMinutes > 45 && !hasSustainedActivity) return false;
  if (ageMinutes > 24 * 60 && txns5m < 8 && volume5m < 2500) return false;
  return hasFreshActivity;
}

function sortDiscoveryPairs(a, b) {
  return discoveryRank(b) - discoveryRank(a);
}

function discoveryRank(pair) {
  const createdAtMs = Number(pair.pairCreatedAt || 0);
  const ageMinutes = createdAtMs ? Math.max(0, (Date.now() - createdAtMs) / 60000) : DEX_DISCOVERY_MAX_AGE_MINUTES;
  const txns5m = sumTxns(pair.txns?.m5);
  const volume5m = Number(pair.volume?.m5 || 0);
  const liquidityUsd = Number(pair.liquidity?.usd || 0);
  const priceM5 = Number(pair.priceChange?.m5 || 0);

  return Math.max(0, DEX_DISCOVERY_MAX_AGE_MINUTES - ageMinutes) * 4
    + Math.min(txns5m, 120) * 2
    + Math.min(volume5m / 100, 160)
    + Math.min(liquidityUsd / 1000, 80)
    + Math.max(-40, Math.min(priceM5, 120));
}

function normalizeTokenSnapshot({ address, dexPair, mint, pump, dexOrders, holders, dexPairs, providerErrors }) {
  const base = dexPair
    ? normalizeDexPair(dexPair, {})
    : {
        id: address,
        phase: mint?.isPumpProgramAccount ? 'fresh' : 'manual',
        name: 'Live Contract',
        ticker: shortAddress(address),
        ca: address,
        pairAddress: null,
        source: mint?.isPumpProgramAccount ? 'Pump.fun program account' : 'Solana RPC',
        age: 'unknown age',
        ageMinutes: null,
        curve: 0,
        buySell: '0/0',
        devTx: null,
        sniperWallets: null,
        lpStatus: 'No Dex pair found',
        marketCap: 'unknown',
        volume5m: 'unknown',
        priceUsd: 0,
        liquidityUsd: 0,
        priceChange: { m5: 0, h1: 0, h6: 0, h24: 0 },
        url: null,
        flags: {
          mintRevoked: null,
          freezeActive: null,
          lpBurned: false,
          devSoldPct: null,
          top10Pct: null,
          commonFunderWallets: null,
          uniqueOwnerCount: null,
          firstMinuteHoldingPct: null,
          cabalSync: null,
          reportedVolume: 0,
          feeCollected: null,
          dexPaidTiming: 'none',
          activeBoosts: 0,
          pumpFromLowPct: 0,
          candleConfirmation: 0,
          volumeLiquidityRatio: 0,
          txns5m: 0,
          buys5m: 0,
          sells5m: 0
        },
        provider: 'Solana RPC',
        providerConfidence: 'low',
        feedInsight: 'Dex pair belum ditemukan. Analisis hanya memakai data akun mint yang tersedia.'
      };

  const orderTiming = inferOrderTiming(base, dexOrders);

  return {
    ...base,
    source: mergeSources(base.source, mint, pump),
    flags: {
      ...base.flags,
      mintRevoked: mint?.tokenProgram ? !mint.mintAuthority : base.flags.mintRevoked,
      freezeActive: mint?.tokenProgram ? Boolean(mint.freezeAuthority) : base.flags.freezeActive,
      top10Pct: holders ? holders.top10Pct : base.flags.top10Pct,
      commonFunderWallets: holders ? holders.commonFunderWallets : base.flags.commonFunderWallets,
      uniqueOwnerCount: holders ? holders.uniqueOwnerCount : base.flags.uniqueOwnerCount,
      kolDetected: holders ? holders.kol : base.flags.kolDetected,
      smartMoneyCount: holders ? holders.smartMoneyCount : base.flags.smartMoneyCount,
      whales: holders ? holders.whales : base.flags.whales,
      burners: holders ? holders.burners : base.flags.burners,
      pumpPortalTradeSeen: Boolean(pump),
      dexPaidTiming: orderTiming.timing || base.flags.dexPaidTiming,
      activeBoosts: orderTiming.count || base.flags.activeBoosts,
      dexPairCount: dexPairs.length
    },
    rawProviders: {
      dexPair,
      mint,
      pump,
      dexOrders,
      holders: holders?.holderDetails || null,
      providerErrors
    },
    providerConfidence: dexPair && mint ? 'high' : dexPair || mint ? 'medium' : 'low'
  };
}

function inferOrderTiming(token, orders = []) {
  if (!orders.length) {
    return { timing: null, count: 0 };
  }

  const paymentTimes = orders
    .map((order) => Number(order.paymentTimestamp || 0) * 1000)
    .filter(Boolean);

  if (!paymentTimes.length) {
    return { timing: 'early', count: orders.length };
  }

  const firstPayment = Math.min(...paymentTimes);
  if (token.pairCreatedAt) {
    const minutesAfterPair = (firstPayment - token.pairCreatedAt) / 60000;
    return {
      timing: minutesAfterPair > 120 || token.flags.pumpFromLowPct > 300 ? 'late' : 'early',
      count: orders.length
    };
  }

  return {
    timing: token.flags.pumpFromLowPct > 300 ? 'late' : 'early',
    count: orders.length
  };
}

function mergeSources(source, mint, pump) {
  const sources = [source];
  if (mint) sources.push('Solana RPC');
  if (pump) sources.push('PumpPortal stream');
  return [...new Set(sources)].join(' + ');
}

function inferPhase(ageMinutes, fdv, dexId = '') {
  const dex = dexId.toLowerCase();
  if (ageMinutes != null && ageMinutes <= 10) return 'fresh';
  if (dex.includes('raydium') || dex.includes('orca') || dex.includes('meteora')) return 'raydium';
  if (fdv > 45000 && fdv < 120000) return 'trench';
  if (ageMinutes != null && ageMinutes <= 45) return 'trench';
  return 'raydium';
}

function inferCurve(pair, ageMinutes) {
  if (pair.dexId?.toLowerCase().includes('pump')) return ageMinutes != null ? Math.min(98, Math.round(12 + ageMinutes * 2.2)) : 40;
  return 100;
}

function inferLpStatus(pair, liquidityUsd) {
  if (!pair.pairAddress) return 'Pair not indexed';
  if (liquidityUsd >= 50000) return 'Deep liquidity';
  if (liquidityUsd >= 10000) return 'Tradable liquidity';
  if (liquidityUsd > 0) return 'Thin liquidity';
  return 'No liquidity data';
}

function labelSource(pair) {
  const dex = pair.dexId ? capitalize(pair.dexId) : 'DexScreener';
  return pair.labels?.length ? `${dex} ${pair.labels.join('/')}` : dex;
}

function inferCabalSync({ txns5m, buys5m, sells5m, volume5m, liquidityUsd, priceChange }) {
  let risk = 15;
  if (txns5m > 120 && liquidityUsd < 12000) risk += 22;
  if (volume5m > liquidityUsd * 3 && liquidityUsd > 0) risk += 22;
  if (buys5m > sells5m * 4 && priceChange.m5 < 8) risk += 18;
  if (priceChange.m5 > 120) risk += 14;
  return clamp(Math.round(risk), 0, 96);
}

function inferPumpFromLow(priceChange) {
  return Math.max(0, Math.round(Math.max(priceChange.m5, priceChange.h1, priceChange.h6, priceChange.h24)));
}

function inferDexPaidTiming(ageMinutes, priceChange) {
  if (ageMinutes != null && ageMinutes < 25) return 'early';
  return inferPumpFromLow(priceChange) > 300 ? 'late' : 'early';
}

function inferCandleConfirmation(priceChange, buys5m, sells5m) {
  let score = 50;
  const total = buys5m + sells5m;
  const buyRatio = total > 0 ? buys5m / total : 0.5;
  if (priceChange.m5 > 0) score += 15;
  if (priceChange.h1 > -20) score += 10;
  if (priceChange.m5 < -15) score -= 25;
  if (priceChange.h1 < -45) score -= 14;
  score += Math.round((buyRatio - 0.5) * 45);
  return clamp(score, 0, 100);
}

function buildFeedInsight({ txns5m, buys5m, sells5m, volume5m, liquidityUsd, priceChange, boosted }) {
  if (boosted?.active && inferPumpFromLow(priceChange) > 300) {
    return `Dex boost aktif setelah move besar (+${inferPumpFromLow(priceChange)}%). Baca sebagai potensi exit timing.`;
  }
  if (liquidityUsd > 0 && volume5m > liquidityUsd * 3) {
    return 'Volume 5m jauh lebih besar dari liquidity. Perlu curiga wash atau churn bot.';
  }
  if (txns5m > 80 && buys5m > sells5m * 3 && priceChange.m5 < 10) {
    return 'Banyak buy tetapi harga tidak ikut naik. Ada indikasi supply ditahan/dilepas.';
  }
  if (priceChange.m5 < -15) {
    return 'Candle 5m merah kuat. Tunggu konfirmasi, jangan tangkap pisau jatuh.';
  }
  if (buys5m > sells5m && priceChange.m5 > 0) {
    return 'Buy pressure 5m positif. Tetap cek authority dan distribusi holder.';
  }
  return 'Data live terbaca. Lanjutkan cek holder, authority, dan timing entry.';
}

function sumTxns(txnWindow = {}) {
  return Number(txnWindow.buys || 0) + Number(txnWindow.sells || 0);
}

function formatAge(ageMinutes) {
  if (ageMinutes == null) return 'unknown';
  if (ageMinutes < 60) return `${ageMinutes}m`;
  const hours = Math.floor(ageMinutes / 60);
  if (hours < 48) return `${hours}h ${ageMinutes % 60}m`;
  return `${Math.floor(hours / 24)}d`;
}

export function formatUsd(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num <= 0) return 'unknown';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(num >= 100_000 ? 0 : 1)}K`;
  return `$${num.toFixed(num >= 10 ? 0 : 2)}`;
}

function shortAddress(address) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`.toUpperCase();
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function subscribeToPumpPortalStream(onToken, onStatus = () => {}) {
  if (typeof WebSocket === 'undefined') {
    onStatus({ connected: false, error: 'WebSocket unavailable' });
    return () => {};
  }

  let ws;
  let active = true;
  let reconnectTimer;

  function connect() {
    if (!active) return;
    onStatus({ connected: false, connecting: true, error: null });
    ws = new WebSocket(PUMP_PORTAL_WS);
    
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
      onStatus({ connected: true, connecting: false, error: null });
    });

    ws.addEventListener('message', (event) => {
      try {
        const token = normalizePumpPortalToken(JSON.parse(event.data));
        if (token) {
          token._fetchedAt = Date.now();
          token._lastSeenAt = Date.now();
          onStatus({ connected: true, connecting: false, lastTokenAt: token._lastSeenAt, error: null });
          onToken(token);
        }
      } catch {}
    });

    ws.addEventListener('error', () => {
      onStatus({ connected: false, connecting: false, error: 'PumpPortal websocket error' });
    });

    ws.addEventListener('close', () => {
      if (active) {
        onStatus({ connected: false, connecting: false, error: 'PumpPortal reconnecting' });
        reconnectTimer = window.setTimeout(connect, 2500);
      }
    });
  }

  connect();

  return () => {
    active = false;
    window.clearTimeout(reconnectTimer);
    if (ws) {
      try { ws.close(); } catch {}
    }
  };
}
