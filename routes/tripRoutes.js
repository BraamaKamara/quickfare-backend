console.log('✅ tripRoutes.js loaded');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const tripController = require('../controllers/tripController');

// 🔐 All routes below require authentication

// Create a new trip
router.post('/', authenticateToken, tripController.createTrip);

// Get one trip by ID
router.get('/:id', authenticateToken, tripController.getTripById); // NOTE: do not move above /:id

// Update only fare
router.put('/:id/fare', authenticateToken, tripController.updateFare);

// General trip update
router.put('/:id', authenticateToken, tripController.updateTrip);

// List all trips
router.get('/', authenticateToken, tripController.getAllTrips);

// Delete a trip
router.delete('/:id', authenticateToken, tripController.deleteTrip);

module.exports = router;
