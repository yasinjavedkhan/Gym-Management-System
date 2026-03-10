const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Class = require('./Class');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

// Associations
Booking.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(Class, { foreignKey: 'classId', onDelete: 'CASCADE' });

module.exports = Booking;
