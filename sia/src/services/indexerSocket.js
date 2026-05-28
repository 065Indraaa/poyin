// ─── Smart connection: WebSocket first, auto-fallback to polling ─────────────
// Vercel is serverless → does NOT support persistent WebSocket.
// Set VITE_INDEXER_WS_URL in your Vercel env dashboard pointing to an external
// backend host (Railway, Render, Fly.io, VPS). If empty or unreachable,
// the frontend automatically falls back to short-polling.

const WS_URL = import.meta.env.VITE_INDEXER_WS_URL || '';
const POLL_INTERVAL_MS = 60000; // 60 detik — hemat Vercel hit count

let ws = null;
let reconnectTimer = null;
let pollTimer = null;
let isFallback = false;
let lastPollAt = 0;
let isPolling = false;
let visibilityHandler = null;

function getWsUrl() {
  if (WS_URL) return WS_URL;
  // Derive from current host (works on local dev where server.js runs together)
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/indexer-ws`;
}

export function connectIndexerSocket(onMessage) {
  // If explicit WS URL is empty and we are on Vercel (https), skip WS entirely
  // because Vercel serverless cannot hold a persistent WS connection.
  if (!WS_URL && window.location.protocol === 'https:') {
    startFallbackPolling(onMessage);
    return () => stopFallbackPolling();
  }

  const url = getWsUrl();

  try {
    ws = new WebSocket(url);
  } catch {
    startFallbackPolling(onMessage);
    return () => stopFallbackPolling();
  }

  ws.onopen = () => {
    isFallback = false;
    stopFallbackPolling();
    console.log('[Indexer] WS connected');
  };

  ws.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    } catch {}
  };

  ws.onclose = () => {
    if (!isFallback) {
      console.warn('[Indexer] WS closed, switching to poll fallback');
      startFallbackPolling(onMessage);
    }
  };

  ws.onerror = () => {
    ws.close();
  };

  return () => {
    clearTimeout(reconnectTimer);
    stopFallbackPolling();
    ws?.close();
    ws = null;
  };
}

// ─── Fallback polling ────────────────────────────────────────────────────────
function startFallbackPolling(onMessage) {
  if (isFallback) return;
  isFallback = true;
  console.log('[Indexer] Using poll fallback (Vercel-safe)');

  // Immediate first poll
  doPoll(onMessage);

  pollTimer = setInterval(() => {
    if (document.hidden) return; // skip kalau tab tidak aktif
    doPoll(onMessage);
  }, POLL_INTERVAL_MS);

  // Hentikan polling kalau tab hidden, resume kalau visible
  visibilityHandler = () => {
    if (!document.hidden) doPoll(onMessage);
  };
  document.addEventListener('visibilitychange', visibilityHandler);
}

function stopFallbackPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }
}

async function doPoll(onMessage) {
  if (isPolling) return; // no-overlap guard
  isPolling = true;
  try {
    const res = await fetch(`/api/feed-enriched?phase=all&limit=50`);
    if (!res.ok) return;
    const data = await res.json();

    // Emit a synthetic discovery message so the UI can update counts
    onMessage({ type: 'poll_discovery', tokens: data.tokens, counts: data.counts });

    // If any token has critical alerts, emit them
    const alerted = (data.tokens || []).filter((t) => t.redFlagCount > 0 || t.latestAlert);
    for (const t of alerted) {
      onMessage({
        type: 'alert',
        ca: t.ca,
        severity: t.latestAlert?.severity || 'warn',
        alerts: [t.latestAlert?.text || 'Red flag detected'],
      });
    }
  } catch {
    // Silently ignore poll failures
  } finally {
    isPolling = false;
  }
}

// ─── HTTP API wrappers ───────────────────────────────────────────────────────
export async function fetchScanDeep(ca) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`/api/scan-deep?ca=${encodeURIComponent(ca)}`, { signal: controller.signal });
    if (!res.ok) throw new Error('Scan deep gagal');
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchEnrichedFeed(phase = 'all', limit = 50) {
  const res = await fetch(`/api/feed-enriched?phase=${phase}&limit=${limit}`);
  if (!res.ok) throw new Error('Feed enriched gagal');
  return res.json();
}
