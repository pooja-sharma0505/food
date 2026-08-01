import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API base URL — configurable via EXPO_PUBLIC_API_URL env var.
// Falls back to LAN IP for local development (backend running on port 5000).
// Set EXPO_PUBLIC_API_URL for production (e.g. Vercel) deployments.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.19:5000/api';

const TOKEN_KEY = 'savor_auth_token';

/**
 * Retrieve the JWT token from AsyncStorage.
 */
export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to get token:', err);
    return null;
  }
}

/**
 * Save the JWT token to AsyncStorage.
 */
export async function saveToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save token:', err);
  }
}

/**
 * Remove the JWT token from AsyncStorage.
 */
export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove token:', err);
  }
}

/**
 * Core fetch wrapper — automatically attaches the JWT Bearer token.
 */
export async function apiFetch(path, options = {}) {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    // fetch() throws a TypeError when the network request fails entirely
    // (e.g. host unreachable, DNS failure, CORS block).
    if (err instanceof TypeError) {
      throw new Error("Can't reach the server. Check your connection.");
    }
    throw err;
  }

  const data = await response.json().catch(() => ({ success: false, message: 'Network error' }));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// ─── Read-only routes ───────────────────────────────────────────

export async function fetchCategories() {
  const data = await apiFetch('/categories');
  return data.data;
}

export async function fetchRestaurants() {
  const data = await apiFetch('/restaurants');
  return data.data;
}

export async function fetchFoods(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/foods?${query}` : '/foods';
  const data = await apiFetch(path);
  return data.data;
}

// ─── Auth routes ────────────────────────────────────────────────

export async function login(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    await saveToken(data.token);
  }
  return data;
}

export async function signup(name, email, password, phone) {
  const data = await apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
  if (data.token) {
    await saveToken(data.token);
  }
  return data;
}

export async function logout() {
  await removeToken();
}

// ─── Profile routes ─────────────────────────────────────────────

export async function fetchProfile() {
  const data = await apiFetch('/me');
  return data.data;
}

export async function updateProfile({ name, email, phone }) {
  const data = await apiFetch('/me', {
    method: 'PUT',
    body: JSON.stringify({ name, email, phone }),
  });
  return data.data;
}

// ─── Cart routes ────────────────────────────────────────────────

export async function fetchCart() {
  const data = await apiFetch('/cart');
  return data.data;
}

export async function addToCart(foodItemId, quantity = 1, specialInstructions = '') {
  const data = await apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ food_item_id: foodItemId, quantity, special_instructions: specialInstructions }),
  });
  return data.data;
}

export async function removeFromCart(cartItemId) {
  const data = await apiFetch(`/cart/${cartItemId}`, { method: 'DELETE' });
  return data.data;
}

// ─── Orders routes ──────────────────────────────────────────────

export async function fetchOrders() {
  const data = await apiFetch('/orders');
  return data.data;
}

export async function fetchOrderById(id) {
  const data = await apiFetch(`/orders/${id}`);
  return data.data;
}

export async function fetchOrderTracking(id) {
  const data = await apiFetch(`/orders/${id}/tracking`);
  return data.data;
}

export async function placeOrder({ restaurantId, addressId, paymentMethod = 'cash', specialInstructions = '' }) {
  const data = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({
      restaurant_id: restaurantId,
      address_id: addressId,
      payment_method: paymentMethod,
      special_instructions: specialInstructions,
    }),
  });
  return data.data;
}

// ─── Addresses routes ───────────────────────────────────────────

export async function fetchAddresses() {
  const data = await apiFetch('/addresses');
  return data.data;
}

// ─── Favourites routes ──────────────────────────────────────────

export async function fetchFavourites() {
  const data = await apiFetch('/favourites');
  return data.data;
}

// ─── Payments routes ────────────────────────────────────────────

export async function fetchPayments() {
  const data = await apiFetch('/payments');
  return data.data;
}

// ─── Notifications routes ───────────────────────────────────────

export async function fetchNotifications() {
  const data = await apiFetch('/notifications');
  return data.data;
}

// ─── Config routes ──────────────────────────────────────────────

export async function fetchConfig() {
  const data = await apiFetch('/config');
  return data.data;
}
