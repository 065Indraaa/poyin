import { CONFIG } from './config.js';
import { tokenDb, deployerDb, holderDb } from './db.js';
import { fetchFundingSources, fetchMintAuthority, fetchTopHolders, fetchMadeOnSolTokenIntel } from './ingestors.js';

// ═══════════════════════════════════════════════════════════════════════════════
// A. Bundle Graph Analyzer
// ═══════════════════════════════════════════════════════════════════════════════
export async function analyzeBundleGraph(ca, holders) {
  if (!holders || holders.length < 2) return { score: 0, cluster: false, details: [] };

  const owners = holders.map((h) => h.owner).filter(Boolean);
  const fundingMap = await fetchFundingSources(owners);

  // Build reverse index: funder -> [holders]
  const funderToHolders = new Map();
  for (const [holder, funders] of fundingMap.entries()) {
    for (const funder of funders) {
      if (!funderToHolders.has(funder)) funderToHolders.set(funder, new Set());
      funderToHolders.get(funder).add(holder);
    }
  }

  const clusters = [];
  const visitedFunders = new Set();

  for (const [funder, holderSet] of funderToHolders.entries()) {
    if (holderSet.size >= 2) {
      clusters.push({
        funder: `${funder.slice(0, 4)}...${funder.slice(-4)}`,
        funderFull: funder,
        holderCount: holderSet.size,
        holders: Array.from(holderSet).map((h) => `${h.slice(0, 4)}...${h.slice(-4)}`),
      });
    }
  }

  // CEX funding whitelist
  const cexPatterns = /coinbase|kraken|binance|okx|bybit|kucoin/i;
  const legitFunders = clusters.filter((c) => cexPatterns.test(c.funder)).length;
  const suspiciousClusters = clusters.filter((c) => !cexPatterns.test(c.funder));

  let score = 0;
  if (suspiciousClusters.length >= 3) score += 8;
  else if (suspiciousClusters.length >= 2) score += 5;
  else if (suspiciousClusters.length >= 1) score += 2;

  const top10Pct = holders.reduce((s, h) => s + (h.pct || 0), 0);
  const uniqueOwners = new Set(owners).size;
  if (top10Pct > 70 && uniqueOwners <= 4) score += 4;
  else if (top10Pct > 55 && uniqueOwners <= 6) score += 2;

  const detailTexts = [
    ...suspiciousClusters.map((c) => `${c.holderCount} wallet didanai dari ${c.funder}`),
    legitFunders > 0 ? `${legitFunders} cluster funding dari CEX (green flag)` : null,
  ].filter(Boolean);

  return {
    score: Math.min(score, 10),
    cluster: score >= 5,
    clusters: suspiciousClusters,
    legitFunders,
    details: detailTexts,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// B. Dev / Deployer Tracker
// ═══════════════════════════════════════════════════════════════════════════════
export async function analyzeDeployer(ca, madeOnSolIntel) {
  const deployer = madeOnSolIntel?.deployer?.address || madeOnSolIntel?.deployer?.wallet || null;
  if (!deployer) return { known: false, reputation: null, alerts: [] };

  const rep = deployerDb.score(deployer);
  const alerts = [];

  if (rep) {
    if (rep.rugRate >= 0.5) alerts.push(`Deployer pernah nge-rug ${rep.rugs} dari ${rep.total} token`);
    else if (rep.rugs >= 1) alerts.push(`Deployer punya history rug ${rep.rugs} token`);
    if (rep.total >= 10) alerts.push(`Deployer super aktif: ${rep.total} token. Waspada farming fee.`);
  }

  return {
    known: Boolean(rep),
    address: deployer,
    reputation: rep || { total: 0, rugs: 0, rugRate: 0, reputation: 'unknown' },
    alerts,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// C. Multi-Type Rug Detector
// ═══════════════════════════════════════════════════════════════════════════════
export function detectRug(tokenData) {
  const alerts = [];
  let severity = 'low'; // low | medium | high | critical

  const { snapshots, alerts: prevAlerts } = tokenData || { snapshots: [], alerts: [] };
  const latest = snapshots[snapshots.length - 1] || {};
  const prev = snapshots[snapshots.length - 2] || {};

  // 1. Instant Rug: LP pull / liquidity crash
  if (latest.liquidityUsd && prev.liquidityUsd) {
    const drop = (prev.liquidityUsd - latest.liquidityUsd) / prev.liquidityUsd;
    if (drop > 0.5) {
      alerts.push(`Likuiditas anjlok ${(drop * 100).toFixed(0)}% — kemungkinan LP pull`);
      severity = escalate(severity, 'critical');
    } else if (drop > 0.25) {
      alerts.push(`Likuiditas turun signifikan ${(drop * 100).toFixed(0)}%`);
      severity = escalate(severity, 'high');
    }
  }

  // 2. Volume Death
  if (latest.volume5m != null && prev.volume5m != null && prev.volume5m > 0) {
    const vDrop = (prev.volume5m - latest.volume5m) / prev.volume5m;
    if (vDrop > 0.9) {
      alerts.push(`Volume mati mendadak (-${(vDrop * 100).toFixed(0)}%)`);
      severity = escalate(severity, 'high');
    }
  }

  // 3. Sell Pressure Spike
  if (latest.sells5m && latest.buys5m && latest.sells5m > latest.buys5m * 3 + 5) {
    alerts.push(`Sell pressure ekstrem: ${latest.sells5m} sell vs ${latest.buys5m} buy (5m)`);
    severity = escalate(severity, 'high');
  }

  // 4. Price Cliff
  if (latest.priceChange?.m5 != null && latest.priceChange.m5 < -20) {
    alerts.push(`Dump keras -${Math.abs(latest.priceChange.m5).toFixed(1)}% dalam 5 menit`);
    severity = escalate(severity, 'medium');
  }
  if (latest.priceChange?.h1 != null && latest.priceChange.h1 < -40) {
    alerts.push(`Trend hancur -${Math.abs(latest.priceChange.h1).toFixed(1)}% dalam 1 jam`);
    severity = escalate(severity, 'high');
  }

  // 5. Holder stagnation / drop (proxy: txns drop)
  if (latest.txns5m != null && latest.txns5m <= 2 && tokenData?.createdAt && Date.now() - tokenData.createdAt > 30 * 60000) {
    alerts.push(`Transaksi hampir mati — token kemungkinan dead`);
    severity = escalate(severity, 'medium');
  }

  // 6. Bonding curve failure (soon token with no volume for hours)
  if (latest.phase === 'soon' && latest.txns5m === 0 && snapshots.length > 12) {
    const lastActive = [...snapshots].reverse().find((s) => s.txns5m > 0);
    if (lastActive && Date.now() - lastActive._ts > 2 * 3600000) {
      alerts.push(`Bonding curve sepi >2 jam — migrate kemungkinan gagal`);
      severity = escalate(severity, 'medium');
    }
  }

  return { severity, alerts, isRug: severity === 'critical' || severity === 'high' };
}

function escalate(current, next) {
  const order = ['low', 'medium', 'high', 'critical'];
  return order[Math.max(order.indexOf(current), order.indexOf(next))];
}

// ═══════════════════════════════════════════════════════════════════════════════
// D. Progressive Scan Orchestrator
// ═══════════════════════════════════════════════════════════════════════════════
export async function runProgressiveScan(ca) {
  const results = { stages: {}, completed: [] };

  // Stage 1: Instant Red Flags (RPC + Cache)
  const cached = tokenDb.get(ca);
  const mint = await fetchMintAuthority(ca);
  const redFlags = [];

  if (mint) {
    if (mint.mintAuthority) redFlags.push({ level: 'critical', text: 'Mint authority masih aktif — dev bisa print token kapan aja' });
    if (mint.freezeAuthority) redFlags.push({ level: 'critical', text: 'Freeze authority aktif — wallet bisa dibekukan' });
  }

  const madeOnSol = await fetchMadeOnSolTokenIntel(ca);
  if (madeOnSol?.blacklisted) {
    redFlags.push({ level: 'critical', text: `Token di-blacklist MadeOnSol: ${madeOnSol.blacklistCategory || 'scam'}` });
  }

  results.stages.instant = {
    ready: true,
    redFlags,
    mintStatus: mint
      ? { mintRevoked: !mint.mintAuthority, freezeActive: !!mint.freezeAuthority, supply: mint.supply }
      : null,
    madeOnSol: madeOnSol
      ? { blacklisted: madeOnSol.blacklisted, deployer: madeOnSol.deployer, ageSeconds: madeOnSol.ageSeconds }
      : null,
  };
  results.completed.push('instant');

  // Stage 2: Holder Forensic + Bundle Graph
  const holders = await fetchTopHolders(ca, mint?.supply || 0);
  let bundle = { score: 0, cluster: false, details: [] };
  let holderStats = null;

  if (holders) {
    const top10Pct = holders.slice(0, 10).reduce((s, h) => s + (h.pct || 0), 0);
    const uniqueOwners = new Set(holders.map((h) => h.owner).filter(Boolean)).size;
    const burners = holders.filter((h) => h.owner && h.ownerBalance != null ? h.ownerBalance <= 0.05 : false).length;
    holderStats = { top10Pct, uniqueOwners, totalHolders: holders.length, burners };
    bundle = await analyzeBundleGraph(ca, holders);
    if (top10Pct > 60) redFlags.push({ level: 'high', text: `Top 10 holder megang ${top10Pct.toFixed(1)}% supply — super konsentrasi` });
    if (uniqueOwners <= 3 && holders.length >= 5) redFlags.push({ level: 'high', text: `Cuma ${uniqueOwners} owner unik di top holder — indikasi cluster` });
  }

  results.stages.holder = { ready: true, holders, holderStats, bundle };
  results.completed.push('holder');

  // Stage 3: Deployer & Market Intel
  const deployer = await analyzeDeployer(ca, madeOnSol);
  if (deployer.alerts.length) {
    deployer.alerts.forEach((a) => redFlags.push({ level: 'high', text: a }));
  }

  results.stages.deployer = { ready: true, deployer };
  results.completed.push('deployer');

  // Stage 4: Market + Trend
  const { pollDexTokenSnapshot } = await import('./ingestors.js');
  const market = await pollDexTokenSnapshot(ca);

  results.stages.market = { ready: true, market };
  results.completed.push('market');

  // Final Assembly
  results.redFlags = redFlags;
  results.verdict = computeVerdict(redFlags, bundle, holderStats, deployer, market);
  results.completed.push('final');

  // Persist
  tokenDb.save(ca, { lastScan: results, holderStats, deployer: deployer.address });
  if (market) tokenDb.pushSnapshot(ca, market);
  if (holders) holderDb.save(ca, { holders, bundle });
  if (madeOnSol?.deployer?.address) deployerDb.track(madeOnSol.deployer.address, ca, { isRug: results.verdict.isRug });

  return results;
}

function computeVerdict(redFlags, bundle, holderStats, deployer, market) {
  let score = 58;
  let isRug = false;
  let instruction = 'Masuk bertahap';
  let tone = 'watch';

  const critical = redFlags.filter((r) => r.level === 'critical').length;
  const high = redFlags.filter((r) => r.level === 'high').length;

  if (critical >= 1) { score = Math.min(score, 15); isRug = true; instruction = 'Hindari aja'; tone = 'danger'; }
  else if (high >= 2) { score = Math.min(score, 30); instruction = 'Khusus scalper pro'; tone = 'warning'; }
  else if (high === 1) { score = Math.min(score, 50); instruction = 'Masuk bertahap'; tone = 'watch'; }

  if (bundle.cluster) { score -= 12; }
  if (holderStats?.top10Pct > 55) { score -= 10; }
  if (deployer.reputation?.rugRate > 0.3) { score -= 15; }

  if (score >= 75) { instruction = 'Layak dipantau serius'; tone = 'good'; }

  return { score: Math.max(0, Math.min(100, score)), isRug, instruction, tone };
}
