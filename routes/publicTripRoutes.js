const express = require('express');
const router = express.Router();
const { Trip, Route } = require('../models');

// ✅ Test route
router.get('/ping', (req, res) => {
  res.send('✅ publicTripRoutes working');
});

// ✅ Public trips endpoint
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [{ model: Route, as: 'route' }],
      order: [['id', 'DESC']]
    });

    const result = trips.map(trip => ({
      id: trip.id,
      origin: trip.route?.origin || trip.origin,
      destination: trip.route?.destination || trip.destination,
      fare: trip.fare
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ Failed to load public trips:', err);
    res.status(500).json({ error: 'Server error loading public trips' });
  }
});

module.exports = router;
