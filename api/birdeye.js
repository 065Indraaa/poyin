const BIRDEYE_API = 'https://public-api.birdeye.so';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit cache
const HTTP_TIMEOUT_MS = 7000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit window
const RATE_LIMIT_MAX = 10; // maks 10 request per IP per menit
const cache = new Map();
const rateLimit = new Map(); // ip -> { count, resetAt }

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.setHeader('Retry-After', rl.retryAfter);
    return res.status(429).json({ error: 'Rate limit. Coba lagi nanti.', retryAfter: rl.retryAfter });
  }

  const ca = String(req.query?.ca || req.query?.address || '').trim();
  if (!isSolanaAddress(ca)) {
    return res.status(400).json({ error: 'Contract address gak valid' });
  }

  const now = Date.now();
  const cached = cache.get(ca);
  if (cached && cached.expiresAt > now) {
    setCacheHeaders(res, Math.ceil((cached.expiresAt - now) / 1000));
    return res.status(200).json({ ...cached.payload, cached: true });
  }

  try {
    const payload = await fetchBirdeyeOverview(ca);
    cache.set(ca, { payload, expiresAt: now + CACHE_TTL_MS });
    setCacheHeaders(res, CACHE_TTL_MS / 1000);
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    if (cached?.payload) {
      setCacheHeaders(res, 30);
      return res.status(200).json({
        ...cached.payload,
        cached: true,
        stale: true,
        warning: 'Birdeye cache lama dipakai karena provider gagal.'
      });
    }

    return res.status(200).json({
      ok: false,
      ca,
      error: error.message || 'Birdeye gagal',
      data: null
    });
  }
}

export async function fetchBirdeyeOverview(ca) {
  const apiKey = (process.env.BIRDEYE_API_KEY || process.env.VITE_BIRDEYE_API_KEY || '').trim();
  const headers = { accept: 'application/json', 'x-chain': 'solana' };
  if (apiKey) headers['x-api-key'] = apiKey;

  // Hanya panggil token_overview. token_security dihapus karena data mint/freeze
  // authority sudah tercover oleh Solana RPC (fetchMintAuthority) di liveProviders.js,
  // sehingga menghemat 1 request per scan (~50% pengurangan usage Birdeye).
  const overview = await fetchJson(`${BIRDEYE_API}/defi/token_overview?address=${ca}`, { headers });
  const overviewData = overview?.data || overview;

  if (!overviewData) {
    throw new Error('Birdeye overview tidak tersedia');
  }

  return {
    ok: true,
    ca,
    provider: 'Birdeye public API',
    priceUsd: numberOrNull(overviewData.price || overviewData.priceUsd),
    priceChange24h: numberOrNull(overviewData.priceChange24hPercent || overviewData.priceChange24h),
    marketCapUsd: numberOrNull(overviewData.mc || overviewData.marketCap || overviewData.fdv),
    liquidityUsd: numberOrNull(overviewData.liquidity),
    volume24hUsd: numberOrNull(overviewData.v24hUSD || overviewData.volume24h),
    trades24h: numberOrNull(overviewData.trade24h || overviewData.trades24h),
    holderCount: numberOrNull(overviewData.holder || overviewData.holderCount),
    uniqueWallet24h: numberOrNull(overviewData.uniqueWallet24h),
    supply: numberOrNull(overviewData.supply || overviewData.totalSupply),
    fetchedAt: new Date().toISOString()
  };
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Birdeye ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function setCacheHeaders(res, maxAgeSeconds) {
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(15, Math.floor(maxAgeSeconds))}, stale-while-revalidate=180`);
}

function isSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(value || ''));
}

function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}
