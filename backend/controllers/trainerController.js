const Trainer = require('../models/Trainer');

exports.getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.findAll();
        res.json(trainers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching trainers' });
    }
};

exports.createTrainer = async (req, res) => {
    const { name, specialty, experience } = req.body;

    try {
        const newTrainer = await Trainer.create({
            name,
            specialty,
            experience
        });
        res.status(201).json(newTrainer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating trainer' });
    }
};
