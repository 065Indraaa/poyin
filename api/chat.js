export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Format body tidak valid (messages harus array)'
      });
    }

    const key = process.env.MEGALLM_API_KEY;

    const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v3.1',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('MegaLLM Error:', text);
      return res.status(response.status).send(text);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(text);
    console.log("🔥 FILE CHAT.JS YANG DIPAKAI");
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}