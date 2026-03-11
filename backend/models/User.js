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
        type: DataTypes.STRING,
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
        defaultValue: 70
    },
    height: {
        type: DataTypes.FLOAT,
        defaultValue: 175
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 25
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: 'Not Specified'
    }
});

module.exports = User;
