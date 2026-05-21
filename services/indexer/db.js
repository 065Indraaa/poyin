import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(name, fallback = {}) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(name, data) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 0));
  fs.renameSync(tmp, file);
}

// Token time-series: { [ca]: { snapshots: [], lastSeenAt, firstSeenAt, phase, alerts: [] } }
export const tokenDb = {
  getAll() {
    return readJson('tokens', {});
  },
  get(ca) {
    const all = this.getAll();
    return all[ca] || null;
  },
  save(ca, patch) {
    const all = this.getAll();
    const existing = all[ca] || { ca, snapshots: [], alerts: [], createdAt: Date.now() };
    all[ca] = { ...existing, ...patch, updatedAt: Date.now() };
    writeJson('tokens', all);
    return all[ca];
  },
  pushSnapshot(ca, snapshot) {
    const all = this.getAll();
    const existing = all[ca] || { ca, snapshots: [], alerts: [], createdAt: Date.now() };
    existing.snapshots.push({ ...snapshot, _ts: Date.now() });
    if (existing.snapshots.length > 288) existing.snapshots.shift();
    existing.updatedAt = Date.now();
    all[ca] = existing;
    writeJson('tokens', all);
    return existing;
  },
  addAlert(ca, alert) {
    const all = this.getAll();
    const existing = all[ca] || { ca, snapshots: [], alerts: [], createdAt: Date.now() };
    existing.alerts.push({ ...alert, at: Date.now() });
    if (existing.alerts.length > 50) existing.alerts.shift();
    all[ca] = existing;
    writeJson('tokens', all);
  },
  listRecent(limit = 200) {
    const all = Object.values(this.getAll());
    return all
      .filter((t) => t.snapshots?.length)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, limit);
  },
};

// Deployer reputation: { [address]: { tokens: [], rugCount, lastTokenAt } }
export const deployerDb = {
  getAll() {
    return readJson('deployers', {});
  },
  track(deployerAddress, tokenCa, { isRug = false } = {}) {
    if (!deployerAddress) return;
    const all = this.getAll();
    const existing = all[deployerAddress] || { address: deployerAddress, tokens: [], rugCount: 0, firstSeenAt: Date.now() };
    if (!existing.tokens.includes(tokenCa)) existing.tokens.push(tokenCa);
    if (isRug) existing.rugCount = (existing.rugCount || 0) + 1;
    existing.lastTokenAt = Date.now();
    all[deployerAddress] = existing;
    writeJson('deployers', all);
  },
  score(deployerAddress) {
    const d = this.getAll()[deployerAddress];
    if (!d) return null;
    const total = d.tokens.length;
    const rugs = d.rugCount || 0;
    return {
      total,
      rugs,
      rugRate: total > 0 ? rugs / total : 0,
      reputation: rugs >= 3 ? 'notorious' : rugs >= 1 ? 'sus' : total >= 5 ? 'prolific' : 'unknown',
    };
  },
};

// Holder graph: { [ca]: { holders: [], fundingGraph: {}, lastUpdatedAt } }
export const holderDb = {
  getAll() {
    return readJson('holders', {});
  },
  save(ca, data) {
    const all = this.getAll();
    all[ca] = { ...data, lastUpdatedAt: Date.now() };
    writeJson('holders', all);
  },
  get(ca) {
    return this.getAll()[ca] || null;
  },
};
