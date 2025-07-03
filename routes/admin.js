const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authMiddleware');

// 📥 Create a new admin user
router.post('/', authenticateToken, async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ message: 'Admin user created successfully', admin: newAdmin });
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
});

// 📤 Get list of admin users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const admins = await User.findAll({ where: { role: 'admin' } });

    console.log('📋 Found admins:', admins);

    if (!Array.isArray(admins)) {
      console.error('❌ Expected array but got:', admins);
      return res.status(500).json({ message: 'Invalid admin data format' });
    }

    res.json(admins);
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({ message: 'Server error while fetching admins' });
  }
});

module.exports = router;
