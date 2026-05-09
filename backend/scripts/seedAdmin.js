const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const admin = {
  name: process.env.ADMIN_NAME || 'Government Admin',
  email: process.env.ADMIN_EMAIL || 'admin@gov.local',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin'
};

const seedAdmin = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existingAdmin = await User.findOne({ email: admin.email });

  if (existingAdmin) {
    existingAdmin.name = admin.name;
    existingAdmin.role = 'admin';
    existingAdmin.password = admin.password;
    await existingAdmin.save();
    console.log(`Admin account updated: ${admin.email}`);
  } else {
    await User.create(admin);
    console.log(`Admin account created: ${admin.email}`);
  }

  await mongoose.disconnect();
  console.log('Admin login ready.');
};

seedAdmin().catch(async (error) => {
  console.error('Failed to seed admin:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
