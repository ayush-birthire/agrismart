const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrismart';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to primary MongoDB at ${mongoURI}`);
    console.warn(`[Details]: ${error.message}`);
    console.warn(`[Note]: The backend will continue running with memory-cached responses so your application will not crash.`);
  }
};

const getStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'Disconnected',
  name: mongoose.connection.name || 'None',
});

module.exports = { connectDB, getStatus };

