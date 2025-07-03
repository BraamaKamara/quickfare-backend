// server.js

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ Import all routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const routeRoutes = require('./routes/routeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/admin');
const ussdRoutes = require('./routes/ussdRoutes');
const qrRoutes = require('./routes/qrRoutes');
const publicTripRoutes = require('./routes/publicTripRoutes'); // ✅ Double check this path

// ✅ Unauthenticated routes (put first!)
app.use('/api/public-trips', publicTripRoutes); // This must come BEFORE /api/trips

// ✅ Auth-protected routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/qr', qrRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('QuickFare backend is running!');
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
});
