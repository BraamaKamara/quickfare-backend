const { User, sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    await User.destroy({ where: { email: 'admin@example.com' } });

    // ⚠️ DO NOT HASH — Sequelize will hash this via beforeCreate hook
    const admin = await User.create({
      fullName: 'System Admin',
      email: 'admin@example.com',
      role: 'admin',
      password: 'admin123'
    });

    console.log('✅ Admin created:', admin.email);
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
})();
