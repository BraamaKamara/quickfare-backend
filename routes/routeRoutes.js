const express = require('express');
const router = express.Router();
const { Route } = require('../models');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/routes - Create a new route
router.post('/', authenticateToken, async (req, res) => {
  const { origin, destination } = req.body;

  try {
    const newRoute = await Route.create({ origin, destination });
    res.status(201).json({ message: 'Route created successfully', route: newRoute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create route', error: err.message });
  }
});

// GET /api/routes - Get all routes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const routes = await Route.findAll();
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch routes', error: err.message });
  }
});

// ✅ GET /api/routes/:id - Get a single route by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/routes/${id} handler called`);
  try {
    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch route', error: err.message });
  }
});


// ✅ ✅ ✅ PUT /api/routes/:id - Update a route by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { origin, destination } = req.body;
  const routeId = req.params.id;

  try {
    const route = await Route.findByPk(routeId);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    await route.update({ origin, destination });
    res.json({ message: 'Route updated successfully', route });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update route', error: err.message });
  }
});
// DELETE /api/routes/:id - Delete a route by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Optionally, check if route is linked to trips before deleting
    // For now, just delete:
    await route.destroy();

    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete route', error: err.message });
  }
});

module.exports = router;

