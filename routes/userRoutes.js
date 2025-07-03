const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Optional, but add if not already present

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { fullName, email, role, password } = req.body;
  try {
    const newUser = await User.create({ fullName, email, role, password });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});
// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});
const authenticateToken = require('../middleware/authMiddleware');

// GET /profile - protected route example
router.get('/profile', authenticateToken, async (req, res) => {
  res.json({
    message: 'This is a protected profile route',
    user: req.user, // this came from the token
  });
});

module.exports = router;