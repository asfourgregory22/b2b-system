require('dotenv').config();
const User = require('./models/userModel');
const DB = require('./database').connectDB;

(async () => {
    console.log('Connecting to DB...');
    await DB();
    console.log('Connected. Checking for existing admin...');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
        console.log('An admin already exists:', existingAdmin.email);
        process.exit(0);
    }

    console.log('Creating admin...');
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password1',
        passwordConfirm: 'password1',
        role: 'admin'
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
})();
