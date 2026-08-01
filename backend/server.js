const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection (also tests the connection on import)
require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL, process.env.FRONTEND_URL].filter(Boolean)
    : ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:19000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/foods', require('./routes/foods'));
// Auth routes at /api/signup and /api/login (also available at /api/auth/*)
app.use('/api', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/favourites', require('./routes/favourites'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/config', require('./routes/config'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Savor API is running.', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Export the app for Vercel Serverless Functions
module.exports = app;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Savor API server running on http://0.0.0.0:${PORT}`);
    console.log(`   LAN: http://192.168.1.19:${PORT}`);
  });
}