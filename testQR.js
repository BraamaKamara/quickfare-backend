// testQR.js

const generateQRCode = require('./utils/qrGenerator');

(async () => {
  const img = await generateQRCode('https://quickfare.zm/pay/tx123');
  console.log('\n🖼️ Generated QR Code (Base64 Image String):\n');
  console.log(img); // This will be a long base64 string representing the QR code image
})();
