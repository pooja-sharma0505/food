const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET  /api/addresses   — list all addresses for the user
 * POST /api/addresses   — create a new address
 * PUT  /api/addresses/:id — update an address
 * DELETE /api/addresses/:id — delete an address
 */

/**
 * GET /api/addresses
 * Returns all saved addresses for the logged-in user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT id, user_id, label, full_name, phone, address_line1, address_line2,
             city, state, postal_code, country, is_default, created_at, updated_at
      FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/addresses error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/addresses
 * Creates a new address for the logged-in user.
 * Body: { label?, full_name, phone, address_line1, address_line2?, city, state, postal_code, country?, is_default? }
 */
router.post('/', auth, async (req, res) => {
  const {
    label = 'Home', full_name, phone, address_line1, address_line2,
    city, state, postal_code, country = 'India', is_default = false,
  } = req.body;
  const userId = req.user.id;

  if (!full_name || !phone || !address_line1 || !city || !state || !postal_code) {
    return res.status(400).json({ success: false, message: 'Required fields are missing.' });
  }

  try {
    // If this is the default, unset other defaults
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    const [result] = await db.query(
      `INSERT INTO addresses
       (user_id, label, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, label, full_name, phone, address_line1, address_line2 || null,
       city, state, postal_code, country, is_default ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Address added.', data: { id: result.insertId } });
  } catch (err) {
    console.error('POST /api/addresses error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/addresses/:id
 * Updates an existing address.
 */
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {
    label, full_name, phone, address_line1, address_line2,
    city, state, postal_code, country, is_default,
  } = req.body;

  try {
    // If setting as default, unset other defaults
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id != ?', [userId, id]);
    }

    const [result] = await db.query(
      `UPDATE addresses SET
       label = COALESCE(?, label),
       full_name = COALESCE(?, full_name),
       phone = COALESCE(?, phone),
       address_line1 = COALESCE(?, address_line1),
       address_line2 = COALESCE(?, address_line2),
       city = COALESCE(?, city),
       state = COALESCE(?, state),
       postal_code = COALESCE(?, postal_code),
       country = COALESCE(?, country),
       is_default = COALESCE(?, is_default)
       WHERE id = ? AND user_id = ?`,
      [label, full_name, phone, address_line1, address_line2,
       city, state, postal_code, country, is_default, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    res.json({ success: true, message: 'Address updated.' });
  } catch (err) {
    console.error('PUT /api/addresses/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/addresses/:id
 * Deletes an address.
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    res.json({ success: true, message: 'Address deleted.' });
  } catch (err) {
    console.error('DELETE /api/addresses/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
