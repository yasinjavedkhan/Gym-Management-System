const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            password
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretgymkey', { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, weight: user.weight, height: user.height, age: user.age, gender: user.gender, membershipType: user.membershipType } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const parsedPassword = parseInt(password, 10);
        if (isNaN(parsedPassword) || parsedPassword !== user.password) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretgymkey', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, weight: user.weight, height: user.height, age: user.age, gender: user.gender, membershipType: user.membershipType } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};
