# COMPREHENSIVE FRONTEND ANALYSIS REPORT

## 1. Current Frontend Architecture

**Framework:** React Native Expo (SDK ~56) + Expo Router (~56.2)
**Navigation:** Expo Router with `Stack` (root layout at `src/app/_layout.js`) + `Tabs` (tab layout at `src/app/tabs/_layout.js`)
**State Management:** A single custom event-based store (`cartStore.js`) using a `Set` of listener callbacks. No Redux, no Context API for data.
**Styling:** Custom theme (`savorTheme.js`) with `SavorColors`, `SavorRadius`, `SavorShadow`. Uses `react-native-safe-area-context`.
**Fonts:** `DMSans` (400/500/600/700) and `PlayfairDisplay_700Bold` via `@expo-google-fonts`.
**Components:** All UI components live in `src/components/savor/` — `Screen`, `AuthCard`, `SavorButton`, `SavorInput`, `SearchBar`, `PageHeader`, `SerifText`/`SansText`, `SegmentedTabs`, `ProgressSteps`, `SavorLogo`, `SocialAuth`, `OtpInput`.

**No API client exists.** The app has zero `fetch`/`axios` calls. All data is imported from `mockData.js` or hard-coded inline.

**Project structure:**
```
food/
├── myApp/                    (React Native Expo app)
│   ├── src/
│   │   ├── app/              (Expo Router routes — one file per screen)
│   │   │   ├── tabs/         (5 tab screens + _layout.js)
│   │   │   ├── index.js      (splash)
│   │   │   ├── login.js, signup1-3.js, otp.js, forgot.js
│   │   │   ├── home.js       (legacy redirect → /tabs/home)
│   │   │   ├── restaurant.js, item.js
│   │   │   ├── cart.js (in tabs/), checkout.js, order-placed.js
│   │   │   ├── orders.js, order-detail.js, tracking.js, review.js
│   │   │   ├── favourites.js, addresses.js, payments.js, search.js
│   │   │   ├── settings.js, edit-profile.js, success.js
│   │   │   ├── onboarding1-3.js, about.js, help.js, privacy.js
│   │   ├── components/       (UI components)
│   │   ├── constants/        (savorTheme.js)
│   │   ├── data/             (mockData.js)
│   │   ├── hooks/            (font loading, theme)
│   │   └── store/            (cartStore.js)
│   ├── app.json, package.json, tsconfig.json
└── backend/                  (does NOT exist yet — to be created)
```

---

## 2. List of All Static/Mock Data

### From `src/data/mockData.js` (12 named exports):

| Export | Used By | Description |
|--------|---------|-------------|
| `CATEGORIES` | `tabs/home.js` | 5 categories: Pizza, Noodles, Burger, Indian, Salad — `{id, label, icon}` |
| `POPULAR_DISHES` | `tabs/home.js`, `search.js` | 3 dishes — `{id, name, restaurant, price, rating, emoji, bg, category}` |
| `RESTAURANTS` | `tabs/explore.js`, `search.js` | 3 restaurants — `{id, name, rating, time, fee, cuisines[], emoji, tags[]}` |
| `MENU_ITEMS` | `restaurant.js` | 4 menu items — `{id, name, price, emoji, calories}` |
| `CART_ITEMS` | `cartStore.js` (initial state) | 3 cart items — `{id, name, shop, price, emoji, qty}` |
| `NOTIFICATIONS` | `tabs/alerts.js` | 4 notifications — `{id, icon, title, body, time, unread}` |
| `FOOD_PREFS` | `signup2.js` | 6 food preference chips — `{id, label, icon}` |
| `DIET_TAGS` | `signup2.js` | `['Vegetarian', 'Vegan', 'Non-veg']` |
| `MY_ORDERS` | `orders.js`, `order-detail.js` | 3 orders — `{id, restaurant, emoji, items, total, status, statusColor, date, orderItems[]}` |
| `FAVOURITES` | `favourites.js` | 3 favourites — `{id, name, shop, price, emoji, rating}` |
| `ADDRESSES` | `addresses.js` | 2 addresses — `{id, label, icon, line1, line2, pin, default}` |
| `PAYMENT_METHODS` | `payments.js` | 3 payment methods — `{id, label, detail, icon, default}` |

### Hard-coded inline data (not in mockData.js):

| Screen | Hard-coded Data |
|--------|----------------|
| `tabs/profile.js` | Name "Rahul Sharma", email "rahul@gmail.com", avatar "R", stats (42 orders, 3 reviews, Gold status) |
| `tabs/home.js` | "Good Evening 🌙", "RK" avatar, "50% Off Today!" banner, "SAVOR50" code |
| `tabs/explore.js` | `FILTERS = ['All', 'Italian', 'Indian', 'Chinese']` |
| `checkout.js` | `PAYMENTS = ['UPI / PhonePay', 'Cash on Delivery', 'Net Banking']`, hard-coded address "Home / Subhash Nagar, Jaipur", hard-coded total "₹1,090" |
| `restaurant.js` | Hard-coded emoji "🍕", name "Bella Italia", tags `['Pizza', 'Pasta', 'Risotto']`, meta "⭐ 4.8 · 20–30 min · Italian" |
| `item.js` | Hard-coded restaurant "Bella Italia", "Classic Italian", stats (Time 25m, Cal 680, Rate 4.8), hard-coded description |
| `tracking.js` | `STEPS` array (4 steps), hard-coded order "#ORD-8820", driver "Ravi Kumar", "⭐ 4.9 delivery partner" |
| `review.js` | `DISHES = [{name: 'Margherita Pizza', emoji: '🍕', stars: '⭐⭐⭐⭐½'}, {name: 'Caesar Salad', emoji: '🥗', stars: '⭐⭐⭐⭐⭐'}]`, hard-coded stars "⭐⭐⭐⭐☆" |
| `order-placed.js` | Hard-coded "Order #ORD-8820", "Estimated delivery: 7:45 PM" |
| `login.js` | Hard-coded email `rahul@gmail.com` as default state |
| `signup1.js` | Placeholders: "Rahul Sharma", "rahul@gmail.com" |
| `signup3.js` | Hard-coded "Rahul Sharma", "rahul@gmail.com", hard-coded address "42, Sunrise Apartments / Subhash Nagar / Jaipur / 302016" |
| `edit-profile.js` | Hard-coded "Rahul Sharma", "rahul@gmail.com", "+91 98765 43210" |
| `success.js` | Hard-coded "Rahul", "SAVOR50" coupon |
| `otp.js` | Hard-coded phone "+91 98765 43210", code "832" |
| `settings.js` | `LINKS` array (6 links), "Savor v1.0.0" version |
| `tabs/alerts.js` | Navigation logic: `n.id === '1'` → `/tracking`, `n.id === '3'` → `/review`, `n.id === '2'` → `/favourites` |

---

## 3. Screen-by-Screen Data Requirements

### `src/app/tabs/home.js`
- **Current data:** `CATEGORIES`, `POPULAR_DISHES` from mockData
- **Object shape:** `{id, name, restaurant, price, rating, emoji, bg, category}` for dishes; `{id, label, icon}` for categories
- **Database source:** `categories`, `food_items` (where `is_popular=1`), `restaurants` (for restaurant name)
- **Required API:** `GET /api/categories`, `GET /api/foods/popular`
- **Changes required:** Replace `CATEGORIES` import with API call; replace `POPULAR_DISHES` with API call; transform DB rows into `{id, name, restaurant, price, rating, emoji, bg, category}` shape

### `src/app/tabs/explore.js`
- **Current data:** `RESTAURANTS` from mockData
- **Object shape:** `{id, name, rating, time, fee, cuisines[], emoji, tags[]}`
- **Database source:** `restaurants`
- **Required API:** `GET /api/restaurants`
- **Changes required:** Replace `RESTAURANTS` import with API call; transform `cuisine` string → `cuisines[]` array; derive `time` from `delivery_time_min`/`delivery_time_max`; derive `fee` from `delivery_fee`

### `src/app/tabs/cart.js`
- **Current data:** `cartStore.getItems()` (initialized from `CART_ITEMS`)
- **Object shape:** `{id, name, shop, price, emoji, qty}`
- **Database source:** `cart_items` + `food_items` + `restaurants`
- **Required API:** `GET /api/cart`, `PATCH /api/cart/:id`, `DELETE /api/cart/:id`
- **Changes required:** Replace `cartStore` with server-backed cart; transform DB rows into `{id, name, shop, price, emoji, qty}` shape; price must come from `food_items.price` (not trusted from frontend)

### `src/app/tabs/profile.js`
- **Current data:** Hard-coded "Rahul Sharma", "rahul@gmail.com", "R" avatar
- **Object shape:** `{name, email}`
- **Database source:** `users`
- **Required API:** `GET /api/profile`
- **Changes required:** Replace hard-coded name/email with API call; derive avatar initial from `name`

### `src/app/tabs/alerts.js`
- **Current data:** `NOTIFICATIONS` from mockData
- **Object shape:** `{id, icon, title, body, time, unread}`
- **Database source:** `notifications`
- **Required API:** `GET /api/notifications`, `PATCH /api/notifications/:id/read`
- **Changes required:** Replace `NOTIFICATIONS` import with API call; derive `icon` from `type`; derive `time` from `created_at`; map `is_read` → `unread`

### `src/app/restaurant.js`
- **Current data:** `MENU_ITEMS` from mockData; hard-coded restaurant info
- **Object shape:** Menu items `{id, name, price, emoji, calories}`; restaurant `{name, rating, time, tags[]}`
- **Database source:** `food_items` + `restaurants`
- **Required API:** `GET /api/restaurants/:id`, `GET /api/restaurants/:id/foods`
- **Changes required:** Replace `MENU_ITEMS` with API call; replace hard-coded restaurant info with API call; derive `calories` (not in DB — see missing fields); derive `tags` from `cuisine` string

### `src/app/item.js`
- **Current data:** Route params `{name, price, emoji}` from `restaurant.js`
- **Object shape:** `{name, price, emoji}`
- **Database source:** `food_items`
- **Required API:** `GET /api/foods/:id`
- **Changes required:** Replace route params with food item ID; fetch full food item from API; derive restaurant name, calories, rating from DB

### `src/app/favourites.js`
- **Current data:** `FAVOURITES` from mockData
- **Object shape:** `{id, name, shop, price, emoji, rating}`
- **Database source:** `favourites` + `food_items` + `restaurants`
- **Required API:** `GET /api/favourites`, `POST /api/favourites`, `DELETE /api/favourites/:id`
- **Changes required:** Replace `FAVOURITES` import with API call; transform DB rows (JOIN favourites → food_items → restaurants) into expected shape

### `src/app/addresses.js`
- **Current data:** `ADDRESSES` from mockData
- **Object shape:** `{id, label, icon, line1, line2, pin, default}`
- **Database source:** `addresses`
- **Required API:** `GET /api/addresses`, `POST /api/addresses`, `PATCH /api/addresses/:id`, `DELETE /api/addresses/:id`
- **Changes required:** Replace `ADDRESSES` import with API call; transform `address_line1` → `line1`, `address_line2` → `line2`, `postal_code` → `pin`, `is_default` → `default`; derive `icon` from `label`

### `src/app/checkout.js`
- **Current data:** Hard-coded `PAYMENTS` array, hard-coded address, hard-coded total "₹1,090"
- **Object shape:** Payment methods `{label, detail, icon}`; address `{label, line1, line2, pin}`
- **Database source:** `addresses`, `payments`, `cart_items`, `food_items`, `orders`
- **Required API:** `GET /api/addresses` (default), `GET /api/payments` (default), `POST /api/orders`
- **Changes required:** Replace hard-coded payments with API call; replace hard-coded address with default address from API; calculate total from cart (server-side); `POST /api/orders` must read prices from `food_items` and calculate totals on backend

### `src/app/orders.js`
- **Current data:** `MY_ORDERS` from mockData
- **Object shape:** `{id, restaurant, emoji, items, total, status, statusColor, date, orderItems[]}`
- **Database source:** `orders` + `order_items` + `restaurants`
- **Required API:** `GET /api/orders`
- **Changes required:** Replace `MY_ORDERS` import with API call; transform DB rows; derive `statusColor` from `order_status`; derive `date` from `placed_at`; derive `items` summary string from `order_items`

### `src/app/order-detail.js`
- **Current data:** `MY_ORDERS` (filtered by `id` route param) from mockData
- **Object shape:** Same as orders, plus `orderItems[]` for itemized list
- **Database source:** `orders` + `order_items` + `restaurants`
- **Required API:** `GET /api/orders/:id`
- **Changes required:** Replace `MY_ORDERS` import with API call; transform DB rows; derive `emoji` from restaurant/food; derive `statusColor` from `order_status`

### `src/app/tracking.js`
- **Current data:** Hard-coded `STEPS` array, hard-coded driver "Ravi Kumar"
- **Object shape:** Steps `{label, time, sub, status}`; order info `#ORD-8820`
- **Database source:** `order_tracking` + `orders`
- **Required API:** `GET /api/orders/:id/tracking`
- **Changes required:** Replace `STEPS` with API call; map `order_tracking` rows to step objects; derive step labels from `status` enum values

### `src/app/payments.js`
- **Current data:** `PAYMENT_METHODS` from mockData
- **Object shape:** `{id, label, detail, icon, default}`
- **Database source:** `payments`
- **Required API:** `GET /api/payments`, `POST /api/payments`, `PATCH /api/payments/:id/default`
- **Changes required:** Replace `PAYMENT_METHODS` import with API call; derive `label` from `payment_method` enum; derive `detail` from `provider`/`transaction_id`; derive `icon` from `payment_method`

### `src/app/review.js`
- **Current data:** Hard-coded `DISHES` array
- **Object shape:** `{name, emoji, stars}`
- **Database source:** `order_items` + `food_items`
- **Required API:** `POST /api/reviews`
- **Changes required:** Replace `DISHES` with order items from the order being reviewed (passed via route param); transform `rating` tinyint → stars string; `POST /api/reviews` to submit

### `src/app/search.js`
- **Current data:** `POPULAR_DISHES`, `RESTAURANTS` from mockData; `q` route param
- **Object shape:** Same as home/explore
- **Database source:** `food_items`, `restaurants`
- **Required API:** `GET /api/foods?search=`, `GET /api/restaurants?search=`
- **Changes required:** Replace mock data imports with API calls; filter server-side via search param

### `src/app/login.js`
- **Current data:** Hard-coded email `rahul@gmail.com` as default state
- **Object shape:** `{email, password}` (or phone)
- **Database source:** `users`
- **Required API:** `POST /api/auth/login`
- **Changes required:** Replace navigation-only button with API call; on success, store JWT; navigate to `/tabs/home`

### `src/app/signup1.js`
- **Current data:** Hard-coded placeholders "Rahul Sharma", "rahul@gmail.com"
- **Object shape:** `{name, email, password}`
- **Database source:** `users`
- **Required API:** `POST /api/auth/register` (step 1)
- **Changes required:** Capture input values; call register API; store temp registration data for step 2/3

### `src/app/signup2.js`
- **Current data:** `FOOD_PREFS`, `DIET_TAGS` from mockData
- **Object shape:** `{food_prefs: string[], diet: string}`
- **Database source:** `categories` (for prefs); no table for user dietary preference
- **Required API:** `GET /api/categories` (for prefs), `POST /api/auth/register/preferences`
- **Changes required:** Replace `FOOD_PREFS` with categories from API; send preferences to backend

### `src/app/signup3.js`
- **Current data:** Hard-coded "Rahul Sharma", "rahul@gmail.com", hard-coded address
- **Object shape:** `{address_line1, address_line2, city, state, postal_code}`
- **Database source:** `addresses`
- **Required API:** `POST /api/addresses` (default)
- **Changes required:** Capture address input; call address API; complete registration

### `src/app/edit-profile.js`
- **Current data:** Hard-coded "Rahul Sharma", "rahul@gmail.com", "+91 98765 43210"
- **Object shape:** `{name, email, phone}`
- **Database source:** `users`
- **Required API:** `GET /api/profile`, `PATCH /api/profile`
- **Changes required:** Replace hard-coded values with API call; add save handler that calls `PATCH /api/profile`

### `src/app/settings.js`
- **Current data:** Hard-coded `LINKS` array, "Savor v1.0.0"
- **Object shape:** Menu links `{icon, label, route}`
- **Database source:** None (static UI)
- **Required API:** None (logout → clear JWT)
- **Changes required:** Logout button should clear JWT token and navigate to `/login`

### `src/app/order-placed.js`
- **Current data:** Hard-coded "Order #ORD-8820", "Estimated delivery: 7:45 PM"
- **Object shape:** `{order_number, estimated_time}`
- **Database source:** `orders`
- **Required API:** None (data passed from checkout via route params or context)
- **Changes required:** Receive order number from checkout response; display dynamically

### `src/app/success.js`
- **Current data:** Hard-coded "Rahul", "SAVOR50" coupon
- **Object shape:** `{name}`
- **Database source:** `users`
- **Required API:** `GET /api/profile` (after registration)
- **Changes required:** Replace hard-coded name with API call or registration data

### `src/app/otp.js`
- **Current data:** Hard-coded phone "+91 98765 43210", code "832"
- **Object shape:** `{phone, code}`
- **Database source:** `users`
- **Required API:** `POST /api/auth/verify-otp`
- **Changes required:** Replace navigation-only button with API call; on success, store JWT

### `src/app/forgot.js`
- **Current data:** Hard-coded email `rahul@gmail.com` as default
- **Object shape:** `{email}`
- **Database source:** `users`
- **Required API:** `POST /api/auth/forgot-password`
- **Changes required:** Replace `setSent(true)` with API call

---

## 4. Existing Object/Data Shapes

### Mock Data Shapes (from mockData.js):

```js
// CATEGORIES
{id: string, label: string, icon: string}

// POPULAR_DISHES
{id: string, name: string, restaurant: string, price: string, rating: number, emoji: string, bg: string, category: string}

// RESTAURANTS
{id: string, name: string, rating: number, time: string, fee: string, cuisines: string[], emoji: string, tags: string[]}

// MENU_ITEMS
{id: string, name: string, price: string, emoji: string, calories: number}

// CART_ITEMS
{id: string, name: string, shop: string, price: number, emoji: string, qty: number}

// NOTIFICATIONS
{id: string, icon: string, title: string, body: string, time: string, unread: boolean}

// MY_ORDERS
{id: string, restaurant: string, emoji: string, items: string, total: string, status: string, statusColor: string, date: string, orderItems: [{id, name, price, emoji, qty}]}

// FAVOURITES
{id: string, name: string, shop: string, price: string, emoji: string, rating: number}

// ADDRESSES
{id: string, label: string, icon: string, line1: string, line2: string, pin: string, default: boolean}

// PAYMENT_METHODS
{id: string, label: string, detail: string, icon: string, default: boolean}
```

### Database Table Schemas:

```
users: id, name, email, phone, password, profile_image, is_active, created_at, updated_at
addresses: id, user_id, label, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at
categories: id, name, slug, icon, image, is_active, sort_order, created_at, updated_at
restaurants: id, name, slug, description, logo, cover_image, cuisine, phone, email, address, city, state, postal_code, rating, total_reviews, delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_open, is_active, created_at, updated_at
food_items: id, restaurant_id, category_id, name, slug, description, image, price, discount_price, rating, total_reviews, is_veg, is_available, is_popular, preparation_time, created_at, updated_at
favourites: id, user_id, food_item_id, created_at
cart_items: id, user_id, food_item_id, quantity, special_instructions, created_at, updated_at
orders: id, order_number, user_id, restaurant_id, address_id, subtotal, delivery_fee, discount, tax, total_amount, payment_method, payment_status, order_status, special_instructions, placed_at, updated_at
order_items: id, order_id, food_item_id, food_name, quantity, unit_price, total_price, special_instructions, created_at
payments: id, order_id, user_id, transaction_id, payment_method, amount, status, provider, paid_at, created_at, updated_at
reviews: id, user_id, food_item_id, order_id, rating, comment, created_at, updated_at
notifications: id, user_id, title, message, type, is_read, created_at
order_tracking: id, order_id, status, message, created_at
```

### Existing Data in Database:

- **5 users:** Rahul Sharma (id=1), Priya Verma (id=2), Amit Kumar (id=3), Neha Singh (id=4), Rohan Patel (id=5)
- **5 addresses:** All with labels, full names, cities, postal codes, all is_default=1
- **6 categories:** Pizza (🍕), Burger (🍔), Indian (🛛), Chinese (🥡), Desserts (🍰), Drinks (🥤)
- **5 restaurants:** Pizza Palace, Burger House, Spice Kitchen, Dragon Wok, Sweet Corner
- **10 food items:** 2 per restaurant, with prices, discount prices, is_veg, is_available, is_popular flags
- **8 favourites:** User 1 has items 1,5,9; User 2 has items 3,7; etc.
- **5 cart items:** User 1 has items 1(qty=2), 7(qty=1); User 2 has item 3(qty=2); etc.
- **1 order:** ORD-100001, user 1, restaurant 1, address 1, subtotal 498, delivery_fee 30, discount 50, total 478, payment upi, paid, confirmed
- **1 order item:** order 1, food_item 1, "Margherita Pizza", qty 2, unit_price 249, total 498
- **1 payment:** order 1, user 1, upi, 478, paid, UPI provider
- **1 review:** user 1, food_item 1, order 1, rating 5, "Delicious pizza and fast delivery."
- **1 notification:** user 1, "Order Confirmed", "Your order ORD-100001 has been confirmed.", type=order, is_read=0
- **2 order_tracking:** order 1, pending "Order received", confirmed "Restaurant confirmed your order"

---

## 5. Frontend → Database Mapping

### Screen-by-screen mapping:

| Screen | Mock Data Source | Database Tables | Required API |
|--------|-----------------|-----------------|--------------|
| `tabs/home.js` | `CATEGORIES`, `POPULAR_DISHES` | `categories`, `food_items` (is_popular=1), `restaurants` | `GET /api/categories`, `GET /api/foods/popular` |
| `tabs/explore.js` | `RESTAURANTS` | `restaurants` | `GET /api/restaurants` |
| `tabs/cart.js` | `cartStore` (CART_ITEMS) | `cart_items`, `food_items`, `restaurants` | `GET /api/cart`, `PATCH /api/cart/:id`, `DELETE /api/cart/:id` |
| `tabs/profile.js` | Hard-coded user | `users` | `GET /api/profile` |
| `tabs/alerts.js` | `NOTIFICATIONS` | `notifications` | `GET /api/notifications`, `PATCH /api/notifications/:id/read` |
| `restaurant.js` | `MENU_ITEMS`, hard-coded restaurant | `food_items`, `restaurants` | `GET /api/restaurants/:id`, `GET /api/restaurants/:id/foods` |
| `item.js` | Route params | `food_items` | `GET /api/foods/:id` |
| `favourites.js` | `FAVOURITES` | `favourites`, `food_items`, `restaurants` | `GET /api/favourites`, `POST /api/favourites`, `DELETE /api/favourites/:id` |
| `addresses.js` | `ADDRESSES` | `addresses` | `GET /api/addresses`, `POST /api/addresses`, `PATCH /api/addresses/:id` |
| `checkout.js` | Hard-coded PAYMENTS, address, total | `addresses`, `payments`, `cart_items`, `food_items`, `orders` | `GET /api/addresses`, `GET /api/payments`, `POST /api/orders` |
| `orders.js` | `MY_ORDERS` | `orders`, `order_items`, `restaurants` | `GET /api/orders` |
| `order-detail.js` | `MY_ORDERS` (by id) | `orders`, `order_items`, `restaurants` | `GET /api/orders/:id` |
| `tracking.js` | Hard-coded STEPS | `order_tracking`, `orders` | `GET /api/orders/:id/tracking` |
| `payments.js` | `PAYMENT_METHODS` | `payments` | `GET /api/payments`, `POST /api/payments`, `PATCH /api/payments/:id/default` |
| `review.js` | Hard-coded DISHES | `order_items`, `food_items`, `reviews` | `POST /api/reviews` |
| `search.js` | `POPULAR_DISHES`, `RESTAURANTS` | `food_items`, `restaurants` | `GET /api/foods?search=`, `GET /api/restaurants?search=` |
| `login.js` | Hard-coded email | `users` | `POST /api/auth/login` |
| `signup1.js` | Hard-coded placeholders | `users` | `POST /api/auth/register` |
| `signup2.js` | `FOOD_PREFS`, `DIET_TAGS` | `categories` | `GET /api/categories`, `POST /api/auth/register/preferences` |
| `signup3.js` | Hard-coded user/address | `users`, `addresses` | `POST /api/addresses` |
| `edit-profile.js` | Hard-coded user | `users` | `GET /api/profile`, `PATCH /api/profile` |
| `settings.js` | Hard-coded links | None | None (logout clears JWT) |
| `order-placed.js` | Hard-coded order number | `orders` | Data passed from checkout |
| `success.js` | Hard-coded name | `users` | `GET /api/profile` |
| `otp.js` | Hard-coded phone | `users` | `POST /api/auth/verify-otp` |
| `forgot.js` | Hard-coded email | `users` | `POST /api/auth/forgot-password` |

### Field-level mapping (frontend shape → database field):

| Frontend Field | Database Field | Transformation Needed |
|---------------|---------------|----------------------|
| `price: "₹320"` (string) | `price` (decimal) | Format as `₹{price.toLocaleString('en-IN')}` |
| `emoji: "🍕"` | No column | **MISSING** — need emoji column or derive from category |
| `bg: "#FFE8DC"` | No column | **MISSING** — need bg_color column or derive from category |
| `time: "20–30 min"` | `delivery_time_min`, `delivery_time_max` | Combine: `${min}–${max} min` |
| `fee: "₹40"` / `"Free delivery"` | `delivery_fee` (decimal) | If 0 → "Free delivery", else `₹{fee}` |
| `cuisines: ['Pizza', 'Pasta']` | `cuisine` (comma-separated string) | Split by comma |
| `tags: ['Italian']` | `cuisine` (same field) | Use same split, or derive from cuisine |
| `category: 'pizza'` | `category_id` (FK) | Map slug → id, or use `categories.slug` |
| `rating: 4.8` | `rating` (decimal 2,1) | Direct (but DB rating is 0.0 default) |
| `calories: 680` | No column | **MISSING** — need calories column on food_items |
| `statusColor: '#2E7D32'` | `order_status` (enum) | Derive from status enum |
| `date: "Today, 7:45 PM"` | `placed_at` (timestamp) | Format timestamp to relative date |
| `items: "Margherita Pizza, Caesar Salad +1"` | `order_items` | Build summary string from order_items |
| `unread: true` | `is_read` (tinyint) | `!is_read` |
| `time: "2 min ago"` | `created_at` (timestamp) | Format to relative time |
| `icon: "🛵"` | `type` (enum) | Derive from type |
| `line1` | `address_line1` | Rename |
| `line2` | `address_line2` | Rename |
| `pin` | `postal_code` | Rename |
| `default: true` | `is_default` (tinyint) | Direct |
| `shop: "Bella Italia"` | `restaurants.name` (via food_items.restaurant_id) | JOIN |
| `label: "UPI / PhonePay"` | `payment_method` (enum) | Map enum → display label |
| `detail: "rahul@ybl"` | `provider` / `transaction_id` | Combine or derive |
| `icon: "phone-portrait-outline"` | `payment_method` (enum) | Derive from enum |
| `stars: "⭐⭐⭐⭐½"` | `rating` (tinyint) | Convert number → stars string |
| `order_number: "ORD-8820"` | `order_number` (varchar) | Direct (DB uses "ORD-100001" format) |

---

## 6. Required API Endpoint List

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Login with email/phone + password → returns JWT |
| POST | `/api/auth/register` | Register new user (step 1: name, email, password) |
| POST | `/api/auth/register/preferences` | Save food preferences + diet (step 2) |
| POST | `/api/auth/verify-otp` | Verify OTP for phone login |
| POST | `/api/auth/forgot-password` | Send password reset link |

### Categories
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/categories` | Get all active categories |

### Restaurants
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/restaurants` | Get all active restaurants (optional `?cuisine=` filter) |
| GET | `/api/restaurants/:id` | Get restaurant detail |
| GET | `/api/restaurants/:id/foods` | Get food items for a restaurant |

### Food Items
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/foods/popular` | Get popular food items (is_popular=1) |
| GET | `/api/foods/:id` | Get food item detail |
| GET | `/api/foods?search=` | Search food items by name |

### Cart
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cart` | Get user's cart items |
| POST | `/api/cart` | Add item to cart `{food_item_id, quantity}` |
| PATCH | `/api/cart/:id` | Update quantity `{quantity}` |
| DELETE | `/api/cart/:id` | Remove item from cart |

### Favourites
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/favourites` | Get user's favourites |
| POST | `/api/favourites` | Add to favourites `{food_item_id}` |
| DELETE | `/api/favourites/:id` | Remove from favourites |

### Addresses
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/addresses` | Get user's addresses |
| POST | `/api/addresses` | Add address |
| PATCH | `/api/addresses/:id` | Edit address |
| DELETE | `/api/addresses/:id` | Delete address |

### Orders
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Place order (reads prices from food_items, uses transaction) |
| GET | `/api/orders/:id` | Get order details |
| GET | `/api/orders/:id/tracking` | Get order tracking history |

### Payments
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/payments` | Get user's payment methods |
| POST | `/api/payments` | Add payment method |
| PATCH | `/api/payments/:id/default` | Set as default |

### Reviews
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/reviews` | Submit review `{food_item_id, order_id, rating, comment}` |

### Notifications
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications` | Get user's notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |

### Profile
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/profile` | Get user profile |
| PATCH | `/api/profile` | Update profile (name, email, phone) |

---

## 7. Database Fields That Are Missing

### SUPPORTED (all required fields exist):
- **users** — name, email, phone, password, profile_image, is_active ✓
- **addresses** — label, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default ✓
- **categories** — name, slug, icon, is_active ✓
- **restaurants** — name, slug, description, logo, cover_image, cuisine, phone, email, address, city, state, postal_code, rating, delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_open, is_active ✓
- **food_items** — restaurant_id, category_id, name, slug, description, image, price, discount_price, rating, is_veg, is_available, is_popular, preparation_time ✓
- **favourites** — user_id, food_item_id ✓
- **cart_items** — user_id, food_item_id, quantity, special_instructions ✓
- **orders** — order_number, user_id, restaurant_id, address_id, subtotal, delivery_fee, discount, tax, total_amount, payment_method, payment_status, order_status, special_instructions ✓
- **order_items** — order_id, food_item_id, food_name, quantity, unit_price, total_price, special_instructions ✓
- **payments** — order_id, user_id, transaction_id, payment_method, amount, status, provider ✓
- **reviews** — user_id, food_item_id, order_id, rating, comment ✓
- **notifications** — user_id, title, message, type, is_read ✓
- **order_tracking** — order_id, status, message ✓

### PARTIALLY SUPPORTED (field exists but needs transformation):
- **Price format**: DB has `decimal(10,2)`, frontend expects `"₹320"` string → API transforms
- **Time format**: DB has `delivery_time_min`/`delivery_time_max` integers, frontend expects `"20–30 min"` string → API transforms
- **Fee format**: DB has `delivery_fee` decimal, frontend expects `"₹40"` or `"Free delivery"` string → API transforms
- **Cuisine**: DB has comma-separated string, frontend expects array → API splits
- **Order status**: DB has enum, frontend expects display string + color → API maps
- **Notification time**: DB has `created_at` timestamp, frontend expects `"2 min ago"` → API formats
- **Address fields**: DB has `address_line1`/`address_line2`/`postal_code`, frontend expects `line1`/`line2`/`pin` → API renames
- **Payment method**: DB has enum, frontend expects label/detail/icon → API maps
- **Rating**: DB has tinyint, frontend expects stars string → API converts
- **Order number**: DB uses `"ORD-100001"`, frontend uses `"ORD-8820"` → API can format

### NOT SUPPORTED (missing from database):

1. **Emoji field on food_items**
   - **Frontend feature:** All food/restaurant displays use emoji (🍕, 🍔, etc.)
   - **Table needing change:** `food_items`
   - **Column required:** `emoji` varchar(10)
   - **Why required:** The frontend renders emoji as the primary visual identifier for every food item across home, explore, search, favourites, cart, orders, review, and restaurant screens. Without it, the API would need to derive emoji from category (lossy) or use a placeholder.

2. **Emoji field on restaurants**
   - **Frontend feature:** Restaurant cards in explore/search show emoji
   - **Table needing change:** `restaurants`
   - **Column required:** `emoji` varchar(10)
   - **Why required:** Same as above — restaurants display emoji in explore, search, orders, favourites.

3. **Background color on food_items**
   - **Frontend feature:** Popular dish cards use `bg` color (e.g., `#FFE8DC`)
   - **Table needing change:** `food_items`
   - **Column required:** `bg_color` varchar(10)
   - **Why required:** The home screen renders food cards with category-specific background colors. Can be derived from category as a fallback.

4. **Calories on food_items**
   - **Frontend feature:** Restaurant menu items and item detail screen show calories
   - **Table needing change:** `food_items`
   - **Column required:** `calories` int(11)
   - **Why required:** `restaurant.js` renders `item.calories` and `item.js` shows "Cal" stat. No calories data exists in DB.

5. **Tags on restaurants**
   - **Frontend feature:** Restaurant page shows tags (`['Pizza', 'Pasta', 'Risotto']`)
   - **Table needing change:** `restaurants`
   - **Column required:** `tags` varchar(255) (comma-separated) or separate `restaurant_tags` table
   - **Why required:** `restaurant.js` hard-codes tags. The DB has `cuisine` as a single string which could be split, but the frontend expects distinct tag labels (e.g., "Pizza" vs cuisine "Pizza, Italian"). Can be derived from `cuisine` field as a partial solution.

6. **User dietary preferences**
   - **Frontend feature:** `signup2.js` collects dietary preference ("Vegetarian", "Vegan", "Non-veg") and food preferences
   - **Table needing change:** New table `user_preferences`
   - **Columns required:** `user_id` (FK), `dietary_preference` varchar(50), `food_preferences` text
   - **Why required:** No table exists to store user's dietary preference or food preference selections. The signup flow collects this data but has nowhere to persist it.

7. **Delivery partner / driver info**
   - **Frontend feature:** `tracking.js` shows driver name "Ravi Kumar", avatar "RK", rating "⭐ 4.9"
   - **Table needing change:** New table `delivery_partners`
   - **Columns required:** `id`, `name`, `phone`, `rating`, `vehicle_type`, `profile_image`
   - **Why required:** The tracking screen displays delivery partner information. No table exists for delivery partners. Could be added to `orders` table as `delivery_partner_id` FK.

8. **Notification icon**
   - **Frontend feature:** `tabs/alerts.js` displays notification icons (🛵, 🎉, ✅, 🍕)
   - **Table needing change:** `notifications`
   - **Column required:** `icon` varchar(10) or derive from `type`
   - **Why required:** The frontend uses emoji icons for visual identification. The DB has `type` enum which can be mapped to icons, but a direct column is cleaner.

9. **Notification relative time**
   - **Frontend feature:** `tabs/alerts.js` displays "2 min ago", "1 hr ago", "Yesterday"
   - **Table needing change:** None (can be computed from `created_at`)
   - **Why noted:** The API must format `created_at` timestamps into relative time strings.

10. **Order status color**
    - **Frontend feature:** `orders.js` and `order-detail.js` use `statusColor` hex values
    - **Table needing change:** None (can be computed from `order_status`)
    - **Why noted:** The API must map `order_status` enum values to hex color strings.

11. **Payment method display fields**
    - **Frontend feature:** `payments.js` shows `label`, `detail`, `icon` for each payment method
    - **Table needing change:** `payments`
    - **Columns required:** `label` varchar(100), `detail` varchar(255), `icon` varchar(50)
    - **Why required:** The DB has `payment_method` enum, `provider`, `transaction_id` but no display label or icon. Can be derived from `payment_method` enum as a partial solution.

12. **Order number format**
    - **Frontend feature:** Frontend uses "ORD-8820" format, DB uses "ORD-100001"
    - **Table needing change:** None (format difference only)
    - **Why noted:** The API can format the order number, or the DB format can be used as-is.

---

## 8. Authentication Flow Required by Current Screens

### Current flow (all client-side, no API):
1. **Splash** (`index.js`) → "Get Started" → `/onboarding1`
2. **Onboarding** (1→2→3) → "Create My Account" → `/success`
3. **Success** → "Start Exploring" → `/tabs/home`
4. **Splash** → "Sign in" → `/login`
5. **Login** → "Sign in" (email) → `/tabs/home` (direct navigation, no auth)
6. **Login** → "Sign in" (phone) → `/otp` → "Verify & Sign in" → `/tabs/home`
7. **Login** → "Forgot password?" → `/forgot` → "Send Reset Link" → shows success message
8. **Login** → "Sign up" → `/signup1` → `/signup2` → `/signup3` → `/success`

### Required backend auth flow:
1. **POST /api/auth/login** — Accept `{email, password}` or `{phone, otp}`; validate against `users` table with bcrypt; return JWT + user data
2. **POST /api/auth/register** — Accept `{name, email, password}`; hash password with bcrypt; insert into `users`; return temp registration token
3. **POST /api/auth/register/preferences** — Accept `{food_prefs[], diet}`; store in `user_preferences` table (MISSING)
4. **POST /api/addresses** — Accept address data; insert into `addresses` with `is_default=1`
5. **POST /api/auth/verify-otp** — Accept `{phone, code}`; verify OTP; return JWT
6. **POST /api/auth/forgot-password** — Accept `{email}`; look up user; send reset email (email sending not yet implemented)

### JWT storage in RN app:
- The app currently has NO token storage. Need to add `expo-secure-store` or similar.
- JWT must be sent in `Authorization: Bearer <token>` header for all authenticated endpoints.
- The `_layout.js` root layout should check for JWT on app start and redirect to `/login` if not present.

---

## 9. Cart Flow Required by cartStore.js

### Current cartStore.js:
```js
// Simple event-based store
let listeners = new Set();
let cartItems = [...INITIAL_CART]; // from mockData.js

export const cartStore = {
  getItems() { return cartItems; },
  getItemCount() { return cartItems.length; },
  getTotal() { return cartItems.reduce((sum, i) => sum + i.price * i.qty, 0); },
  updateItem(id, delta) {
    cartItems = cartItems
      .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
      .filter((item) => item.qty > 0);
    listeners.forEach((cb) => cb());
  },
  subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); },
};
```

### Current cart flow:
1. `cartStore.js` initializes from `CART_ITEMS` mock data (3 items)
2. `tabs/_layout.js` subscribes to `cartStore` for cart count (tab badge)
3. `tabs/cart.js` subscribes to `cartStore` for items; renders list with qty +/- buttons
4. `tabs/cart.js` "Proceed to Checkout" → `/checkout`
5. `item.js` "Add to Cart" → navigates to `/tabs/cart` (does NOT actually add to cart — just navigates)
6. `checkout.js` "Place Order" → shows Alert → `/order-placed`

### Required server-backed cart flow:
1. `GET /api/cart` — Fetch user's cart items from `cart_items` table (JOIN food_items + restaurants)
2. `POST /api/cart` — Add item: `{food_item_id, quantity}` → insert into `cart_items`
3. `PATCH /api/cart/:id` — Update quantity: `{quantity}` → update `cart_items.quantity`
4. `DELETE /api/cart/:id` — Remove item → delete from `cart_items`
5. `POST /api/orders` — Create order from cart items (transaction: read prices from `food_items`, insert into `orders` + `order_items` + `payments`, clear cart)
6. Cart total must be calculated on the backend from `food_items.price` — never trust frontend prices

### Migration approach:
- Keep `cartStore.js` as a local cache layer
- On app start (or when user logs in), sync `cartStore` with server cart
- `updateItem` should call `PATCH /api/cart/:id` or `DELETE /api/cart/:id`
- `item.js` "Add to Cart" should call `POST /api/cart` before navigating

---

## 10. Checkout/Order Flow Required by Existing Screens

### Current checkout flow:
1. `tabs/cart.js` → "Proceed to Checkout" → `/checkout`
2. `checkout.js` → shows hard-coded address, hard-coded payment methods, hard-coded total "₹1,090"
3. `checkout.js` → "Place Order" → Alert → `/order-placed`
4. `order-placed.js` → shows "Order #ORD-8820", "Track My Order" → `/tracking`
5. `tracking.js` → shows hard-coded steps, driver info, "Rate your order" → `/review`
6. `review.js` → "Submit Review" → `/tabs/home`

### Required server-backed order flow:
1. `checkout.js` → fetch default address (`GET /api/addresses`), fetch payment methods (`GET /api/payments`)
2. User selects address + payment method
3. `checkout.js` → "Place Order" → `POST /api/orders` with `{address_id, payment_method, cart_items}`
4. Backend: **transaction** — read prices from `food_items`, calculate subtotal/delivery_fee/discount/tax/total, insert into `orders`, insert into `order_items` (with current prices), insert into `payments`, clear `cart_items`, insert into `order_tracking` (pending status)
5. Backend returns `{order_number, total_amount, estimated_time}`
6. `order-placed.js` → display dynamic order number
7. `tracking.js` → `GET /api/orders/:id/tracking` → map `order_tracking` rows to step objects
8. `review.js` → `POST /api/reviews` with `{food_item_id, order_id, rating, comment}`

### Order creation transaction (backend):
```sql
START TRANSACTION;
-- 1. Read food items and calculate prices
SELECT id, price, discount_price FROM food_items WHERE id IN (...cart_item_ids);
-- 2. Insert order
INSERT INTO orders (order_number, user_id, restaurant_id, address_id, subtotal, delivery_fee, discount, tax, total_amount, payment_method, payment_status, order_status)
VALUES (...);
-- 3. Insert order items (with prices frozen at current values)
INSERT INTO order_items (order_id, food_item_id, food_name, quantity, unit_price, total_price)
VALUES (...);
-- 4. Insert payment record
INSERT INTO payments (order_id, user_id, payment_method, amount, status, provider)
VALUES (...);
-- 5. Insert initial tracking entry
INSERT INTO order_tracking (order_id, status, message)
VALUES (...);
-- 6. Clear cart items
DELETE FROM cart_items WHERE user_id = ?;
COMMIT;
```

---

## 11. Files That Will Eventually Need Modification

### Screens (data integration):
- `src/app/tabs/home.js` — Replace `CATEGORIES`/`POPULAR_DISHES` with API calls
- `src/app/tabs/explore.js` — Replace `RESTAURANTS` with API call
- `src/app/tabs/cart.js` — Replace `cartStore` with server-backed cart
- `src/app/tabs/profile.js` — Replace hard-coded user with API call
- `src/app/tabs/alerts.js` — Replace `NOTIFICATIONS` with API call
- `src/app/restaurant.js` — Replace `MENU_ITEMS` with API call
- `src/app/item.js` — Replace route params with food item ID + API call
- `src/app/favourites.js` — Replace `FAVOURITES` with API call
- `src/app/addresses.js` — Replace `ADDRESSES` with API call
- `src/app/checkout.js` — Replace hard-coded data with API calls + order placement
- `src/app/orders.js` — Replace `MY_ORDERS` with API call
- `src/app/order-detail.js` — Replace `MY_ORDERS` with API call
- `src/app/tracking.js` — Replace hard-coded STEPS with API call
- `src/app/payments.js` — Replace `PAYMENT_METHODS` with API call
- `src/app/review.js` — Replace hard-coded DISHES with API data + submit review
- `src/app/search.js` — Replace mock data with API calls
- `src/app/login.js` — Add API call for login
- `src/app/signup1.js` — Add API call for registration
- `src/app/signup2.js` — Replace `FOOD_PREFS` with API call + save preferences
- `src/app/signup3.js` — Replace hard-coded data with API calls
- `src/app/edit-profile.js` — Add API calls for profile fetch/update
- `src/app/settings.js` — Add JWT logout
- `src/app/order-placed.js` — Display dynamic order number
- `src/app/success.js` — Replace hard-coded name with API call
- `src/app/otp.js` — Add API call for OTP verification
- `src/app/forgot.js` — Add API call for password reset

### Store/Layout:
- `src/store/cartStore.js` — Add server sync methods
- `src/app/_layout.js` — Add auth check (JWT)
- `src/app/tabs/_layout.js` — May need auth-aware cart sync

### New files (to be created):
- `src/services/api.js` — API client with JWT interceptor
- `src/services/auth.js` — Auth utilities (token storage, user management)
- `src/services/cart.js` — Cart API wrapper
- `src/hooks/useAuth.js` — Auth hook
- `src/hooks/useApi.js` — API data fetching hook
- `src/hooks/useCart.js` — Cart hook

### Backend files (to be created in `food/backend/`):
- `package.json`
- `.env`
- `server.js`
- `config/db.js`
- `config/auth.js`
- `middleware/auth.js`
- `middleware/errorHandler.js`
- `routes/auth.js`
- `routes/categories.js`
- `routes/restaurants.js`
- `routes/foods.js`
- `routes/cart.js`
- `routes/favourites.js`
- `routes/addresses.js`
- `routes/orders.js`
- `routes/payments.js`
- `routes/reviews.js`
- `routes/notifications.js`
- `routes/profile.js`
- `controllers/*.js`
- `models/*.js` (or inline queries)

---

## 12. Files That Should NOT Need Modification

### UI Components (no data logic):
- `src/components/savor/Screen.js`
- `src/components/savor/AuthCard.js`
- `src/components/savor/SavorButton.js`
- `src/components/savor/SavorInput.js`
- `src/components/savor/SearchBar.js`
- `src/components/savor/PageHeader.js`
- `src/components/savor/SerifText.js`
- `src/components/savor/SegmentedTabs.js`
- `src/components/savor/ProgressSteps.js`
- `src/components/savor/SavorLogo.js`
- `src/components/savor/SocialAuth.js`
- `src/components/savor/OtpInput.js`
- `src/components/savor/DotIndicator.js`
- `src/components/savor/OnboardingSlide.js`

### Constants/Theme:
- `src/constants/savorTheme.js`
- `src/constants/theme.ts`

### Static screens (no data integration needed):
- `src/app/index.js` (splash)
- `src/app/home.js` (legacy redirect)
- `src/app/onboarding1.js`
- `src/app/onboarding2.js`
- `src/app/onboarding3.js`
- `src/app/privacy.js`
- `src/app/about.js`
- `src/app/help.js`
- `src/app/+not-found.js`

### Data (keep until migration complete):
- `src/data/mockData.js`

### Hooks (may need minor additions):
- `src/hooks/use-savor-fonts.js`
- `src/hooks/use-color-scheme.ts`
- `src/hooks/use-color-scheme.web.ts`
- `src/hooks/use-theme.ts`

---

## 13. Potential Problems/Risks

1. **No emoji column in database** — The frontend uses emoji as the primary visual identifier for every food item and restaurant. The database has no emoji field. Options: (a) Add `emoji` column to `food_items` and `restaurants` (requires ALTER TABLE), (b) Derive from category (lossy — multiple foods in same category get same emoji), (c) Use a mapping table.

2. **No calories column** — `restaurant.js` and `item.js` display calories (680, 320, etc.). The database has no calories field. Requires ALTER TABLE on `food_items`.

3. **No user preferences table** — `signup2.js` collects dietary preference and food preferences, but no table exists to store them. Requires a new `user_preferences` table.

4. **No delivery partner table** — `tracking.js` shows driver name, avatar, and rating. No table exists for delivery partners. Requires a new `delivery_partners` table (or add `delivery_partner_id` to `orders`).

5. **Price format mismatch** — Frontend uses string `"₹320"` with ₹ prefix; database uses `decimal(10,2)`. The API must format prices as `₹{price.toLocaleString('en-IN')}`. This is a transformation, not a schema issue.

6. **Cart is local-only** — `cartStore.js` uses in-memory state with no persistence or server sync. The `cart_items` table exists but is not used by the frontend. Migration requires adding server sync to `cartStore.js` while preserving the event-based subscription pattern.

7. **Order total is hard-coded** — `checkout.js` hard-codes total "₹1,090". The security requirement states prices must be read from `food_items` and calculated on the backend. The `orders` table has `subtotal`, `delivery_fee`, `discount`, `tax`, `total_amount` columns — the backend must calculate these.

8. **No JWT token storage in RN app** — The app has no secure storage for JWT tokens. Need to add `expo-secure-store` or equivalent. All authenticated API calls require the token in the `Authorization` header.

9. **Signup flow doesn't persist data between steps** — `signup1.js` → `signup2.js` → `signup3.js` are separate screens with no shared state. The registration data (name, email, password) from step 1 is not available in step 3. Need to either use a shared store/context or send data incrementally to the backend.

10. **Restaurant tags are hard-coded** — `restaurant.js` hard-codes tags `['Pizza', 'Pasta', 'Risotto']`. The database has `cuisine` as a comma-separated string (e.g., "Pizza, Italian"). The API can split this, but the frontend expects distinct tag labels that may differ from cuisine names.

11. **No loading/error states in components** — All components assume data is immediately available. When migrating to API calls, need to add loading spinners and error handling. This is a UI change that should be minimal to preserve existing styling.

12. **Route params vs. API IDs** — `restaurant.js` → `item.js` passes `{name, price, emoji}` as route params. The migration should pass `food_item_id` instead and fetch full data from the API. Similarly, `orders.js` → `order-detail.js` passes `id` (already an ID, but currently matches mock data, not DB).

13. **Notification navigation logic is hard-coded** — `tabs/alerts.js` uses `n.id === '1'` to determine navigation. After migration, notification IDs will be database IDs (1, 2, 3...) which may not match. The API should return a `action` or `target_route` field, or the logic should be based on `type` instead of `id`.

14. **Order status colors are hard-coded** — `orders.js` uses `statusColor` from mock data. The API must map `order_status` enum values to hex colors. Need a consistent mapping (e.g., delivered → green, cancelled → red, pending → orange).

15. **Payment method display** — `payments.js` expects `{label, detail, icon}`. The database has `payment_method` enum, `provider`, `transaction_id`. The API must map these to display fields. For adding new payment methods, there's no UI form (just an Alert).

16. **No API base URL in RN app** — The app has no configuration for the backend API URL. Need to add a config file (e.g., `src/config/api.js`) with the backend URL. For development, this would be `http://localhost:5000` or similar. For production, it would be a deployed URL.

17. **App runs on device/emulator** — When testing on a physical device or emulator, `localhost` won't work. Need to use the machine's local IP or a tunnel service.

18. **Cart item "shop" field** — The frontend cart items have a `shop` field (restaurant name). The `cart_items` table only has `food_item_id`. The API must JOIN with `food_items` → `restaurants` to get the restaurant name.

19. **Favourites "shop" and "rating" fields** — The frontend favourites have `shop` (restaurant name) and `rating`. The `favourites` table only has `user_id` and `food_item_id`. The API must JOIN with `food_items` → `restaurants` to get these fields.

20. **Order "emoji" field** — The frontend orders have an `emoji` field. The `orders` table doesn't have emoji. The API must derive it from the restaurant or food items.

---

## 14. Recommended Implementation Order

### Phase 0: Backend Foundation (no frontend changes)
1. Create `food/backend/` directory structure
2. Set up `package.json`, `.env`, `server.js`
3. Create database connection (`config/db.js`)
4. Create auth middleware (`middleware/auth.js`)
5. Implement `POST /api/auth/login` — validate against `users` table with bcrypt, return JWT
6. Test login with existing user (Rahul Sharma, rahul@example.com)
7. Implement `GET /api/profile` — return user data from JWT

### Phase 1: Read-Only Data (no frontend changes, mockData still used)
1. Implement `GET /api/categories` — return all active categories
2. Implement `GET /api/restaurants` — return all active restaurants with transformation
3. Implement `GET /api/restaurants/:id` — return restaurant detail
4. Implement `GET /api/restaurants/:id/foods` — return food items for restaurant
5. Implement `GET /api/foods/popular` — return popular food items
6. Implement `GET /api/foods/:id` — return food item detail
7. Implement `GET /api/orders` — return user's orders
8. Implement `GET /api/orders/:id` — return order details
9. Implement `GET /api/addresses` — return user's addresses
10. Implement `GET /api/notifications` — return user's notifications
11. Implement `GET /api/favourites` — return user's favourites
12. Implement `GET /api/payments` — return user's payment methods

### Phase 2: Authentication Integration
1. Add `expo-secure-store` to RN app for JWT storage
2. Create `src/services/api.js` — API client with JWT interceptor
3. Create `src/services/auth.js` — auth utilities
4. Modify `src/app/login.js` — call `POST /api/auth/login`, store JWT, navigate to `/tabs/home`
5. Modify `src/app/_layout.js` — check for JWT on app start, redirect to `/login` if not present
6. Modify `src/app/settings.js` — logout clears JWT, navigates to `/login`
7. Modify `src/app/forgot.js` — call `POST /api/auth/forgot-password`
8. Modify `src/app/otp.js` — call `POST /api/auth/verify-otp`
9. Modify `src/app/signup1.js` — call `POST /api/auth/register`
10. Modify `src/app/signup2.js` — replace `FOOD_PREFS` with `GET /api/categories`, call `POST /api/auth/register/preferences`
11. Modify `src/app/signup3.js` — call `POST /api/addresses`
12. Modify `src/app/edit-profile.js` — call `GET /api/profile` and `PATCH /api/profile`

### Phase 3: Cart Integration
1. Implement `GET /api/cart` — return user's cart items (JOIN food_items + restaurants)
2. Implement `POST /api/cart` — add item to cart
3. Implement `PATCH /api/cart/:id` — update quantity
4. Implement `DELETE /api/cart/:id` — remove item
5. Modify `src/store/cartStore.js` — add server sync methods (keep event-based pattern)
6. Modify `src/app/tabs/cart.js` — fetch from server, sync updates
7. Modify `src/app/item.js` — call `POST /api/cart` on "Add to Cart"

### Phase 4: Order Integration
1. Implement `POST /api/orders` — transaction: read prices from food_items, insert orders + order_items + payments + order_tracking, clear cart
2. Implement `GET /api/orders/:id/tracking` — return order tracking history
3. Implement `POST /api/reviews` — submit review
4. Modify `src/app/checkout.js` — fetch default address + payment methods, call `POST /api/orders`
5. Modify `src/app/order-placed.js` — display dynamic order number
6. Modify `src/app/tracking.js` — call `GET /api/orders/:id/tracking`
7. Modify `src/app/review.js` — call `POST /api/reviews`

### Phase 5: Remaining Screens
1. Modify `src/app/tabs/home.js` — replace `CATEGORIES`/`POPULAR_DISHES` with API calls
2. Modify `src/app/tabs/explore.js` — replace `RESTAURANTS` with API call
3. Modify `src/app/tabs/profile.js` — replace hard-coded user with `GET /api/profile`
4. Modify `src/app/tabs/alerts.js` — replace `NOTIFICATIONS` with API call
5. Modify `src/app/restaurant.js` — replace `MENU_ITEMS` with API call
6. Modify `src/app/favourites.js` — replace `FAVOURITES` with API call
7. Modify `src/app/addresses.js` — replace `ADDRESSES` with API call
8. Modify `src/app/orders.js` — replace `MY_ORDERS` with API call
9. Modify `src/app/order-detail.js` — replace `MY_ORDERS` with API call
10. Modify `src/app/payments.js` — replace `PAYMENT_METHODS` with API call
11. Modify `src/app/search.js` — replace mock data with API calls
12. Modify `src/app/success.js` — replace hard-coded name with API call

### Phase 6: Database Schema Changes (after approval)
1. Add `emoji` column to `food_items` and `restaurants`
2. Add `calories` column to `food_items`
3. Add `bg_color` column to `food_items` (optional)
4. Create `user_preferences` table
5. Create `delivery_partners` table (optional)
6. Add `tags` column to `restaurants` (optional)

### Phase 7: Cleanup
1. Remove `mockData.js` imports from all screens
2. Delete `mockData.js` (or keep as fallback)
3. Add loading/error states to all screens
4. Add API base URL configuration
5. Test all flows end-to-end

---

## Summary

The existing React Native Expo app is a fully functional mock application with 25+ screens, all using static data from `mockData.js` or hard-coded inline values. The database (`food_db`) has 13 tables with 6 categories, 5 restaurants, 10 food items, 5 users, and sample data for all other tables.

**Key findings:**
- 12 mock data exports in `mockData.js` used across 20+ screens
- 13 hard-coded inline data sources across 15 screens
- 3 screens receive route params (`item.js`, `order-detail.js`, `search.js`)
- `cartStore.js` is a simple event-based in-memory store with no server sync
- 4 database fields are missing (emoji, calories, bg_color, tags)
- 2 new tables are needed (user_preferences, delivery_partners)
- 33 API endpoints are required to fully replace all mock data
- The backend must live in `food/backend/` (does not exist yet)
- JWT authentication is required but no token storage exists in the RN app
- Order creation must use database transactions and read prices from `food_items`
- The API layer must transform DB rows into the exact object shapes expected by existing components

**No code has been modified. No database tables have been changed. No backend has been created.**
