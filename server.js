import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chatHandler from './api/chat.js';
import smartWalletsHandler from './api/smart-wallets.js';
import tokenIntelHandler from './api/token-intel.js';
import healthHandler from './api/health.js';
import birdeyeHandler from './api/birdeye.js';
import jupiterHandler from './api/jupiter.js';
import pumpfunHandler from './api/pumpfun.js';
import verifyFollowHandler from './api/verify-follow.js';
import statsHandler from './api/stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// API endpoints
app.post('/api/chat', chatHandler);
app.get('/api/smart-wallets', smartWalletsHandler);
app.get('/api/token-intel', tokenIntelHandler);
app.get('/api/health', healthHandler);
app.get('/api/birdeye', birdeyeHandler);
app.get('/api/jupiter', jupiterHandler);
app.get('/api/pumpfun', pumpfunHandler);
app.post('/api/verify-follow', verifyFollowHandler);
app.get('/api/stats', statsHandler);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`dYs? Server running on http://localhost:${PORT}`);
});