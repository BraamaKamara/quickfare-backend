const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit();
    }

    console.log('🔍 Stored password in DB:', admin.password);

    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('✅ Password matches?', isMatch);

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
