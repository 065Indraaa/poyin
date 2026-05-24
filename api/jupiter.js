const JUP_TOKEN_LIST = 'https://token.jup.ag/strict';
const JUP_PRICE_API = 'https://price.jup.ag/v6/price';
const TOKENS_CACHE_TTL_MS = 60 * 60 * 1000;
const PRICE_CACHE_TTL_MS = 5 * 1000;
const HTTP_TIMEOUT_MS = 8000;

let tokensCache = null;
const priceCache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const action = String(req.query?.action || 'price').trim().toLowerCase();

  try {
    if (action === 'tokens' || action === 'tokenlist') {
      const payload = await getStrictTokenList();
      setCacheHeaders(res, 3600);
      return res.status(200).json({ ...payload, cached: tokensCache?.cached });
    }

    if (action === 'token') {
      const ca = String(req.query?.ca || req.query?.address || '').trim();
      if (!isSolanaAddress(ca)) {
        return res.status(400).json({ error: 'Contract address gak valid' });
      }
      const list = await getStrictTokenList();
      const found = list.byAddress[ca] || null;
      setCacheHeaders(res, 1800);
      return res.status(200).json({ ok: Boolean(found), ca, token: found, registered: Boolean(found) });
    }

    const ids = String(req.query?.ids || req.query?.addresses || req.query?.ca || '').trim();
    if (!ids) {
      return res.status(400).json({ error: 'Param ids/addresses wajib diisi untuk action=price' });
    }

    const addresses = ids
      .split(',')
      .map((item) => item.trim())
      .filter(isSolanaAddress)
      .slice(0, 50);

    if (!addresses.length) {
      return res.status(400).json({ error: 'Tidak ada Solana address valid di parameter ids' });
    }

    const payload = await fetchJupiterPrices(addresses);
    setCacheHeaders(res, PRICE_CACHE_TTL_MS / 1000);
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(200).json({
      ok: false,
      action,
      error: error.message || 'Jupiter gagal',
      data: null
    });
  }
}

async function getStrictTokenList() {
  const now = Date.now();
  if (tokensCache && tokensCache.expiresAt > now) {
    return { ...tokensCache.payload, cached: true };
  }

  const data = await fetchJson(JUP_TOKEN_LIST);
  const list = Array.isArray(data) ? data : Array.isArray(data?.tokens) ? data.tokens : [];

  const byAddress = {};
  for (const token of list) {
    if (token?.address && isSolanaAddress(token.address)) {
      byAddress[token.address] = {
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI || null,
        tags: token.tags || []
      };
    }
  }

  const payload = {
    ok: true,
    provider: 'Jupiter strict token list',
    count: Object.keys(byAddress).length,
    byAddress,
    fetchedAt: new Date().toISOString()
  };

  tokensCache = { payload, expiresAt: now + TOKENS_CACHE_TTL_MS, cached: false };
  return payload;
}

async function fetchJupiterPrices(addresses) {
  const now = Date.now();
  const fresh = {};
  const missing = [];

  for (const address of addresses) {
    const cached = priceCache.get(address);
    if (cached && cached.expiresAt > now) {
      fresh[address] = cached.entry;
    } else {
      missing.push(address);
    }
  }

  if (missing.length) {
    const chunks = chunk(missing, 25);
    const results = await Promise.allSettled(
      chunks.map((chunkAddresses) => fetchJson(`${JUP_PRICE_API}?ids=${chunkAddresses.join(',')}`))
    );

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const data = result.value?.data || {};
      for (const [address, entry] of Object.entries(data)) {
        if (!entry) continue;
        const normalized = {
          priceUsd: numberOrNull(entry.price),
          mintSymbol: entry.mintSymbol || null,
          vsToken: entry.vsToken || null,
          vsTokenSymbol: entry.vsTokenSymbol || null
        };
        priceCache.set(address, { entry: normalized, expiresAt: now + PRICE_CACHE_TTL_MS });
        fresh[address] = normalized;
      }
    }
  }

  return {
    ok: true,
    provider: 'Jupiter price API v6',
    count: Object.keys(fresh).length,
    prices: fresh,
    fetchedAt: new Date().toISOString()
  };
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, headers: { accept: 'application/json', ...(options.headers || {}) } });
    if (!response.ok) {
      throw new Error(`Jupiter ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function setCacheHeaders(res, maxAgeSeconds) {
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(5, Math.floor(maxAgeSeconds))}, stale-while-revalidate=300`);
}

function isSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(value || ''));
}

function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
