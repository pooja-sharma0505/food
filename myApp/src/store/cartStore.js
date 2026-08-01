import { fetchCart } from '../services/api';

// Simple event-based cart store so cart.js and the tab layout share real state.
// Initialized from the backend API (fetchCart) instead of static mock data.
let listeners = new Set();
let cartItems = [];
let cartTotal = 0;
let initialized = false;

export const cartStore = {
  /**
   * Initialize the store from the backend. Safe to call multiple times.
   */
  async init() {
    if (initialized) return;
    try {
      const cart = await fetchCart();
      cartItems = cart.items || [];
      cartTotal = cart.total || 0;
    } catch (err) {
      // User may not be logged in — start with an empty cart
      cartItems = [];
      cartTotal = 0;
    }
    initialized = true;
  },

  getItems() {
    return cartItems;
  },

  getItemCount() {
    return cartItems.length;
  },

  getTotal() {
    return cartTotal;
  },

  /**
   * Update a cart item's quantity.
   * Note: In the current app, cart mutations go through the API
   * (addToCart / removeFromCart in api.js). This method is kept for
   * local optimistic updates if needed.
   */
  updateItem(id, delta) {
    cartItems = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    cartTotal = cartItems.reduce(
      (sum, i) => sum + (i.effective_price || i.price || 0) * i.quantity,
      0
    );
    listeners.forEach((cb) => cb());
  },

  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
