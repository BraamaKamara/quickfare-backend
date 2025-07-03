// utils/qrGenerator.js

const QRCode = require('qrcode');

/**
 * Generates a base64 QR code image string from the given text.
 * @param {string} text - The text to encode in the QR code (e.g., payment link or payload).
 * @returns {Promise<string>} - Base64-encoded QR image.
 */
async function generateQRCode(text) {
  try {
    const qrDataURL = await QRCode.toDataURL(text);
    return qrDataURL;
  } catch (err) {
    console.error('❌ QR code generation failed:', err);
    throw new Error('Could not generate QR code');
  }
}

module.exports = generateQRCode;
