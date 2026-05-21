import { tokenDb } from '../services/indexer/db.js';
import { pollDexDiscovery } from '../services/indexer/ingestors.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const phase = req.query?.phase || 'all';
  const limit = Math.min(Number(req.query?.limit || 50), 200);

  let tokens = tokenDb.listRecent(300);

  // Fallback: kalau indexer DB kosong (misal di Vercel tanpa backend indexer),
  // fetch langsung dari DexScreener discovery supaya UI tetap hidup.
  if (!tokens.length) {
    try {
      const live = await pollDexDiscovery();
      tokens = live.map((t) => ({
        ca: t.ca,
        snapshots: [t],
        alerts: [],
        updatedAt: Date.now(),
      }));
    } catch {
      tokens = [];
    }
  }

  // Enrich with pipeline phases
  tokens = tokens.map((t) => {
    const latest = t.snapshots?.[t.snapshots.length - 1] || {};
    const alerts = t.alerts || [];
    const isDead = alerts.some(
      (a) => a.severity === 'critical' || a.text?.includes('dead') || a.text?.includes('LP pull')
    );

    return {
      ca: t.ca,
      name: latest.name || 'Unknown',
      ticker: latest.ticker || '???',
      phase: isDead ? 'dead' : latest.phase || 'new',
      ageMinutes: latest.ageMinutes ?? null,
      liquidityUsd: latest.liquidityUsd || 0,
      marketCap: latest.marketCap || 0,
      volume5m: latest.volume5m || 0,
      priceChange: latest.priceChange || { m5: 0, h1: 0, h6: 0, h24: 0 },
      txns5m: latest.txns5m || 0,
      buys5m: latest.buys5m || 0,
      sells5m: latest.sells5m || 0,
      redFlagCount: alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length,
      latestAlert: alerts[alerts.length - 1] || null,
      _lastSeenAt: t.updatedAt,
    };
  });

  if (phase !== 'all') {
    tokens = tokens.filter((t) => t.phase === phase);
  }

  // Pipeline priority sort: new > early > soon > migrated > dead
  const phaseRank = { new: 0, early: 1, soon: 2, migrated: 3, dead: 4 };
  tokens.sort((a, b) => {
    const ra = phaseRank[a.phase] ?? 99;
    const rb = phaseRank[b.phase] ?? 99;
    if (ra !== rb) return ra - rb;
    return (b.volume5m || 0) - (a.volume5m || 0);
  });

  return res.status(200).json({
    tokens: tokens.slice(0, limit),
    total: tokens.length,
    counts: {
      new: tokens.filter((t) => t.phase === 'new').length,
      early: tokens.filter((t) => t.phase === 'early').length,
      soon: tokens.filter((t) => t.phase === 'soon').length,
      migrated: tokens.filter((t) => t.phase === 'migrated').length,
      dead: tokens.filter((t) => t.phase === 'dead').length,
    },
    fallback: !tokenDb.listRecent(1).length,
    fetchedAt: new Date().toISOString(),
  });
}
