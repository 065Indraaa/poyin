export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { providerToken, targetHandle } = req.body || {};
  if (!providerToken || !targetHandle) {
    return res.status(400).json({ ok: false, error: 'Missing providerToken or targetHandle' });
  }

  try {
    // X API v1.1 friendships/lookup mengembalikan relationship object
    // termasuk field "connections" yang berisi "following" jika caller sudah follow target.
    const url = `https://api.twitter.com/1.1/friendships/lookup.json?screen_name=${encodeURIComponent(targetHandle)}`;
    const xRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${providerToken}`,
        'User-Agent': 'ShouldIApe/1.0'
      }
    });

    if (!xRes.ok) {
      const text = await xRes.text();
      console.warn('[verify-follow] X API error:', xRes.status, text);
      return res.status(200).json({ ok: true, isFollowing: false, reason: `X API ${xRes.status}` });
    }

    const data = await xRes.json();
    const target = Array.isArray(data) ? data.find((u) => String(u.screen_name).toLowerCase() === String(targetHandle).toLowerCase()) : null;
    const connections = target?.connections || [];
    const isFollowing = connections.includes('following');

    return res.status(200).json({ ok: true, isFollowing, connections });
  } catch (err) {
    console.error('[verify-follow] error:', err);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
}
