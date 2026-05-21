let ws = null;
let reconnectTimer = null;
let messageHandlers = [];

export function connectIndexerSocket(onMessage) {
  if (ws?.readyState === 1) return () => {};

  const url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/indexer-ws`;
  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('[IndexerWS] Connected');
  };

  ws.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    } catch {}
  };

  ws.onclose = () => {
    reconnectTimer = setTimeout(() => connectIndexerSocket(onMessage), 3000);
  };

  ws.onerror = () => {
    ws.close();
  };

  return () => {
    clearTimeout(reconnectTimer);
    ws?.close();
    ws = null;
  };
}

export async function fetchScanDeep(ca) {
  const res = await fetch(`/api/scan-deep?ca=${encodeURIComponent(ca)}`);
  if (!res.ok) throw new Error('Scan deep gagal');
  return res.json();
}

export async function fetchEnrichedFeed(phase = 'all', limit = 50) {
  const res = await fetch(`/api/feed-enriched?phase=${phase}&limit=${limit}`);
  if (!res.ok) throw new Error('Feed enriched gagal');
  return res.json();
}
