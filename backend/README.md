# Savor API — Backend

Express + MySQL backend for the Savor food delivery app.

## Quick Start

```bash
# Start MySQL (XAMPP)
/Applications/XAMPP/xamppfiles/bin/mysql.server start

# Start the API server
cd backend
node server.js
# → http://0.0.0.0:5000  (LAN: http://192.168.1.19:5000)
```

## Environment

Copy `.env.example` to `.env` and adjust:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=food_db
DB_SOCKET=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
```

## API Endpoints

### Read-only (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | All active categories |
| GET | `/api/restaurants` | All active restaurants |
| GET | `/api/restaurants/:id` | Single restaurant (by id or slug) |
| GET | `/api/foods` | All available food items |
| GET | `/api/foods?category=<slug>` | Filter by category |
| GET | `/api/foods?restaurant=<slug>` | Filter by restaurant |
| GET | `/api/foods/:id` | Single food item (by id or slug) |

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/signup` | `{name, email, password, phone?}` | Create account → returns JWT |
| POST | `/api/login` | `{email, password}` | Login → returns JWT |

### Protected (Bearer JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | List cart items with food details |
| POST | `/api/cart` | Add/update cart item `{food_item_id, quantity?, special_instructions?}` |
| DELETE | `/api/cart/:id` | Remove cart item |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/:id` | Order details with items |
| POST | `/api/orders` | Place order from cart `{restaurant_id, address_id, payment_method?, special_instructions?}` |
| GET | `/api/addresses` | List user's addresses |
| POST | `/api/addresses` | Create address |
| PUT | `/api/addresses/:id` | Update address |
| DELETE | `/api/addresses/:id` | Delete address |
| GET | `/api/favourites` | List favourites |
| POST | `/api/favourites` | Add favourite `{food_item_id}` |
| DELETE | `/api/favourites/:id` | Remove favourite |
| GET | `/api/payments` | List payments |
| GET | `/api/payments/:id` | Payment details |

## Database Schema

All tables live in the `food_db` MySQL database:

- `categories` — food categories (Pizza, Burger, Indian, etc.)
- `restaurants` — restaurant profiles with delivery info
- `food_items` — menu items linked to restaurants & categories
- `users` — user accounts (bcrypt-hashed passwords)
- `cart_items` — per-user shopping cart
- `orders` — order headers
- `order_items` — individual items within an order
- `addresses` — saved delivery addresses
- `favourites` — user favourited food items
- `payments` — payment records
- `reviews` — user reviews of food items
- `order_tracking` — order status history
- `notifications` — user notifications

## Testing

```bash
# Login and capture token
TOKEN=$(curl -s -X POST http://192.168.1.19:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@example.com","password":"password"}' | jq -r .token)

# Use token for protected routes
curl -s http://192.168.1.19:5000/api/cart -H "Authorization: Bearer $TOKEN" | jq
```

## Expo App Integration

The Expo app at `myApp/` uses `src/services/api.js` as a centralized API client.
JWT tokens are stored in `AsyncStorage` under the key `savor_auth_token`.
