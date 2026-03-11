const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@titangym.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 12345,
                membershipType: 'Elite'
            });
            console.log('✅ Admin user seeded successfully.');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
