import { requestScan } from '../services/indexer/engine.js';
import { tokenDb } from '../services/indexer/db.js';

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
      return res.status(200).json({ ...cached, cached: true });
    }

    const result = await requestScan(ca);
    result._ts = Date.now();
    return res.status(200).json({ ...result, cached: false });
  } catch (error) {
    console.error('[API /scan-deep]', error.message);
    return res.status(500).json({ error: 'Scan gagal', message: error.message });
  }
}
