// routes/qrRoutes.js

const express = require('express');
const router = express.Router();
const { Trip } = require('../models');
const generateQRCode = require('../utils/qrGenerator');

router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // ✅ Generate the payment confirmation URL
    const qrPayload = `http://localhost:5000/pay.html?tripId=${trip.id}&amount=${trip.fare}`;

    // ✅ Generate QR code image
    const qrCodeDataUrl = await generateQRCode(qrPayload);

    // ✅ Return response
    res.json({
      qrCode: qrCodeDataUrl,
      payload: qrPayload,
      trip: {
        id: trip.id,
        origin: trip.origin,
        destination: trip.destination,
        fare: trip.fare
      }
    });
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    res.status(500).json({ error: 'Server error generating QR code' });
  }
});

module.exports = router;
