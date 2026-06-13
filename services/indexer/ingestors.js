import { WebSocket } from 'ws';
import { CONFIG } from './config.js';
import { tokenDb } from './db.js';

const HTTP_TIMEOUT_MS = 12000;

export async function fetchJson(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function rpc(method, params) {
  const res = await fetch(CONFIG.solanaRpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'sia-indexer', method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || `RPC ${method} failed`);
  return data.result;
}

// ─── DexScreener ───────────────────────────────────────────────────────────
export async function pollDexDiscovery() {
  try {
    const [latest, boosts] = await Promise.all([
      fetchJson(`${CONFIG.dexApi}/token-profiles/latest/v1`).catch(() => []),
      fetchJson(`${CONFIG.dexApi}/token-boosts/latest/v1`).catch(() => []),
    ]);

    const profiles = normalizeList(latest).filter((p) => p.chainId === 'solana' && p.tokenAddress);
    const boostMap = new Map();
    normalizeList(boosts).forEach((b) => { if (b.tokenAddress) boostMap.set(b.tokenAddress, b); });

    const addresses = profiles.map((p) => p.tokenAddress);
    const chunks = chunk(addresses, 8);
    const pairsResults = await Promise.all(
      chunks.map((chunk) =>
        fetchJson(`${CONFIG.dexApi}/tokens/v1/solana/${chunk.join(',')}`).catch(() => [])
      )
    );

    const allPairs = pairsResults.flatMap((r) => normalizeList(r)).filter((p) => p?.chainId === 'solana');
    const tokens = [];

    for (const profile of profiles.slice(0, 30)) {
      const pair = allPairs.find((p) => p.baseToken?.address === profile.tokenAddress);
      if (!pair) continue;
      const enriched = enrichDexPair(pair, boostMap.get(profile.tokenAddress));
      if (enriched) tokens.push(enriched);
    }

    return tokens;
  } catch (e) {
    return [];
  }
}

export async function pollDexTokenSnapshot(ca) {
  try {
    const data = await fetchJson(`${CONFIG.dexApi}/tokens/v1/solana/${ca}`);
    const pairs = normalizeList(data).filter((p) => p?.chainId === 'solana');
    if (!pairs.length) return null;
    const best = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
    return enrichDexPair(best, null);
  } catch {
    return null;
  }
}

// ─── PumpPortal Persistent WS ──────────────────────────────────────────────
let ppState = { ws: null, connected: false, lastTokenAt: null, tokens: [] };

export function startPumpPortalIngestor(onToken) {
  function connect() {
    if (ppState.ws) try { ppState.ws.close(); } catch {}
    ppState.ws = new WebSocket(CONFIG.pumpPortalWs);

    ppState.ws.on('open', () => {
      ppState.connected = true;
      ppState.ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
    });

    ppState.ws.on('message', (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        const token = normalizePumpPortalToken(payload);
        if (!token) return;
        ppState.lastTokenAt = Date.now();
        ppState.tokens.push(token);
        if (ppState.tokens.length > 50) ppState.tokens.shift();
        onToken(token);
      } catch {}
    });

    ppState.ws.on('error', () => { ppState.connected = false; });
    ppState.ws.on('close', () => {
      ppState.connected = false;
      setTimeout(connect, 3000);
    });
  }
  connect();
}

export function getPumpPortalState() {
  return { ...ppState, ws: undefined };
}

// ─── Helius Enhanced RPC helpers ───────────────────────────────────────────
export async function fetchMintAuthority(ca) {
  try {
    const data = await rpc('getAccountInfo', [ca, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const val = data?.value;
    if (!val) return null;
    const parsed = val.data?.parsed?.info;
    return {
      mintAuthority: parsed?.mintAuthority || null,
      freezeAuthority: parsed?.freezeAuthority || null,
      supply: Number(parsed?.supply || 0),
      decimals: parsed?.decimals ?? null,
      owner: val.owner,
    };
  } catch {
    return null;
  }
}

export async function fetchTopHolders(ca, supply) {
  try {
    const data = await rpc('getTokenLargestAccounts', [ca, { commitment: 'confirmed' }]);
    const accounts = data?.value || [];
    if (!accounts.length) return null;

    const infos = await rpc('getMultipleAccounts', [
      accounts.slice(0, 20).map((a) => a.address),
      { encoding: 'jsonParsed', commitment: 'confirmed' },
    ]);

    const holders = accounts.slice(0, 20).map((acc, i) => ({
      address: acc.address,
      amount: Number(acc.amount || 0),
      pct: supply > 0 ? (Number(acc.amount || 0) / supply) * 100 : null,
      owner: infos?.value?.[i]?.data?.parsed?.info?.owner || null,
    }));

    return holders;
  } catch {
    return null;
  }
}

export async function fetchFundingSources(addresses) {
  const map = new Map();
  for (const addr of addresses.slice(0, 10)) {
    try {
      const sigs = await rpc('getSignaturesForAddress', [addr, { limit: 15, commitment: 'confirmed' }]);
      const rows = Array.isArray(sigs) ? sigs : [];
      const sources = [];
      for (const sig of rows.slice(0, 5)) {
        try {
          const tx = await rpc('getTransaction', [sig.signature, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
          const pre = tx?.meta?.preBalances || [];
          const post = tx?.meta?.postBalances || [];
          const accs = tx?.transaction?.message?.accountKeys || [];
          for (let i = 0; i < accs.length; i++) {
            const change = (post[i] || 0) - (pre[i] || 0);
            if (change < -5000) {
              sources.push(accs[i].pubkey || accs[i]);
            }
          }
        } catch {}
      }
      map.set(addr, [...new Set(sources)]);
    } catch {
      map.set(addr, []);
    }
  }
  return map;
}

// ─── MadeOnSol ─────────────────────────────────────────────────────────────
export async function fetchMadeOnSolTokenIntel(ca) {
  if (!CONFIG.madeOnSolKey) return null;
  try {
    const res = await fetchJson(`${CONFIG.madeOnSolApi}/token/${ca}`, {
      headers: { authorization: `Bearer ${CONFIG.madeOnSolKey}` },
    });
    const token = res?.token || res?.data || res;
    if (!token) return null;
    return {
      blacklisted: Boolean(token.is_blacklisted || token.blacklisted),
      blacklistCategory: token.blacklist_category || null,
      deployer: token.deployer || null,
      kolActivity: token.kol_activity || token.kolActivity || null,
      ageSeconds: Number(token.age_seconds || token.ageSeconds) || null,
      marketCapUsd: Number(token.market_cap || token.marketCap || token.fdv) || null,
      volume24hUsd: Number(token.volume_24h_usd || token.volume24hUsd) || null,
      globalFees: token.global_fees || token.globalFees || null,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function normalizeList(v) {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.pairs)) return v.pairs;
  if (Array.isArray(v?.profiles)) return v.profiles;
  return [];
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function enrichDexPair(pair, boost) {
  if (!pair?.baseToken?.address) return null;
  const createdAt = Number(pair.pairCreatedAt || 0);
  const ageMinutes = createdAt ? Math.max(0, Math.floor((Date.now() - createdAt) / 60000)) : null;
  const fdv = Number(pair.fdv || pair.marketCap || 0);
  const liquidity = Number(pair.liquidity?.usd || 0);
  const txns5m = sumTxns(pair.txns?.m5);
  const buys5m = Number(pair.txns?.m5?.buys || 0);
  const sells5m = Number(pair.txns?.m5?.sells || 0);
  const vol5m = Number(pair.volume?.m5 || 0);

  return {
    ca: pair.baseToken.address,
    name: pair.baseToken.name || 'Unknown',
    ticker: pair.baseToken.symbol || '???',
    phase: inferPhase(ageMinutes, fdv, pair.dexId, liquidity, pair),
    ageMinutes,
    pairCreatedAt: createdAt || null,
    liquidityUsd: liquidity,
    marketCap: fdv,
    volume5m: vol5m,
    priceUsd: Number(pair.priceUsd || 0),
    priceChange: {
      m5: Number(pair.priceChange?.m5 || 0),
      h1: Number(pair.priceChange?.h1 || 0),
      h6: Number(pair.priceChange?.h6 || 0),
      h24: Number(pair.priceChange?.h24 || 0),
    },
    txns5m,
    buys5m,
    sells5m,
    dexId: pair.dexId || null,
    pairAddress: pair.pairAddress || null,
    url: pair.url || null,
    boost: boost ? { active: true, amount: Number(boost.amount || 0) } : null,
    websites: normalizeList(pair.info?.websites).map((w) => ({ label: w.label || 'web', url: w.url })).filter((w) => w.url),
    socials: normalizeList(pair.info?.socials).map((s) => ({ type: s.type || s.label || 'social', url: s.url })).filter((s) => s.url),
    _fetchedAt: Date.now(),
    _source: 'dexscreener',
  };
}

function normalizePumpPortalToken(payload) {
  const mint = payload?.mint || payload?.tokenAddress;
  if (!mint) return null;
  const symbol = payload.symbol || payload.ticker || mint.slice(0, 4);
  const initBuy = Number(payload.initialBuy || payload.solAmount || 0);
  return {
    ca: mint,
    name: payload.name || 'Pump.fun Token',
    ticker: symbol,
    phase: 'new',
    ageMinutes: 0,
    pairCreatedAt: null,
    liquidityUsd: 0,
    marketCap: Number(payload.marketCapSol || 0),
    volume5m: 0,
    priceUsd: 0,
    priceChange: { m5: 0, h1: 0, h6: 0, h24: 0 },
    txns5m: initBuy ? 1 : 0,
    buys5m: initBuy ? 1 : 0,
    sells5m: 0,
    dexId: 'pump.fun',
    lpStatus: 'bonding',
    url: `https://pump.fun/coin/${mint}`,
    _fetchedAt: Date.now(),
    _source: 'pumpportal',
  };
}

function inferPhase(ageMinutes, fdv, dexId, liquidity, pair) {
  const dex = String(dexId || '').toLowerCase();
  const isPump = dex.includes('pump') || !pair?.pairAddress;
  if (ageMinutes != null && ageMinutes <= 30) return 'new';
  if (isPump && liquidity < 5000) return 'soon';
  if (ageMinutes != null && ageMinutes <= 360) return 'early';
  if (dex.includes('raydium') || dex.includes('orca') || dex.includes('meteora')) return 'migrated';
  if (ageMinutes != null && ageMinutes <= 1440) return 'soon';
  return 'migrated';
}

function sumTxns(t) {
  return Number(t?.buys || 0) + Number(t?.sells || 0);
}
