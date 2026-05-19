const MADEONSOL_API = 'https://madeonsol.com/api/v1';
const CACHE_TTL_MS = 60 * 60 * 1000;
const HTTP_TIMEOUT_MS = 12000;

let cache = null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const now = Date.now();
    if (cache && cache.expiresAt > now) {
      setCacheHeaders(res, Math.ceil((cache.expiresAt - now) / 1000));
      return res.status(200).json({ ...cache.payload, cached: true });
    }

    const payload = await buildSmartWalletRegistry();
    cache = {
      payload,
      expiresAt: now + CACHE_TTL_MS
    };

    setCacheHeaders(res, CACHE_TTL_MS / 1000);
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    if (cache?.payload) {
      setCacheHeaders(res, 120);
      return res.status(200).json({
        ...cache.payload,
        cached: true,
        stale: true,
        warning: 'Registry cache lama dipakai karena provider gagal.'
      });
    }

    return res.status(500).json({
      error: 'Gagal memuat registry Smart Money',
      message: error.message
    });
  }
}

async function buildSmartWalletRegistry() {
  const labels = parseWalletLabels(process.env.SMART_WALLETS || process.env.VITE_SMART_WALLETS || '');
  const sources = [];
  if (Object.keys(labels).length) sources.push('SMART_WALLETS');

  const apiKey = (process.env.MADEONSOL_API_KEY || process.env.VITE_MADEONSOL_API_KEY || '').trim();
  if (apiKey) {
    const madeOnSolLabels = await fetchMadeOnSolWalletLabels(apiKey);
    Object.assign(labels, madeOnSolLabels);
    if (Object.keys(madeOnSolLabels).length) sources.push('MadeOnSol API');
  }

  return {
    labels,
    size: Object.keys(labels).length,
    source: sources.length ? sources.join(' + ') : 'belum dikonfigurasi',
    fetchedAt: new Date().toISOString(),
    ttlSeconds: Math.round(CACHE_TTL_MS / 1000)
  };
}

async function fetchMadeOnSolWalletLabels(apiKey) {
  const results = await Promise.allSettled([
    fetchMadeOnSolJson('/kol/leaderboard?period=7d&limit=50&sort=winrate&min_winrate=55', apiKey),
    fetchMadeOnSolJson('/kol/leaderboard?period=30d&limit=50&sort=profit_factor&min_winrate=50', apiKey),
    fetchMadeOnSolJson('/alpha/leaderboard?limit=100&sort=win_rate', apiKey)
  ]);
  const [kolWinrate, kolPnl, alpha] = results;

  if (results.every((result) => result.status === 'rejected')) {
    throw new Error('MadeOnSol API tidak mengembalikan data leaderboard.');
  }

  const labels = {};
  [
    ...(kolWinrate.status === 'fulfilled' ? normalizeWalletRows(kolWinrate.value, 'KOL') : []),
    ...(kolPnl.status === 'fulfilled' ? normalizeWalletRows(kolPnl.value, 'KOL') : []),
    ...(alpha.status === 'fulfilled' ? normalizeWalletRows(alpha.value, 'Alpha Wallet') : [])
  ].forEach((item) => {
    labels[item.address] = {
      name: item.name,
      type: item.type,
      x: item.x,
      source: 'MadeOnSol',
      winRate: item.winRate,
      pnl: item.pnl
    };
  });

  return labels;
}

async function fetchMadeOnSolJson(path, apiKey) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  try {
    const response = await fetch(`${MADEONSOL_API}${path}`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`MadeOnSol ${response.status} ${response.statusText}`);
    }

    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeWalletRows(value, fallbackType) {
  const rows = normalizeList(value?.leaderboard || value?.wallets || value?.data || value?.results || value);
  return rows
    .map((row) => {
      const address = row.wallet || row.wallet_address || row.address || row.owner || row.publicKey || row.trader;
      if (!isSolanaAddress(address)) return null;

      return {
        address,
        name: row.name || row.kol_name || row.label || row.twitter || shortAddress(address),
        type: row.type || row.category || fallbackType,
        x: row.twitter_url || row.kol_twitter || row.twitter || null,
        winRate: Number(row.win_rate || row.winrate || row.winRate || 0) || null,
        pnl: Number(row.pnl || row.realized_pnl || row.profit || 0) || null
      };
    })
    .filter(Boolean);
}

function parseWalletLabels(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((labels, item) => {
      const [address, name = 'Configured Smart Wallet', type = 'Smart Wallet', x = null] = item.split(':').map((part) => part.trim());
      if (isSolanaAddress(address)) labels[address] = { name, type, x, source: 'SMART_WALLETS' };
      return labels;
    }, {});
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.rows)) return value.rows;
  return [];
}

function setCacheHeaders(res, maxAgeSeconds) {
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(60, Math.floor(maxAgeSeconds))}, stale-while-revalidate=600`);
}

function isSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(value || ''));
}

function shortAddress(address) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`.toUpperCase();
}
