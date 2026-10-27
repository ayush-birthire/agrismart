const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB, getStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const cropRoutes = require('./routes/cropRoutes');
const soilRoutes = require('./routes/soilRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const forumRoutes = require('./routes/forumRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development port and production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AgriSmart Smart Farming Management API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: getStatus(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);

// Serve Static Frontend Assets in Production
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(frontendDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('AgriSmart API is live. Build frontend to view web client.');
    }
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` AgriSmart Backend Running on Port ${PORT}         `);
  console.log(` Health Check: http://localhost:${PORT}/api/health `);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}     `);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

module.exports = app;

