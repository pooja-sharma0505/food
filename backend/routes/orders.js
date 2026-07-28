const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET  /api/orders   — list all orders for the authenticated user
 * POST /api/orders   — place a new order from the user's cart
 * GET  /api/orders/:id — get details of a specific order
 */

/**
 * GET /api/orders
 * Returns all orders for the logged-in user, newest first.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT o.id, o.order_number, o.user_id, o.restaurant_id, o.address_id,
             o.subtotal, o.delivery_fee, o.discount, o.tax, o.total_amount,
             o.payment_method, o.payment_status, o.order_status, o.special_instructions,
             o.placed_at, o.updated_at,
             r.name AS restaurant_name, r.rating AS restaurant_rating,
             a.label AS address_label, a.address_line1, a.city, a.postal_code
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = ?
      ORDER BY o.placed_at DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/orders error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/orders/:id/tracking
 * Returns tracking history for a specific order.
 */
router.get('/:id/tracking', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify order belongs to the authenticated user
    const [orderCheck] = await db.query(
      'SELECT id FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (orderCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const [rows] = await db.query(
      'SELECT id, order_id, status, message FROM order_tracking WHERE order_id = ? ORDER BY id ASC',
      [id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/orders/:id/tracking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/orders/:id
 * Returns details of a specific order, including order_items.
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [orderRows] = await db.query(
      `SELECT o.id, o.order_number, o.user_id, o.restaurant_id, o.address_id,
             o.subtotal, o.delivery_fee, o.discount, o.tax, o.total_amount,
             o.payment_method, o.payment_status, o.order_status, o.special_instructions,
             o.placed_at, o.updated_at,
             r.name AS restaurant_name, r.rating AS restaurant_rating,
             a.label AS address_label, a.full_name, a.phone, a.address_line1,
             a.address_line2, a.city, a.state, a.postal_code
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = ? AND o.user_id = ?`,
      [id, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orderRows[0];

    // Get order items
    const [itemRows] = await db.query(
      `SELECT id, order_id, food_item_id, food_name, quantity, unit_price, total_price, special_instructions
      FROM order_items WHERE order_id = ? ORDER BY id ASC`,
      [order.id]
    );

    order.order_items = itemRows;

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('GET /api/orders/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/orders
 * Places a new order from the user's current cart.
 * Body: { restaurant_id, address_id, payment_method?, special_instructions? }
 *
 * - Reads all items from cart_items for the user
 * - Determines the restaurant from the first item (or from body)
 * - Calculates subtotal, delivery_fee, tax, discount, total
 * - Inserts into orders table
 * - Inserts each cart item into order_items table
 * - Clears the cart
 * - Optionally creates a payment record
 */
router.post('/', auth, async (req, res) => {
  const { restaurant_id, address_id, payment_method = 'cash', special_instructions } = req.body;
  const userId = req.user.id;

  if (!restaurant_id || !address_id) {
    return res.status(400).json({
      success: false,
      message: 'restaurant_id and address_id are required.',
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get all cart items for the user (with food details)
    const [cartItems] = await connection.query(
      `SELECT ci.id, ci.food_item_id, ci.quantity, ci.special_instructions,
             f.name, f.price, f.discount_price, f.restaurant_id
      FROM cart_items ci
      JOIN food_items f ON ci.food_item_id = f.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at ASC`,
      [userId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Verify all items belong to the same restaurant
    const firstRestaurantId = cartItems[0].restaurant_id;
    const mismatched = cartItems.some((item) => item.restaurant_id !== firstRestaurantId);
    if (mismatched) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'All cart items must be from the same restaurant.',
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItemsData = cartItems.map((item) => {
      const unitPrice = item.discount_price && item.discount_price > 0
        ? parseFloat(item.discount_price)
        : parseFloat(item.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        food_item_id: item.food_item_id,
        food_name: item.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        special_instructions: item.special_instructions || null,
      };
    });

    // Get delivery fee from the restaurant
    const [restRows] = await connection.query(
      'SELECT delivery_fee FROM restaurants WHERE id = ?',
      [firstRestaurantId]
    );
    const deliveryFee = restRows.length > 0 ? parseFloat(restRows[0].delivery_fee) : 0;

    const discount = 0; // No coupon logic yet
    const tax = 0; // No tax logic yet
    const totalAmount = subtotal + deliveryFee - discount + tax;

    // Generate order number
    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (order_number, user_id, restaurant_id, address_id, subtotal, delivery_fee,
        discount, tax, total_amount, payment_method, payment_status, order_status,
        special_instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)`,
      [
        orderNumber, userId, firstRestaurantId, address_id,
        subtotal.toFixed(2), deliveryFee.toFixed(2),
        discount.toFixed(2), tax.toFixed(2),
        totalAmount.toFixed(2), payment_method,
        special_instructions || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of orderItemsData) {
      await connection.query(
        `INSERT INTO order_items
         (order_id, food_item_id, food_name, quantity, unit_price, total_price, special_instructions)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.food_item_id, item.food_name, item.quantity,
          item.unit_price.toFixed(2), item.total_price.toFixed(2),
          item.special_instructions,
        ]
      );
    }

    // Create payment record
    await connection.query(
      `INSERT INTO payments (order_id, user_id, payment_method, amount, status, provider)
       VALUES (?, ?, ?, ?, 'pending', NULL)`,
      [orderId, userId, payment_method, totalAmount.toFixed(2)]
    );

    // Clear the cart
    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // Insert initial order tracking entry
    await connection.query(
      'INSERT INTO order_tracking (order_id, status, message) VALUES (?, ?, ?)',
      [orderId, 'pending', 'Order received']
    );

    await connection.commit();

    // Fetch and return the full order
    const [fullOrder] = await connection.query(
      `SELECT o.id, o.order_number, o.user_id, o.restaurant_id, o.address_id,
             o.subtotal, o.delivery_fee, o.discount, o.tax, o.total_amount,
             o.payment_method, o.payment_status, o.order_status, o.special_instructions,
             o.placed_at, o.updated_at,
             r.name AS restaurant_name, r.rating AS restaurant_rating
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await connection.query(
      `SELECT id, order_id, food_item_id, food_name, quantity, unit_price, total_price, special_instructions
      FROM order_items WHERE order_id = ? ORDER BY id ASC`,
      [orderId]
    );

    fullOrder[0].order_items = orderItems;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: fullOrder[0],
    });
  } catch (err) {
    await connection.rollback();
    console.error('POST /api/orders error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    connection.release();
  }
});

module.exports = router;
