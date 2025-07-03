const { Trip } = require('./models');

(async () => {
  const trips = await Trip.findAll({ attributes: ['id', 'origin', 'destination', 'fare'] });
  console.log('\n🚍 Available Trips:\n');
  trips.forEach(trip => {
    console.log(`Trip ID: ${trip.id} | ${trip.origin} ➔ ${trip.destination} | ZMW ${trip.fare}`);
  });
})();
