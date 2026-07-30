const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
<<<<<<< HEAD
const auth = require('../middleware/auth');
=======
>>>>>>> d2c8c96 (Initial commit)
require('dotenv').config();

const SALT_ROUNDS = 10;

/**
 * POST /api/signup
 * Creates a new user account.
 * Body: { name, email, password, phone? }
 * Returns: { success, token, user }
 */
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, is_active) VALUES (?, ?, ?, ?, 1)',
      [name, email, hashedPassword, phone || null]
    );

    const userId = result.insertId;

    // Issue JWT
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: userId, name, email, phone: phone || null },
    });
  } catch (err) {
    console.error('POST /api/signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/login
 * Authenticates a user and returns a JWT.
 * Body: { email, password }
 * Returns: { success, token, user }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, name, email, password, phone, is_active FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('POST /api/login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

<<<<<<< HEAD
/**
 * GET /api/me
 * Returns the authenticated user's profile along with order and review counts.
 * Replaces the hardcoded "Rahul Sharma" / "42 orders" / "3 reviews" / "Gold"
 * values that were previously in src/app/tabs/profile.js.
 */
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      'SELECT id, name, email, phone, is_active FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = rows[0];

    // Count orders
    const [orderResult] = await db.query(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [userId]
    );
    const orderCount = orderResult[0].count;

    // Count reviews (from the reviews table)
    let reviewCount = 0;
    try {
      const [reviewResult] = await db.query(
        'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?',
        [userId]
      );
      reviewCount = reviewResult[0].count;
    } catch (err) {
      // reviews table may not exist yet — fall back to 0
      console.warn('Could not count reviews:', err.message);
    }

    // Derive loyalty status from order count
    let status = 'Bronze';
    if (orderCount >= 21) status = 'Gold';
    else if (orderCount >= 6) status = 'Silver';

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_active: user.is_active,
        order_count: orderCount,
        review_count: reviewCount,
        status,
      },
    });
  } catch (err) {
    console.error('GET /api/me error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/me
 * Updates the authenticated user's profile (name, email, phone).
 * Replaces the hardcoded default values and no-op save in
 * src/app/edit-profile.js.
 */
router.put('/me', auth, async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone) WHERE id = ?',
      [name || null, email || null, phone || null, userId]
    );

    const [rows] = await db.query(
      'SELECT id, name, email, phone, is_active FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated.',
      data: rows[0],
    });
  } catch (err) {
    console.error('PUT /api/me error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

=======
>>>>>>> d2c8c96 (Initial commit)
module.exports = router;
