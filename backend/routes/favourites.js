const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET    /api/favourites        — list all favourites for the user
 * POST   /api/favourites        — add a food item to favourites
 * DELETE /api/favourites/:id    — remove a favourite
 */

/**
 * GET /api/favourites
 * Returns all favourited food items for the logged-in user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT f.id, f.user_id, f.food_item_id, f.created_at,
             fi.name AS food_name, fi.price, fi.discount_price, fi.image, fi.rating,
             r.name AS restaurant_name
      FROM favourites f
      JOIN food_items fi ON f.food_item_id = fi.id
      JOIN restaurants r ON fi.restaurant_id = r.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/favourites error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/favourites
 * Adds a food item to the user's favourites.
 * Body: { food_item_id }
 */
router.post('/', auth, async (req, res) => {
  const { food_item_id } = req.body;
  const userId = req.user.id;

  if (!food_item_id) {
    return res.status(400).json({ success: false, message: 'food_item_id is required.' });
  }

  try {
    // Check if already favourited
    const [existing] = await db.query(
      'SELECT id FROM favourites WHERE user_id = ? AND food_item_id = ?',
      [userId, food_item_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Already in favourites.' });
    }

    await db.query(
      'INSERT INTO favourites (user_id, food_item_id) VALUES (?, ?)',
      [userId, food_item_id]
    );

    res.status(201).json({ success: true, message: 'Added to favourites.' });
  } catch (err) {
    console.error('POST /api/favourites error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/favourites/:id
 * Removes a favourite by its id.
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'DELETE FROM favourites WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Favourite not found.' });
    }

    res.json({ success: true, message: 'Removed from favourites.' });
  } catch (err) {
    console.error('DELETE /api/favourites/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
