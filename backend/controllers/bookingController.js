const Booking = require('../models/Booking');
const Class = require('../models/Class');

exports.bookClass = async (req, res) => {
    const { classId } = req.body;
    const userId = req.user.id;

    try {
        const gymClass = await Class.findByPk(classId);
        if (!gymClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const booking = await Booking.create({
            userId,
            classId
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during booking' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [Class]
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
};
