const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');
const { Trip, Payment } = require('../models');

// POST /api/payments — Create a payment (authenticated)
router.post('/', authenticateToken, paymentController.createPayment);

// GET /api/payments — List all payments with related trip (authenticated)
router.get('/', authenticateToken, paymentController.getPayments);

// POST /api/payment/confirm — QR or external payment confirmation (no auth)
router.post('/confirm', async (req, res) => {
  try {
    const { tripId, amount, phone, paymentMethod } = req.body;

    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(400).json({ error: 'Invalid trip ID' });

    if (parseFloat(amount) !== parseFloat(trip.fare)) {
      return res.status(400).json({ error: 'Incorrect fare amount' });
    }

    await Payment.create({
      tripId,
      amount,
      phone,
      status: 'Completed',
      paymentMethod: paymentMethod || 'QR'
    });

    res.json({ message: '✅ Payment confirmed successfully.' });
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({ error: 'Server error during confirmation.' });
  }
});
// ✅ Check if payment exists
router.get('/check', async (req, res) => {
  const { tripId, phone } = req.query;

  if (!tripId || !phone) {
    return res.status(400).json({ message: 'tripId and phone are required' });
  }

  try {
    const payment = await Payment.findOne({
      where: { tripId, phone }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: '✅ Payment found',
      payment
    });
  } catch (err) {
    console.error('❌ Payment check error:', err);
    res.status(500).json({ message: 'Error checking payment', error: err.message });
  }
});

module.exports = router;
