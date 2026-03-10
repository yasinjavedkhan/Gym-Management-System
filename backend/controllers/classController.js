const Class = require('../models/Class');

exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching classes' });
    }
};

exports.createClass = async (req, res) => {
    const { title, trainerName, startTime, duration, capacity } = req.body;

    try {
        const newClass = await Class.create({
            title,
            trainerName,
            startTime,
            duration,
            capacity
        });
        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating class' });
    }
};
