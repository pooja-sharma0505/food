import { CART_ITEMS as INITIAL_CART } from '../data/mockData';

// Simple event-based cart store so cart.js and the tab layout share real state
let listeners = new Set();
let cartItems = [...INITIAL_CART];

export const cartStore = {
  getItems() {
    return cartItems;
  },

  getItemCount() {
    return cartItems.length;
  },

  getTotal() {
    return cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  updateItem(id, delta) {
    cartItems = cartItems
      .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
      .filter((item) => item.qty > 0);
    listeners.forEach((cb) => cb());
  },

  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
