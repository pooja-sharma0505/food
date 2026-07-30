const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET /api/categories
 * Returns all active categories ordered by sort_order.
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, slug, icon, image FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/categories error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
