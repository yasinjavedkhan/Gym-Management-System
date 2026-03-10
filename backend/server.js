const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express();

// Connect to Database
// Require models so Sequelize knows about them before sync
require('./models/Trainer');

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.get('/', (req, res) => {
    res.send('Gym Management System API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`);
//});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
