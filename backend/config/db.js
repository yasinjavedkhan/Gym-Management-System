const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbName = process.env.DB_NAME || 'gym_db';

let sequelize;

if (dbUrl) {
  console.log('Connecting to database using CONNECTION STRING...');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  console.log(`Connecting to ${dbName} on ${dbHost}...`);
  if (dbHost === '127.0.0.1') {
    console.log('⚠️ WARNING: Using local host (127.0.0.1). If this is on Render, you MUST set DB_HOST in the dashboard.');
  }
  sequelize = new Sequelize(
    dbName,
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: dbHost,
      dialect: 'mysql',
      logging: false,
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully with Sequelize.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
