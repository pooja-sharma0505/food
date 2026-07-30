const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET /api/payments — list all payments for the user
 * GET /api/payments/:id — get a specific payment record
 */

/**
 * GET /api/payments
 * Returns all payment records for the logged-in user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT p.id, p.order_id, p.user_id, p.transaction_id, p.payment_method,
             p.amount, p.status, p.provider, p.paid_at, p.created_at, p.updated_at,
             o.order_number, o.order_status
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/payments error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/payments/:id
 * Returns a specific payment record.
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT p.id, p.order_id, p.user_id, p.transaction_id, p.payment_method,
             p.amount, p.status, p.provider, p.paid_at, p.created_at, p.updated_at,
             o.order_number, o.order_status
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      WHERE p.id = ? AND p.user_id = ?`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GET /api/payments/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
