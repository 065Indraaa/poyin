import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';

const app = express();

app.use(cors());
app.use(express.json());

// endpoint chatbot
app.post('/api/chat', chatHandler);

// test endpoint
app.get('/', (req, res) => {
  res.send('🚀 Ponyin Chatbot Server Running');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});