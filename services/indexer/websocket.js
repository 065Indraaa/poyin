import { WebSocketServer } from 'ws';

let wss = null;
const clients = new Set();

export function startWebSocketServer(server) {
  wss = new WebSocketServer({ server, path: '/indexer-ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.send(JSON.stringify({ type: 'connected', msg: 'Indexer WS ready' }));

    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));
  });

  console.log('[WS] Attached on /indexer-ws');
}

export function broadcast(payload) {
  const msg = JSON.stringify(payload);
  for (const ws of clients) {
    if (ws.readyState === 1) {
      try { ws.send(msg); } catch { /* ignore */ }
    }
  }
}

export function getClientsCount() {
  return clients.size;
}
