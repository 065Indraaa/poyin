import { requestScan } from '../services/indexer/engine.js';
import { tokenDb } from '../services/indexer/db.js';
import { pollDexTokenSnapshot, fetchMintAuthority } from '../services/indexer/ingestors.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ca = String(req.query?.ca || req.query?.address || '').trim();
  if (!ca || ca.length < 32) {
    return res.status(400).json({ error: 'Contract address gak valid' });
  }

  try {
    const cached = tokenDb.get(ca)?.lastScan;
    // If fresh cache (< 20s), return cached
    if (cached && Date.now() - (cached._ts || 0) < 20000) {
      res.setHeader('Cache-Control', 'private, max-age=5');
      return res.status(200).json({ ...cached, cached: true });
    }

    const result = await requestScan(ca);
    result._ts = Date.now();
    res.setHeader('Cache-Control', 'private, max-age=5');
    return res.status(200).json({ ...result, cached: false });
  } catch (error) {
    // Fallback: kalau indexer engine gak jalan (Vercel serverless),
    // fetch data langsung dari DexScreener + Helius supaya UI tetap kerja.
    try {
      const [market, mint] = await Promise.all([
        pollDexTokenSnapshot(ca),
        fetchMintAuthority(ca),
      ]);

      const redFlags = [];
      if (mint) {
        if (mint.mintAuthority) redFlags.push({ level: 'critical', text: 'Mint authority masih aktif — dev bisa print token kapan aja' });
        if (mint.freezeAuthority) redFlags.push({ level: 'critical', text: 'Freeze authority aktif — wallet bisa dibekukan' });
      }

      const fallbackResult = {
        stages: {
          instant: {
            ready: true,
            redFlags,
            mintStatus: mint
              ? { mintRevoked: !mint.mintAuthority, freezeActive: !!mint.freezeAuthority, supply: mint.supply }
              : null,
            madeOnSol: null,
          },
          holder: { ready: true, holders: null, holderStats: null, bundle: { score: 0, cluster: false, details: [] } },
          deployer: { ready: true, deployer: { known: false, reputation: null, alerts: [] } },
          market: { ready: true, market },
        },
        completed: ['instant', 'holder', 'deployer', 'market', 'final'],
        redFlags,
        verdict: {
          score: redFlags.some((r) => r.level === 'critical') ? 15 : 50,
          isRug: redFlags.some((r) => r.level === 'critical'),
          instruction: redFlags.some((r) => r.level === 'critical') ? 'Hindari aja' : 'Masuk bertahap',
          tone: redFlags.some((r) => r.level === 'critical') ? 'danger' : 'watch',
        },
        fallback: true,
        _ts: Date.now(),
        cached: false,
      };

      return res.status(200).json(fallbackResult);
    } catch {
      return res.status(500).json({ error: 'Scan gagal', message: error.message });
    }
  }
}
