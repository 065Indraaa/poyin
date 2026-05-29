import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';
import smartWalletsHandler from './api/smart-wallets.js';
import tokenIntelHandler from './api/token-intel.js';
import healthHandler from './api/health.js';
import scanDeepHandler from './api/scan-deep.js';
import feedEnrichedHandler from './api/feed-enriched.js';
import birdeyeHandler from './api/birdeye.js';
import jupiterHandler from './api/jupiter.js';
import pumpfunHandler from './api/pumpfun.js';
import verifyFollowHandler from './api/verify-follow.js';
import feedOmnibusHandler from './api/feed-omnibus.js';
import statsHandler from './api/stats.js';
import { startIndexerEngine } from './services/indexer/engine.js';
import { startWebSocketServer } from './services/indexer/websocket.js';

const app = express();

app.use(cors());
app.use(express.json());

// existing endpoints
app.post('/api/chat', chatHandler);
app.get('/api/smart-wallets', smartWalletsHandler);
app.get('/api/token-intel', tokenIntelHandler);
app.get('/api/health', healthHandler);

// new indexer endpoints
app.get('/api/scan-deep', scanDeepHandler);
app.get('/api/feed-enriched', feedEnrichedHandler);

// new market provider proxies (Birdeye, Jupiter, Pump.fun)
app.get('/api/birdeye', birdeyeHandler);
app.get('/api/jupiter', jupiterHandler);
app.get('/api/pumpfun', pumpfunHandler);

// verify X follow status (auto-check)
app.post('/api/verify-follow', verifyFollowHandler);

// omnibus: gabungan feed-enriched + pumpfun + health (hemat edge request)
app.get('/api/feed-omnibus', feedOmnibusHandler);

// public stats: jumlah user terdaftar
app.get('/api/stats', statsHandler);

// test endpoint
app.get('/', (req, res) => {
  res.send('🚀 Ponyin Chatbot + Indexer Server Running');
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Attach WebSocket & start background indexer
startWebSocketServer(server);
startIndexerEngine();
