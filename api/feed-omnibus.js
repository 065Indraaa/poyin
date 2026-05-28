import feedHandler from './feed-enriched.js';
import pumpfunHandler from './pumpfun.js';
import healthHandler from './health.js';

async function invoke(handler, req) {
  let payload = null;
  const mockRes = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    setHeader() { return this; },
    json(data) { payload = data; return this; },
    send(data) { payload = data; return this; },
  };
  await handler(req, mockRes);
  return payload;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const [feed, pumpfun, health] = await Promise.allSettled([
    invoke(feedHandler, req),
    invoke(pumpfunHandler, req),
    invoke(healthHandler, req)
  ]);

  res.setHeader('Cache-Control', 'private, max-age=5');
  res.status(200).json({
    ok: true,
    feed: feed.status === 'fulfilled' ? feed.value : null,
    pumpfun: pumpfun.status === 'fulfilled' ? pumpfun.value : null,
    health: health.status === 'fulfilled' ? health.value : null,
    fetchedAt: new Date().toISOString()
  });
}
