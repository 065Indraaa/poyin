const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const HTTP_TIMEOUT_MS = 8000;

let cache = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 30_000; // 30 detik

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const now = Date.now();
  if (cache && cacheExpiresAt > now) {
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({ ...cache, cached: true });
  }

  try {
    const count = await fetchMemberCount();
    const payload = { users: count, updatedAt: new Date().toISOString() };
    cache = payload;
    cacheExpiresAt = now + CACHE_TTL_MS;
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    console.warn('[stats] fetchMemberCount failed:', error.message);
    if (cache) {
      return res.status(200).json({ ...cache, cached: true, stale: true });
    }
    return res.status(200).json({ users: null, error: error.message || 'Gagal mengambil statistik' });
  }
}

async function fetchMemberCount() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL atau key belum dikonfigurasi');
  }

  const url = `${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json',
        'Prefer': 'count=exact'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Supabase ${response.status}`);
    }

    const contentRange = response.headers.get('content-range') || '';
    // Format: 0-0/123
    const match = contentRange.match(/\/(\d+)$/);
    const count = match ? parseInt(match[1], 10) : 0;
    return count;
  } finally {
    clearTimeout(timer);
  }
}
