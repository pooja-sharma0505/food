const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET /api/restaurants
 * Returns all active restaurants.
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, slug, description, logo, cover_image, cuisine, phone, email,
              address, city, state, postal_code, rating, total_reviews,
              delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_open, is_active
       FROM restaurants WHERE is_active = 1 ORDER BY rating DESC, id ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/restaurants error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant by id (or slug).
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT id, name, slug, description, logo, cover_image, cuisine, phone, email,
              address, city, state, postal_code, rating, total_reviews,
              delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_open, is_active
       FROM restaurants WHERE is_active = 1 AND (id = ? OR slug = ?)`,
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GET /api/restaurants/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
