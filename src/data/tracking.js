/**
 * Mock data — Order Tracking
 * Mirrors the shape returned by GET /api/orders/:id/tracking
 * Each entry: { id, order_id, status, message, created_at }
 */
export const tracking = [
  // Order 1 — delivered
  { id: 1, order_id: 1, status: 'pending', message: 'Order received', created_at: '2025-03-01T18:30:00.000Z' },
  { id: 2, order_id: 1, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-01T18:32:00.000Z' },
  { id: 3, order_id: 1, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-01T18:35:00.000Z' },
  { id: 4, order_id: 1, status: 'out_for_delivery', message: 'Out for delivery', created_at: '2025-03-01T18:50:00.000Z' },
  { id: 5, order_id: 1, status: 'delivered', message: 'Delivered', created_at: '2025-03-01T19:15:00.000Z' },

  // Order 2 — out for delivery
  { id: 6, order_id: 2, status: 'pending', message: 'Order received', created_at: '2025-03-05T12:00:00.000Z' },
  { id: 7, order_id: 2, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-05T12:02:00.000Z' },
  { id: 8, order_id: 2, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-05T12:05:00.000Z' },
  { id: 9, order_id: 2, status: 'out_for_delivery', message: 'Out for delivery', created_at: '2025-03-05T12:25:00.000Z' },

  // Order 3 — preparing
  { id: 10, order_id: 3, status: 'pending', message: 'Order received', created_at: '2025-03-07T19:45:00.000Z' },
  { id: 11, order_id: 3, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-07T19:47:00.000Z' },
  { id: 12, order_id: 3, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-07T19:50:00.000Z' },
];
