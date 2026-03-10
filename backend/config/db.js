const { Sequelize } = require('sequelize');

console.log('Attempting to connect to gym_db on 127.0.0.1 as root with NO password...');

const sequelize = new Sequelize('gym_db', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully with Sequelize.');

    // Sync models
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
