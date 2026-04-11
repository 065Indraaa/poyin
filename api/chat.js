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

    const key = (process.env.MOONSHOT_API_KEY || '').trim();

    if (!key) {
      return res.status(500).json({ error: 'MOONSHOT_API_KEY tidak ditemukan di environment' });
    }

    console.log(`[Moonshot] Using key: ${key.substring(0, 12)}... (len=${key.length})`);

    const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages: messages,
        temperature: 1,
        max_tokens: 1000
      })
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Moonshot AI Error:', text);
      return res.status(response.status).send(text);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(text);
    console.log("🔥 Moonshot AI (Kimi k2.5) response OK");
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}