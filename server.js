import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';
import smartWalletsHandler from './api/smart-wallets.js';
import tokenIntelHandler from './api/token-intel.js';
import healthHandler from './api/health.js';

const app = express();

app.use(cors());
app.use(express.json());

// endpoint chatbot
app.post('/api/chat', chatHandler);
app.get('/api/smart-wallets', smartWalletsHandler);
app.get('/api/token-intel', tokenIntelHandler);
app.get('/api/health', healthHandler);

// test endpoint
app.get('/', (req, res) => {
  res.send('🚀 Ponyin Chatbot Server Running');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
