const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trainer = sequelize.define('Trainer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.INTEGER, // years of experience
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Trainer;
