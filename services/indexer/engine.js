import { CONFIG } from './config.js';
import { tokenDb, deployerDb } from './db.js';
import { pollDexDiscovery, startPumpPortalIngestor } from './ingestors.js';
import { detectRug, runProgressiveScan } from './analyzers.js';
import { broadcast } from './websocket.js';

let isRunning = false;

export function startIndexerEngine() {
  if (isRunning) return;
  isRunning = true;

  console.log('[Indexer] Engine started');

  // 1. Ingestion loops
  setInterval(async () => {
    const tokens = await pollDexDiscovery();
    for (const token of tokens) {
      tokenDb.pushSnapshot(token.ca, token);
    }
    broadcast({ type: 'discovery', count: tokens.length });
  }, CONFIG.pollIntervals.dexDiscovery);

  // 2. PumpPortal real-time
  startPumpPortalIngestor((token) => {
    tokenDb.pushSnapshot(token.ca, token);
    broadcast({ type: 'pumpportal', token: { ca: token.ca, ticker: token.ticker, name: token.name } });
  });

  // 3. Background rug monitor
  setInterval(async () => {
    const tokens = tokenDb.listRecent(100);
    for (const t of tokens) {
      const rug = detectRug(t);
      if (rug.alerts.length > 0 && rug.severity !== 'low') {
        const existingAlerts = t.alerts || [];
        const newOnes = rug.alerts.filter((a) => !existingAlerts.some((e) => e.text === a));
        if (newOnes.length) {
          for (const a of newOnes) tokenDb.addAlert(t.ca, { severity: rug.severity, text: a });
          broadcast({ type: 'alert', ca: t.ca, severity: rug.severity, alerts: newOnes });
        }
      }
      if (rug.isRug && t.deployer) {
        deployerDb.track(t.deployer, t.ca, { isRug: true });
      }
    }
  }, CONFIG.pollIntervals.rugScan);

  // 4. Prune dead tokens
  setInterval(() => {
    const all = tokenDb.getAll();
    const now = Date.now();
    let pruned = 0;
    for (const ca in all) {
      const t = all[ca];
      const age = now - (t.updatedAt || t.createdAt || now);
      const isDead = t.alerts?.some((a) => a.severity === 'critical' || a.text.includes('dead'));
      if (age > 7 * 86400000 && isDead) {
        delete all[ca];
        pruned++;
      }
    }
    if (pruned) console.log(`[Indexer] Pruned ${pruned} dead tokens`);
  }, CONFIG.pollIntervals.tokenPrune);
}

export async function requestScan(ca) {
  try {
    const result = await runProgressiveScan(ca);
    broadcast({ type: 'scan_complete', ca, result: { verdict: result.verdict, redFlags: result.redFlags, stages: result.completed } });
    return result;
  } catch (e) {
    console.error('[Indexer] Scan failed:', e.message);
    throw e;
  }
}
