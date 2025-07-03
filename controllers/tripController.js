const { Trip, Route } = require('../models');

// ✅ Create a new trip
exports.createTrip = async (req, res) => {
  const { origin, destination, fare, date, time, routeId } = req.body;

  try {
    const newTrip = await Trip.create({ origin, destination, fare, date, time, routeId });
    res.status(201).json({ message: '✅ Trip created successfully', trip: newTrip });
  } catch (err) {
    console.error('❌ Trip creation error:', err);
    res.status(500).json({ message: 'Trip creation failed', error: err.message });
  }
};

// ✅ Update only the fare
exports.updateFare = async (req, res) => {
  const { id } = req.params;
  const { fare } = req.body;

  try {
    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.fare = fare;
    await trip.save();

    res.json({ message: '✅ Fare updated successfully', trip });
  } catch (err) {
    console.error('❌ Fare update error:', err);
    res.status(500).json({ message: 'Failed to update fare', error: err.message });
  }
};

// ✅ General trip update
exports.updateTrip = async (req, res) => {
  const { id } = req.params;
  const { origin, destination, fare, date, time, routeId } = req.body;

  try {
    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (origin !== undefined) trip.origin = origin;
    if (destination !== undefined) trip.destination = destination;
    if (fare !== undefined) trip.fare = fare;
    if (date !== undefined) trip.date = date;
    if (time !== undefined) trip.time = time;
    if (routeId !== undefined) trip.routeId = routeId;

    await trip.save();

    res.json({ message: '✅ Trip updated successfully', trip });
  } catch (err) {
    console.error('❌ Trip update error:', err);
    res.status(500).json({ message: 'Failed to update trip', error: err.message });
  }
};

// ✅ List all trips with their route
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: {
        model: Route,
        as: 'route'
      },
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    res.json(trips);
  } catch (err) {
    console.error('❌ Trip fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch trips', error: err.message });
  }
};

// ✅ Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const rowsDeleted = await Trip.destroy({ where: { id: req.params.id } });

    if (rowsDeleted === 0) return res.status(404).json({ message: 'Trip not found' });

    res.json({ message: '🗑️ Trip deleted successfully' });
  } catch (err) {
    console.error('❌ Trip deletion error:', err);
    res.status(500).json({ message: 'Failed to delete trip', error: err.message });
  }
};

// ✅ Get one trip by ID
exports.getTripById = async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 Fetching trip with ID: ${id}`); // <- Add this line

  try {
    const trip = await Trip.findByPk(id, {
      include: {
        model: Route,
        as: 'route'
      }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    res.json(trip);
  } catch (err) {
    console.error('❌ Trip fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch trip', error: err.message });
  }
};

