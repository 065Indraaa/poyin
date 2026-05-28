const PUMPFUN_API = 'https://frontend-api.pump.fun';
const CACHE_TTL_MS = 30 * 1000;
const HTTP_TIMEOUT_MS = 7000;
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sort = String(req.query?.sort || 'created_timestamp').trim();
  const order = String(req.query?.order || 'DESC').trim().toUpperCase();
  const limit = Math.min(Math.max(Number(req.query?.limit) || 30, 1), 100);
  const offset = Math.max(Number(req.query?.offset) || 0, 0);
  const includeNsfw = String(req.query?.nsfw || 'false') === 'true';

  const cacheKey = `${sort}|${order}|${limit}|${offset}|${includeNsfw}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    setCacheHeaders(res, Math.ceil((cached.expiresAt - now) / 1000));
    return res.status(200).json({ ...cached.payload, cached: true });
  }

  try {
    const payload = await fetchPumpFunCoins({ sort, order, limit, offset, includeNsfw });
    cache.set(cacheKey, { payload, expiresAt: now + CACHE_TTL_MS });
    setCacheHeaders(res, CACHE_TTL_MS / 1000);
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    if (cached?.payload) {
      setCacheHeaders(res, 10);
      return res.status(200).json({
        ...cached.payload,
        cached: true,
        stale: true,
        warning: 'Pump.fun cache lama dipakai karena sumber gagal.'
      });
    }
    return res.status(200).json({
      ok: false,
      tokens: [],
      error: error.message || 'Pump.fun gagal',
      provider: 'Pump.fun frontend API'
    });
  }
}

async function fetchPumpFunCoins({ sort, order, limit, offset, includeNsfw }) {
  const url = `${PUMPFUN_API}/coins?offset=${offset}&limit=${limit}&sort=${sort}&order=${order}&includeNsfw=${includeNsfw}`;
  const data = await fetchJson(url);
  const list = Array.isArray(data) ? data : Array.isArray(data?.coins) ? data.coins : [];

  const tokens = list.map(normalizePumpFunCoin).filter(Boolean);

  return {
    ok: true,
    provider: 'Pump.fun frontend API',
    sort,
    order,
    count: tokens.length,
    tokens,
    fetchedAt: new Date().toISOString()
  };
}

function normalizePumpFunCoin(coin) {
  if (!coin?.mint) return null;
  const mint = String(coin.mint);
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) return null;

  const createdAt = Number(coin.created_timestamp || coin.createdAt || 0);
  const usdMarketCap = numberOrNull(coin.usd_market_cap || coin.usdMarketCap);
  const marketCapSol = numberOrNull(coin.market_cap || coin.marketCapSol);
  const virtualSol = numberOrNull(coin.virtual_sol_reserves || coin.virtualSolReserves);
  const virtualTokens = numberOrNull(coin.virtual_token_reserves || coin.virtualTokenReserves);
  const completed = Boolean(coin.complete || coin.completed);

  return {
    ca: mint,
    name: coin.name || 'Pump.fun Token',
    symbol: coin.symbol || coin.ticker || mint.slice(0, 4).toUpperCase(),
    description: coin.description || null,
    image: coin.image_uri || coin.image || null,
    createdAt,
    ageSeconds: createdAt ? Math.max(0, Math.floor((Date.now() - createdAt) / 1000)) : null,
    usdMarketCap,
    marketCapSol,
    virtualSolReserves: virtualSol,
    virtualTokenReserves: virtualTokens,
    bondingCurveProgress: completed ? 100 : computeBondingProgress(virtualSol),
    completed,
    raydiumPool: coin.raydium_pool || null,
    twitter: coin.twitter || null,
    telegram: coin.telegram || null,
    website: coin.website || null,
    creator: coin.creator || null,
    replies: numberOrNull(coin.reply_count || coin.replies),
    nsfw: Boolean(coin.nsfw),
    url: `https://pump.fun/coin/${mint}`
  };
}

function computeBondingProgress(virtualSolReserves) {
  const raw = Number(virtualSolReserves || 0);
  if (!raw) return 0;
  // pump.fun frontend API returns virtual_sol_reserves in lamports (1 SOL = 1e9 lamports).
  // Auto-detect: if raw > 1e6 it's almost certainly lamports (30 SOL = 3e10).
  const sol = raw > 1e6 ? raw / 1e9 : raw;
  // Bonding curve invariant: virtualSolReserves starts at 30 SOL, reaches ~115 SOL
  // at migration (after ~85 real SOL collected). See pump.fun program docs.
  const INITIAL_VSOL = 30;
  const MIGRATION_VSOL = 115;
  const pct = ((sol - INITIAL_VSOL) / (MIGRATION_VSOL - INITIAL_VSOL)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'user-agent': 'Mozilla/5.0 SIA-Engine',
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      throw new Error(`Pump.fun ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function setCacheHeaders(res, maxAgeSeconds) {
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(5, Math.floor(maxAgeSeconds))}, stale-while-revalidate=60`);
}

function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}
