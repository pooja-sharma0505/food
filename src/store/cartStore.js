import { cartStore as mockCartStore } from '../data/cart';

// Simple event-based cart store so cart.js and the tab layout share real state.
// Now initialized from the mock data cart store instead of the backend API.
let listeners = new Set();
let cartItems = [];
let cartTotal = 0;
let initialized = false;

export const cartStore = {
  /**
   * Initialize the store from the mock cart data. Safe to call multiple times.
   */
  init() {
    if (initialized) return;
    try {
      const cart = mockCartStore.getCart();
      cartItems = cart.items || [];
      cartTotal = cart.total || 0;
    } catch (err) {
      // Start with an empty cart
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
   * Delegates to the mock cart store for consistency.
   */
  updateItem(id, delta) {
    const result = mockCartStore.updateQuantity(id, delta);
    cartItems = result.items || [];
    cartTotal = result.total || 0;
    listeners.forEach((cb) => cb());
  },

  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
