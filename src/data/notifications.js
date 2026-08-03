/**
 * Mock data — Notifications
 * Mirrors the shape returned by GET /api/notifications
 * Notifications are derived from orders + order_tracking history.
 */
export const notifications = [
  {
    id: '1',
    icon: '✅',
    title: 'Order delivered',
    body: 'How was your Bella Italia? Tap to rate.',
    time: '2 hours ago',
    unread: false,
    order_id: 1,
    order_number: 'ORD-123456',
    order_status: 'delivered',
    tracking: [
      { id: 1, order_id: 1, status: 'pending', message: 'Order received', created_at: '2025-03-01T18:30:00.000Z' },
      { id: 2, order_id: 1, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-01T18:32:00.000Z' },
      { id: 3, order_id: 1, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-01T18:35:00.000Z' },
      { id: 4, order_id: 1, status: 'out_for_delivery', message: 'Out for delivery', created_at: '2025-03-01T18:50:00.000Z' },
      { id: 5, order_id: 1, status: 'delivered', message: 'Delivered', created_at: '2025-03-01T19:15:00.000Z' },
    ],
  },
  {
    id: '2',
    icon: '🛵',
    title: 'Order out for delivery',
    body: 'Bombay Blues is on the way.',
    time: '1 hour ago',
    unread: true,
    order_id: 2,
    order_number: 'ORD-234567',
    order_status: 'out_for_delivery',
    tracking: [
      { id: 6, order_id: 2, status: 'pending', message: 'Order received', created_at: '2025-03-05T12:00:00.000Z' },
      { id: 7, order_id: 2, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-05T12:02:00.000Z' },
      { id: 8, order_id: 2, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-05T12:05:00.000Z' },
      { id: 9, order_id: 2, status: 'out_for_delivery', message: 'Out for delivery', created_at: '2025-03-05T12:25:00.000Z' },
    ],
  },
  {
    id: '3',
    icon: '👨‍🍳',
    title: 'Order confirmed',
    body: 'Burger Barn is preparing your food.',
    time: '30 min ago',
    unread: true,
    order_id: 3,
    order_number: 'ORD-345678',
    order_status: 'preparing',
    tracking: [
      { id: 10, order_id: 3, status: 'pending', message: 'Order received', created_at: '2025-03-07T19:45:00.000Z' },
      { id: 11, order_id: 3, status: 'confirmed', message: 'Order confirmed', created_at: '2025-03-07T19:47:00.000Z' },
      { id: 12, order_id: 3, status: 'preparing', message: 'Preparing your food', created_at: '2025-03-07T19:50:00.000Z' },
    ],
  },
];
