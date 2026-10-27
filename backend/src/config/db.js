const mongoose = require('mongoose');

// Never buffer commands if DB is disconnected — throw or fall back immediately!
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn(`[MongoDB Notice]: No MONGODB_URI provided in environment.`);
    console.warn(`[Resilience Mode]: Backend will run with built-in in-memory demo datasets so the app NEVER crashes.`);
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB: ${error.message}`);
    console.warn(`[Resilience Mode]: Running in seamless Demo Mode with in-memory persistence.`);
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

const getStatus = () => ({
  connected: isDbConnected(),
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'Built-in Demo Storage',
  name: mongoose.connection.name || 'AgriSmart Memory Store',
});

module.exports = { connectDB, isDbConnected, getStatus };
