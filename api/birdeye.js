const BIRDEYE_API = 'https://public-api.birdeye.so';
const CACHE_TTL_MS = 60 * 1000;
const HTTP_TIMEOUT_MS = 7000;
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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

  const [overview, security] = await Promise.allSettled([
    fetchJson(`${BIRDEYE_API}/defi/token_overview?address=${ca}`, { headers }),
    fetchJson(`${BIRDEYE_API}/defi/token_security?address=${ca}`, { headers }).catch(() => null)
  ]);

  const overviewData = overview.status === 'fulfilled' ? (overview.value?.data || overview.value) : null;
  const securityData = security.status === 'fulfilled' ? (security.value?.data || security.value) : null;

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
    security: securityData ? {
      isOpenSource: securityData.isOpenSource ?? null,
      mintRevoked: securityData.mintAuthority === null || securityData.mintAuthority === '',
      freezeRevoked: securityData.freezeAuthority === null || securityData.freezeAuthority === '',
      top10HolderPercent: numberOrNull(securityData.top10HolderPercent),
      top10UserPercent: numberOrNull(securityData.top10UserPercent),
      lpLocked: securityData.lpLocked ?? null,
      creatorBalance: numberOrNull(securityData.creatorBalance),
      creatorPercentage: numberOrNull(securityData.creatorPercentage)
    } : null,
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
