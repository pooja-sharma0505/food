/**
 * Savor App — Mock API Service
 * ─────────────────────────────────────────────────────────────
 * This file replaces the original backend API client with local
 * mock data.  Every function keeps the same signature and return
 * shape so that no frontend component needs to change.
 *
 * All data lives in src/data/*.js.  Mutable state (cart, orders)
 * is kept in-memory inside the mock data modules.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Mock data imports ──────────────────────────────────────
import { addresses } from '../data/addresses';
import { dummyToken, dummyUser } from '../data/auth';
import { cartStore as mockCartStore } from '../data/cart';
import { categories } from '../data/categories';
import { config } from '../data/config';
import { favourites } from '../data/favourites';
import { foods } from '../data/foods';
import { notifications } from '../data/notifications';
import { orders as mockOrders } from '../data/orders';
import { payments } from '../data/payments';
import { profile as mockProfile } from '../data/profile';
import { restaurants } from '../data/restaurants';
import { tracking as mockTracking } from '../data/tracking';

// ─── Token helpers (still use AsyncStorage for auth flow) ───
const TOKEN_KEY = 'savor_auth_token';

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to get token:', err);
    return null;
  }
}

export async function saveToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save token:', err);
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove token:', err);
  }
}

// ─── Read-only routes ───────────────────────────────────────

export async function fetchCategories() {
  return [...categories];
}

export async function fetchRestaurants() {
  return [...restaurants];
}

export async function fetchFoods(params = {}) {
  const { category, restaurant } = params;
  let result = [...foods];

  if (category) {
    result = result.filter((f) => f.category_slug === category);
  }

  if (restaurant) {
    result = result.filter(
      (f) =>
        String(f.restaurant_id) === String(restaurant) ||
        f.restaurant_name.toLowerCase().replace(/\s+/g, '-') === restaurant
    );
  }

  return result;
}

// ─── Auth routes ────────────────────────────────────────────

export async function login(email, password) {
  // Dummy login — accepts any non-empty email/password.
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  // Check against dummy user credentials
  if (email === dummyUser.email && password === dummyUser.password) {
    await saveToken(dummyToken);
    return {
      success: true,
      message: 'Login successful.',
      token: dummyToken,
      user: {
        id: dummyUser.id,
        name: dummyUser.name,
        email: dummyUser.email,
        phone: dummyUser.phone,
      },
    };
  }

  // Accept any credentials for demo purposes
  await saveToken(dummyToken);
  return {
    success: true,
    message: 'Login successful.',
    token: dummyToken,
    user: {
      id: dummyUser.id,
      name: dummyUser.name,
      email: email,
      phone: dummyUser.phone,
    },
  };
}

export async function signup(name, email, password, phone) {
  if (!name || !email || !password) {
    return { success: false, message: 'Name, email, and password are required.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  // Dummy signup — always succeeds
  await saveToken(dummyToken);
  return {
    success: true,
    message: 'Account created successfully.',
    token: dummyToken,
    user: {
      id: dummyUser.id,
      name,
      email,
      phone: phone || null,
    },
  };
}

export async function logout() {
  await removeToken();
}

// ─── Profile routes ─────────────────────────────────────────

export async function fetchProfile() {
  return { ...mockProfile };
}

export async function updateProfile({ name, email, phone }) {
  // Update the in-memory profile (temporary — not persisted)
  if (name) mockProfile.name = name;
  if (email) mockProfile.email = email;
  if (phone) mockProfile.phone = phone;
  return { ...mockProfile };
}

// ─── Cart routes ────────────────────────────────────────────

export async function fetchCart() {
  return mockCartStore.getCart();
}

export async function addToCart(foodItemId, quantity = 1, specialInstructions = '') {
  return mockCartStore.addItem(foodItemId, quantity, specialInstructions);
}

export async function removeFromCart(cartItemId) {
  return mockCartStore.removeItem(cartItemId);
}

// ─── Orders routes ──────────────────────────────────────────

export async function fetchOrders() {
  return [...mockOrders];
}

export async function fetchOrderById(id) {
  const order = mockOrders.find(
    (o) => String(o.id) === String(id) || o.order_number === id
  );
  if (!order) {
    throw new Error('Order not found.');
  }
  return { ...order, order_items: [...(order.order_items || [])] };
}

export async function fetchOrderTracking(id) {
  const orderId = Number(id);
  return mockTracking.filter((t) => t.order_id === orderId);
}

export async function placeOrder({ restaurantId, addressId, paymentMethod = 'cash', specialInstructions = '' }) {
  if (!restaurantId || !addressId) {
    throw new Error('restaurant_id and address_id are required.');
  }

  // Get current cart
  const cart = mockCartStore.getCart();
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, i) => sum + i.line_total, 0);
  const deliveryFee = cart.items[0].delivery_fee || 0;
  const discount = 0;
  const tax = 0;
  const totalAmount = subtotal + deliveryFee - discount + tax;

  // Generate order number
  const orderNumber = 'ORD-' + Date.now().toString().slice(-6);

  // Build the new order
  const newOrder = {
    id: mockOrders.length + 1,
    order_number: orderNumber,
    user_id: 1,
    restaurant_id: restaurantId,
    address_id: addressId,
    subtotal,
    delivery_fee: deliveryFee,
    discount,
    tax,
    total_amount: totalAmount,
    payment_method: paymentMethod,
    payment_status: 'pending',
    order_status: 'pending',
    special_instructions: specialInstructions || '',
    placed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    restaurant_name: cart.items[0].restaurant_name,
    restaurant_rating: 4.8,
    address_label: 'Home',
    address_line1: '42, Sunrise Apartments',
    city: 'Jaipur',
    postal_code: '302016',
    order_items: cart.items.map((item) => ({
      id: item.id,
      order_id: mockOrders.length + 1,
      food_item_id: item.food_item_id,
      food_name: item.food_name,
      quantity: item.quantity,
      unit_price: item.effective_price,
      total_price: item.line_total,
      special_instructions: item.special_instructions || '',
    })),
  };

  // Add to orders array
  mockOrders.push(newOrder);

  // Clear the cart
  mockCartStore.clear();

  return { ...newOrder, order_items: [...newOrder.order_items] };
}

// ─── Addresses routes ───────────────────────────────────────

export async function fetchAddresses() {
  return [...addresses];
}

// ─── Favourites routes ──────────────────────────────────────

export async function fetchFavourites() {
  return [...favourites];
}

// ─── Payments routes ────────────────────────────────────────

export async function fetchPayments() {
  return [...payments];
}

// ─── Notifications routes ───────────────────────────────────

export async function fetchNotifications() {
  return [...notifications];
}

// ─── Config routes ──────────────────────────────────────────

export async function fetchConfig() {
  return { ...config };
}
