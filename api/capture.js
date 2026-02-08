// api/capture.js - Simplified for Node.js 20+
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // Just acknowledge receipt
    console.log('Capture received:', data.count);

    return res.status(200).json({
      success: true,
      message: `Capture ${data.count} received`
    });

  } catch (error) {
    console.error('Capture error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export const config = {
  runtime: 'edge',
};
