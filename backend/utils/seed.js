const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@titangym.com';
        
        // Delete existing to ensure correct password type after revert
        await User.destroy({ where: { email: adminEmail } });

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: 12345,
            membershipType: 'Elite'
        });
        console.log('✅ Admin user seeded with numeric password.');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
