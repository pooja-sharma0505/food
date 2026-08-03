/**
 * Mock data — Cart (mutable in-memory state)
 * Mirrors the shape returned by GET /api/cart
 *
 * The cart is a mutable singleton. addToCart / removeFromCart
 * modify this state and return the updated cart, just like the
 * backend API would.
 */
import { foods } from './foods';

// Helper: compute effective price (discount if available)
function effectivePrice(food) {
  return food.discount_price && food.discount_price > 0
    ? parseFloat(food.discount_price)
    : parseFloat(food.price);
}

// Helper: build a cart item from a food item
function buildCartItem(food, quantity, specialInstructions) {
  return {
    id: Date.now() + Math.random(), // unique cart item id
    user_id: 1,
    food_item_id: food.id,
    quantity,
    special_instructions: specialInstructions || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    food_name: food.name,
    price: food.price,
    discount_price: food.discount_price,
    image: food.image,
    is_veg: food.is_veg,
    rating: food.rating,
    restaurant_name: food.restaurant_name,
    delivery_fee: food.restaurant_id === 1 ? 30 : food.restaurant_id === 2 ? 20 : food.restaurant_id === 3 ? 40 : food.restaurant_id === 4 ? 25 : food.restaurant_id === 5 ? 35 : 15,
    effective_price: effectivePrice(food),
    line_total: effectivePrice(food) * quantity,
  };
}

// Helper: rebuild cart totals from items
function rebuildCart(items) {
  const total = items.reduce((sum, i) => sum + (i.effective_price || 0) * i.quantity, 0);
  return { items, total };
}

// Initial cart — start empty (user has not added anything yet)
let cartItems = [];

export const cartStore = {
  getCart() {
    return rebuildCart(cartItems);
  },

  addItem(foodItemId, quantity = 1, specialInstructions = '') {
    const food = foods.find((f) => f.id === foodItemId || String(f.id) === String(foodItemId));
    if (!food) {
      throw new Error('Food item not found or unavailable.');
    }

    // Check if item already in cart
    const existing = cartItems.find((ci) => ci.food_item_id === food.id);
    if (existing) {
      // Update quantity
      existing.quantity += quantity;
      existing.special_instructions = specialInstructions || existing.special_instructions;
      existing.updated_at = new Date().toISOString();
      existing.line_total = existing.effective_price * existing.quantity;
    } else {
      // Add new item
      cartItems.push(buildCartItem(food, quantity, specialInstructions));
    }

    return rebuildCart(cartItems);
  },

  removeItem(cartItemId) {
    cartItems = cartItems.filter((ci) => ci.id !== cartItemId && String(ci.id) !== String(cartItemId));
    return rebuildCart(cartItems);
  },

  updateQuantity(cartItemId, delta) {
    const item = cartItems.find((ci) => ci.id === cartItemId || String(ci.id) === String(cartItemId));
    if (!item) return rebuildCart(cartItems);

    item.quantity = Math.max(0, item.quantity + delta);
    if (item.quantity === 0) {
      return this.removeItem(cartItemId);
    }
    item.line_total = item.effective_price * item.quantity;
    return rebuildCart(cartItems);
  },

  clear() {
    cartItems = [];
    return rebuildCart(cartItems);
  },

  // For testing / debugging
  _setItems(items) {
    cartItems = items;
  },
};
