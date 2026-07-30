const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection (also tests the connection on import)
require('./config/db');

const app = express();

// Middleware
app.use(cors());
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
<<<<<<< HEAD
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/config', require('./routes/config'));
=======
>>>>>>> d2c8c96 (Initial commit)

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Savor API server running on http://0.0.0.0:${PORT}`);
  console.log(`   LAN: http://192.168.1.19:${PORT}`);
});
