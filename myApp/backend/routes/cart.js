const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET  /api/cart   — list all cart items for the authenticated user
 * POST /api/cart   — add (or update) a cart item
 *      Body: { food_item_id, quantity?, special_instructions? }
 * DELETE /api/cart/:id — remove a specific cart item
 */

/**
 * GET /api/cart
 * Returns all cart items for the logged-in user, with food item details.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT ci.id, ci.user_id, ci.food_item_id, ci.quantity, ci.special_instructions,
             ci.created_at, ci.updated_at,
             f.name AS food_name, f.price, f.discount_price, f.image, f.is_veg,
             f.rating, r.name AS restaurant_name, r.delivery_fee
      FROM cart_items ci
      JOIN food_items f ON ci.food_item_id = f.id
      JOIN restaurants r ON f.restaurant_id = r.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC`,
      [userId]
    );

    // Compute effective price (discount if available)
    const items = rows.map((item) => {
      const effectivePrice = item.discount_price && item.discount_price > 0
        ? parseFloat(item.discount_price)
        : parseFloat(item.price);
      return {
        ...item,
        effective_price: effectivePrice,
        line_total: effectivePrice * item.quantity,
      };
    });

    const total = items.reduce((sum, i) => sum + i.line_total, 0);

    res.json({ success: true, data: { items, total } });
  } catch (err) {
    console.error('GET /api/cart error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/cart
 * Adds a new item to the cart or updates quantity if it already exists.
 * Body: { food_item_id, quantity?, special_instructions? }
 */
router.post('/', auth, async (req, res) => {
  const { food_item_id, quantity = 1, special_instructions } = req.body;
  const userId = req.user.id;

  if (!food_item_id) {
    return res.status(400).json({ success: false, message: 'food_item_id is required.' });
  }

  try {
    // Verify the food item exists and is available
    const [foodCheck] = await db.query(
      'SELECT id FROM food_items WHERE id = ? AND is_available = 1',
      [food_item_id]
    );
    if (foodCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found or unavailable.' });
    }

    // Check if item already in cart
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND food_item_id = ?',
      [userId, food_item_id]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = ?, special_instructions = COALESCE(?, special_instructions) WHERE id = ?',
        [newQty, special_instructions || null, existing[0].id]
      );
    } else {
      // Insert new cart item
      await db.query(
        'INSERT INTO cart_items (user_id, food_item_id, quantity, special_instructions) VALUES (?, ?, ?, ?)',
        [userId, food_item_id, quantity, special_instructions || null]
      );
    }

    // Return updated cart
    const [rows] = await db.query(
      `SELECT ci.id, ci.user_id, ci.food_item_id, ci.quantity, ci.special_instructions,
             ci.created_at, ci.updated_at,
             f.name AS food_name, f.price, f.discount_price, f.image, f.is_veg,
             f.rating, r.name AS restaurant_name, r.delivery_fee
      FROM cart_items ci
      JOIN food_items f ON ci.food_item_id = f.id
      JOIN restaurants r ON f.restaurant_id = r.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC`,
      [userId]
    );

    const items = rows.map((item) => {
      const effectivePrice = item.discount_price && item.discount_price > 0
        ? parseFloat(item.discount_price)
        : parseFloat(item.price);
      return {
        ...item,
        effective_price: effectivePrice,
        line_total: effectivePrice * item.quantity,
      };
    });

    const total = items.reduce((sum, i) => sum + i.line_total, 0);

    res.json({ success: true, message: 'Cart updated.', data: { items, total } });
  } catch (err) {
    console.error('POST /api/cart error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/cart/:id
 * Removes a specific cart item belonging to the authenticated user.
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    // Return updated cart
    const [rows] = await db.query(
      `SELECT ci.id, ci.user_id, ci.food_item_id, ci.quantity, ci.special_instructions,
             ci.created_at, ci.updated_at,
             f.name AS food_name, f.price, f.discount_price, f.image, f.is_veg,
             f.rating, r.name AS restaurant_name, r.delivery_fee
      FROM cart_items ci
      JOIN food_items f ON ci.food_item_id = f.id
      JOIN restaurants r ON f.restaurant_id = r.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC`,
      [userId]
    );

    const items = rows.map((item) => {
      const effectivePrice = item.discount_price && item.discount_price > 0
        ? parseFloat(item.discount_price)
        : parseFloat(item.price);
      return {
        ...item,
        effective_price: effectivePrice,
        line_total: effectivePrice * item.quantity,
      };
    });

    const total = items.reduce((sum, i) => sum + i.line_total, 0);

    res.json({ success: true, message: 'Item removed from cart.', data: { items, total } });
  } catch (err) {
    console.error('DELETE /api/cart/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
