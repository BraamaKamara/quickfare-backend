// controllers/paymentController.js

const { Payment, Trip } = require('../models');
const { Op } = require('sequelize');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { tripId, amountPaid, paymentMethod, payerPhone } = req.body;

    // Field presence validation
    if (!tripId || !amountPaid || !paymentMethod || !payerPhone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Amount validation
    if (isNaN(amountPaid) || Number(amountPaid) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    // Zambian phone number validation
    if (!/^09\d{8}$/.test(payerPhone)) {
      return res.status(400).json({ message: 'Phone number must be a valid Zambian number (e.g., 0978123456).' });
    }

    // Check if trip exists
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Create payment
    const payment = await Payment.create({
      tripId,
      amountPaid,
      paymentMethod,
      payerPhone,
    });

    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).json({ message: 'Failed to create payment' });
  }
};

// Get all payments (with optional filters)
// Get all payments (with optional filters)
exports.getPayments = async (req, res) => {
  try {
    const { tripId, paymentMethod, payerPhone, dateFrom, dateTo } = req.query;

    const filters = {};
    if (tripId) filters.tripId = tripId;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (payerPhone) filters.payerPhone = { [Op.like]: `%${payerPhone}%` };

    if (dateFrom && dateTo) {
      filters.createdAt = {
        [Op.between]: [new Date(dateFrom), new Date(dateTo)]
      };
    } else if (dateFrom) {
      filters.createdAt = {
        [Op.gte]: new Date(dateFrom)
      };
    } else if (dateTo) {
      filters.createdAt = {
        [Op.lte]: new Date(dateTo)
      };
    }

    const payments = await Payment.findAll({
      where: filters,
      include: [
        {
          model: Trip,
          as: 'trip',
          include: [{ model: require('../models').Route, as: 'route' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Failed to retrieve payments' });
  }
};


