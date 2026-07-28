const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET /api/foods
 * Returns all available food items.
 * Optional ?category=<slug> filter — e.g. /api/foods?category=pizza
 */
router.get('/', async (req, res) => {
  try {
    const { category, restaurant } = req.query;

    let query = `
      SELECT f.id, f.restaurant_id, f.category_id, f.name, f.slug, f.description,
             f.image, f.price, f.discount_price, f.rating, f.total_reviews,
             f.is_veg, f.is_available, f.is_popular, f.preparation_time,
             r.name AS restaurant_name, r.rating AS restaurant_rating,
             c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
      FROM food_items f
      JOIN restaurants r ON f.restaurant_id = r.id
      JOIN categories c ON f.category_id = c.id
      WHERE f.is_available = 1 AND r.is_active = 1 AND c.is_active = 1
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (restaurant) {
      query += ' AND (r.id = ? OR r.slug = ?)';
      params.push(restaurant, restaurant);
    }

    query += ' ORDER BY f.is_popular DESC, f.rating DESC, f.id ASC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/foods error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/foods/:id
 * Returns a single food item by id (or slug).
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT f.id, f.restaurant_id, f.category_id, f.name, f.slug, f.description,
             f.image, f.price, f.discount_price, f.rating, f.total_reviews,
             f.is_veg, f.is_available, f.is_popular, f.preparation_time,
             r.name AS restaurant_name, r.rating AS restaurant_rating,
             c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
      FROM food_items f
      JOIN restaurants r ON f.restaurant_id = r.id
      JOIN categories c ON f.category_id = c.id
      WHERE (f.id = ? OR f.slug = ?)`,
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GET /api/foods/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
