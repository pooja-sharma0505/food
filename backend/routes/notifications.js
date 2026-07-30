const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

/**
 * All routes are protected by the auth middleware.
 * GET /api/notifications — list recent notifications for the user
 *
 * Notifications are generated from the user's recent orders and
 * their order_tracking history.
 */

/**
 * GET /api/notifications
 * Returns a list of notification objects derived from the user's
 * orders and order-tracking entries.
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch recent orders (newest first) with restaurant name
    const [orders] = await db.query(
      `SELECT o.id, o.order_number, o.order_status, o.placed_at, o.updated_at,
              r.name AS restaurant_name
       FROM orders o
       LEFT JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.placed_at DESC
       LIMIT 10`,
      [userId]
    );

    // Fetch tracking entries for those orders
    const orderIds = orders.map((o) => o.id);
    let trackingMap = {};
    if (orderIds.length > 0) {
      const [trackingRows] = await db.query(
        `SELECT order_id, status, message, created_at
         FROM order_tracking
         WHERE order_id IN (?)
         ORDER BY id ASC`,
        [orderIds]
      );
      trackingRows.forEach((t) => {
        if (!trackingMap[t.order_id]) trackingMap[t.order_id] = [];
        trackingMap[t.order_id].push(t);
      });
    }

    // Build notification objects from orders + tracking
    const notifications = orders.map((order) => {
      const tracking = trackingMap[order.id] || [];
      const latestTracking = tracking.length > 0 ? tracking[tracking.length - 1] : null;

      let title, body, icon;
      switch (order.order_status) {
        case 'delivered':
          title = 'Order delivered';
          body = `How was your ${order.restaurant_name || 'order'}? Tap to rate.`;
          icon = '✅';
          break;
        case 'out_for_delivery':
          title = 'Order out for delivery';
          body = `${order.restaurant_name || 'Your order'} is on the way.`;
          icon = '🛵';
          break;
        case 'preparing':
          title = 'Order confirmed';
          body = `${order.restaurant_name || 'Your order'} is preparing your food.`;
          icon = '👨‍🍳';
          break;
        case 'cancelled':
          title = 'Order cancelled';
          body = `Your order #${order.order_number} was cancelled.`;
          icon = '❌';
          break;
        default:
          title = 'Order placed';
          body = `Your order #${order.order_number} has been placed.`;
          icon = '📦';
      }

      return {
        id: String(order.id),
        icon,
        title,
        body,
        time: formatTimeAgo(order.updated_at || order.placed_at),
        unread: order.order_status !== 'delivered' && order.order_status !== 'cancelled',
        order_id: order.id,
        order_number: order.order_number,
        order_status: order.order_status,
        tracking,
      };
    });

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('GET /api/notifications error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Simple "time ago" formatter for notification timestamps.
 */
function formatTimeAgo(date) {
  if (!date) return 'Just now';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 2) return 'Yesterday';
  return `${diffDays} days ago`;
}

module.exports = router;
