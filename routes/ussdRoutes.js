const express = require('express');
const router = express.Router();
const { Trip, Payment } = require('../models');

console.log('✅ ussdRoutes.js loaded');

// Helper function to validate Zambian phone number format
function isValidZambianNumber(input) {
  return /^\+260\d{9}$/.test(input);
}

router.post('/session', async (req, res) => {
  console.log('Received USSD POST request:', req.body);

  const { sessionId, phoneNumber, text } = req.body || {};
  const inputs = text ? text.split('*') : [];

  let response = '';

  try {
    if (!text || text === '') {
      response = `CON Welcome to QuickFare!\n1. View Trips\n2. Make Payment\n3. Exit`;
    } else if (inputs[0] === '1') {
      // Step 1: Choose Origin
      if (!inputs[1]) {
        const trips = await Trip.findAll({ attributes: ['origin'], group: ['origin'] });
        const uniqueOrigins = [...new Set(trips.map(trip => trip.origin))];

        if (uniqueOrigins.length === 0) {
          response = 'END No routes available currently.';
        } else {
          response = 'CON Choose Origin:\n';
          uniqueOrigins.forEach((origin, index) => {
            response += `${index + 1}. ${origin}\n`;
          });
        }
      }
      // Step 2: Choose Destination
      else if (!inputs[2]) {
        const trips = await Trip.findAll({ attributes: ['origin'], group: ['origin'] });
        const uniqueOrigins = [...new Set(trips.map(trip => trip.origin))];
        const selectedOrigin = uniqueOrigins[parseInt(inputs[1], 10) - 1];

        const destinationTrips = await Trip.findAll({
          where: { origin: selectedOrigin },
          attributes: ['destination'],
          group: ['destination']
        });

        const destOptions = [...new Set(destinationTrips.map(trip => trip.destination))];

        if (destOptions.length === 0) {
          response = `END No destinations available from ${selectedOrigin}`;
        } else {
          response = `CON Destination from ${selectedOrigin}:\n`;
          destOptions.forEach((d, i) => {
            response += `${i + 1}. ${d}\n`;
          });
        }
      }
      // Step 3: Enter Amount - we skip this because fare is fetched from DB
      // So this step will show fare and ask for mobile number
      else if (!inputs[3]) {
        const originTrips = await Trip.findAll({ attributes: ['origin'], group: ['origin'] });
        const uniqueOrigins = [...new Set(originTrips.map(trip => trip.origin))];
        const origin = uniqueOrigins[parseInt(inputs[1], 10) - 1];

        const destinationTrips = await Trip.findAll({
          where: { origin },
          attributes: ['destination'],
          group: ['destination']
        });
        const destOptions = [...new Set(destinationTrips.map(trip => trip.destination))];
        const destination = destOptions[parseInt(inputs[2], 10) - 1];

        const trip = await Trip.findOne({ where: { origin, destination } });

        if (!trip) {
          response = `END No trip found from ${origin} to ${destination}`;
        } else {
          response = `CON Fare from ${origin} ➔ ${destination} is ZMW ${trip.fare}\nEnter your Mobile Number:`;
        }
      }
      // Step 4: Ask for confirmation if phone number is valid
      else if (inputs.length === 4 && isValidZambianNumber(inputs[3])) {
        const originTrips = await Trip.findAll({ attributes: ['origin'], group: ['origin'] });
        const uniqueOrigins = [...new Set(originTrips.map(trip => trip.origin))];
        const origin = uniqueOrigins[parseInt(inputs[1], 10) - 1];

        const destinationTrips = await Trip.findAll({
          where: { origin },
          attributes: ['destination'],
          group: ['destination']
        });
        const destOptions = [...new Set(destinationTrips.map(trip => trip.destination))];
        const destination = destOptions[parseInt(inputs[2], 10) - 1];

        const trip = await Trip.findOne({ where: { origin, destination } });

        if (!trip) {
          response = `END No fare found for route ${origin} ➔ ${destination}`;
        } else {
          response = `CON Confirm Payment:\n${origin} ➔ ${destination} | ZMW ${trip.fare}\n1. Confirm\n2. Cancel`;
        }
      }
      // Step 5: Handle confirmation input (Confirm or Cancel)
      else if (inputs.length === 5 && isValidZambianNumber(inputs[3])) {
        const originTrips = await Trip.findAll({ attributes: ['origin'], group: ['origin'] });
        const uniqueOrigins = [...new Set(originTrips.map(trip => trip.origin))];
        const origin = uniqueOrigins[parseInt(inputs[1], 10) - 1];

        const destinationTrips = await Trip.findAll({
          where: { origin },
          attributes: ['destination'],
          group: ['destination']
        });
        const destOptions = [...new Set(destinationTrips.map(trip => trip.destination))];
        const destination = destOptions[parseInt(inputs[2], 10) - 1];

        const mobile = inputs[3];
        const confirmInput = inputs[4];

        const trip = await Trip.findOne({ where: { origin, destination } });

        if (!trip) {
          response = 'END Trip not found, payment cannot be processed.';
        } else if (confirmInput === '1') {
          await Payment.create({
            tripId: trip.id,
            amount: trip.fare,
            phone: mobile,
            status: 'Pending'
          });
          console.log(`✅ Payment saved: TripID ${trip.id}, Amount ${trip.fare}, Phone ${mobile}`);
          response = 'END ✅ Payment successful! Thank you for using QuickFare.';
        } else if (confirmInput === '2') {
          response = 'END Payment cancelled. Thank you for using QuickFare.';
        } else {
          response = 'END Invalid input. Session ended.';
        }
      }
      // Default fallback for inputs starting with 1
      else {
        response = 'END Thank you for using QuickFare!';
      }
    } else {
      // Any other main menu selection or unexpected inputs
      response = 'END Thank you for using QuickFare!';
    }
  } catch (error) {
    console.error('❌ USSD Error:', error);
    response = 'END System error. Please try again later.';
  }

  console.log('USSD Response:', response.trim());
  res.set('Content-Type', 'text/plain');
  res.send(response.trim());
});

module.exports = router;
