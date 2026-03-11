const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    membershipType: {
        type: DataTypes.ENUM('Basic', 'Pro', 'Elite'),
        defaultValue: 'Basic'
    },
    profileImage: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: 'Not Specified'
    },
    caloriesToday: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalWorkouts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;
