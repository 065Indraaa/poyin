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

export async function buildSmartWalletRegistry() {
  const labels = parseWalletLabels(process.env.SMART_WALLETS || process.env.VITE_SMART_WALLETS || '');
  const sources = [];
  const warnings = [];
  if (Object.keys(labels).length) sources.push('SMART_WALLETS');

  const apiKey = (
    process.env.MADEONSOL_API_KEY ||
    process.env.VITE_MADEONSOL_API_KEY ||
    process.env.ONSOL_API_KEY ||
    process.env.ON_SOL_API_KEY ||
    process.env.MADE_ON_SOL_API_KEY ||
    ''
  ).trim();
  if (apiKey) {
    try {
      const madeOnSol = await fetchMadeOnSolWalletLabels(apiKey);
      Object.assign(labels, madeOnSol.labels);
      warnings.push(...madeOnSol.warnings);
      if (Object.keys(madeOnSol.labels).length) sources.push('indeks wallet eksternal');
      else sources.push('key indeks wallet terdeteksi');
    } catch (error) {
      warnings.push(error.message);
      sources.push('key indeks wallet terdeteksi, data belum tersedia');
    }
  }

  return {
    labels,
    size: Object.keys(labels).length,
    source: sources.length ? sources.join(' + ') : 'belum dikonfigurasi',
    warnings,
    fetchedAt: new Date().toISOString(),
    ttlSeconds: Math.round(CACHE_TTL_MS / 1000)
  };
}

async function fetchMadeOnSolWalletLabels(apiKey) {
  const requests = [
    { path: '/kol/feed?limit=10', type: 'KOL Aktif', required: true },
    ...getPaidMadeOnSolRequests()
  ];

  const results = await Promise.allSettled(
    requests.map((request) => fetchMadeOnSolJson(request.path, apiKey))
  );

  const feedResult = results[0];
  if (feedResult.status === 'rejected') {
    return {
      labels: {},
      warnings: [summarizeMadeOnSolFailures(results)]
    };
  }

  const labels = {};
  const warnings = [];
  results.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      if (requests[index].required) warnings.push(summarizeMadeOnSolFailures([result]));
      return;
    }

    normalizeWalletRows(result.value, requests[index].type).forEach((item) => {
      labels[item.address] = {
        name: item.name,
        type: item.type,
        x: item.x,
        source: 'indeks wallet eksternal',
        winRate: item.winRate,
        pnl: item.pnl,
        roi: item.roi,
        confidence: item.confidence
      };
    });
  });

  return { labels, warnings };
}

function summarizeMadeOnSolFailures(results) {
  const statuses = results.map((result) => parseHttpStatus(result.reason?.message)).filter(Boolean);
  if (statuses.every((status) => status === 403)) {
    return 'Key indeks wallet terbaca, tetapi akses leaderboard/feed ditolak. Cek izin API key, plan, atau isi SMART_WALLETS sebagai fallback.';
  }

  if (statuses.every((status) => status === 401)) {
    return 'Key indeks wallet terbaca, tetapi autentikasi ditolak. Cek ulang nilai API key di env Vercel.';
  }

  if (statuses.length) {
    return `Indeks wallet belum mengembalikan data. Status terakhir: ${[...new Set(statuses)].join(', ')}.`;
  }

  return 'Indeks wallet belum mengembalikan data leaderboard/feed.';
}

function getPaidMadeOnSolRequests() {
  const includePaid = ['1', 'true', 'yes'].includes(String(process.env.MADEONSOL_INCLUDE_PAID_ENDPOINTS || '').toLowerCase());
  if (!includePaid) return [];

  return [
    { path: '/kol/leaderboard?period=7d&limit=50&sort=pnl', type: 'KOL' },
    { path: '/kol/leaderboard?period=30d&limit=50&sort=winrate', type: 'KOL' },
    { path: '/alpha/leaderboard?period=all&limit=50&sort=win_rate&min_tokens=3&exclude_bots=true', type: 'Alpha Wallet' },
    { path: '/alpha/leaderboard?period=30d&limit=50&sort=pnl&min_tokens=3&exclude_bots=true', type: 'Alpha Wallet' }
  ];
}

function parseHttpStatus(message = '') {
  const match = String(message).match(/\b(4\d\d|5\d\d)\b/);
  return match ? Number(match[1]) : null;
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
  const rows = normalizeList(value?.leaderboard || value?.trades || value?.wallets || value?.data || value?.results || value);
  return rows
    .map((row) => {
      const address = pickWalletAddress(row);
      if (!isSolanaAddress(address)) return null;

      return {
        address,
        name: pickFirstText(row.name, row.kol_name, row.kolName, row.kol?.name, row.label, row.twitter, row.username, row.kol?.twitter, shortAddress(address)),
        type: pickFirstText(row.type, row.category, row.strategy, row.kol_strategy_tag, fallbackType),
        x: pickFirstText(row.twitter_url, row.kol_twitter, row.twitter, row.twitterUsername, row.username, row.kol?.twitter, row.kol?.username, null),
        winRate: normalizeRate(row.win_rate || row.winrate || row.winRate),
        pnl: Number(row.pnl || row.realized_pnl || row.profit || row.net_pnl || row.net_pnl_sol || 0) || null,
        roi: Number(row.roi || row.roi_pct || row.return_pct || 0) || null,
        confidence: Number(row.confidence || row.confidence_score || row.tokens_traded || 0) || null
      };
    })
    .filter(Boolean);
}

function pickWalletAddress(row = {}) {
  const candidates = [
    row.wallet,
    row.wallet_address,
    row.walletAddress,
    row.address,
    row.owner,
    row.publicKey,
    row.trader,
    row.trader_address,
    row.traderAddress,
    row.kol,
    row.kol_wallet,
    row.kolWallet,
    row.kolAddress,
    row.kol_address,
    row.kol?.wallet,
    row.kol?.wallet_address,
    row.kol?.address,
    row.kol?.publicKey,
    row.trader?.wallet,
    row.trader?.address,
    row.user?.wallet,
    row.user?.address
  ];

  return candidates.find(isSolanaAddress) || null;
}

function pickFirstText(...values) {
  return values.find((value) => typeof value === 'string' && value.trim()) || null;
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

function normalizeRate(value) {
  const rate = Number(value || 0);
  if (!rate) return null;
  return rate <= 1 ? rate * 100 : rate;
}
