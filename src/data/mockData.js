export const CATEGORIES = [
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'noodles', label: 'Noodles', icon: '🍜' },
  { id: 'burger', label: 'Burger', icon: '🍔' },
  { id: 'indian', label: 'Indian', icon: '🍛' },
];

export const POPULAR_DISHES = [
  {
    id: '1',
    name: 'Margherita Pizza',
    restaurant: 'Bella Italia',
    price: '₹320',
    rating: 4.8,
    emoji: '🍕',
    bg: '#FFE8DC',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    restaurant: 'Green Bowl',
    price: '₹210',
    rating: 4.6,
    emoji: '🥗',
    bg: '#E8F5E9',
  },
  {
    id: '3',
    name: 'Paneer Tikka',
    restaurant: 'Spice Garden',
    price: '₹280',
    rating: 4.7,
    emoji: '🍛',
    bg: '#FFF3E0',
  },
];

export const RESTAURANTS = [
  {
    id: 'bella',
    name: 'Bella Italia',
    rating: 4.8,
    time: '20–30 min',
    fee: '₹40',
    cuisines: ['Pizza', 'Pasta'],
    emoji: '🍕',
    tags: ['Italian'],
  },
  {
    id: 'spice',
    name: 'Spice Garden',
    rating: 4.7,
    time: '25–35 min',
    fee: 'Free delivery',
    cuisines: ['Indian', 'Biryani'],
    emoji: '🍛',
    tags: ['Indian'],
  },
  {
    id: 'sushi',
    name: 'Tokyo Bites',
    rating: 4.9,
    time: '30–40 min',
    fee: '₹30',
    cuisines: ['Sushi', 'Ramen'],
    emoji: '🍣',
    tags: ['Japanese'],
  },
];

export const MENU_ITEMS = [
  { id: '1', name: 'Margherita Pizza', price: '₹320', emoji: '🍕', calories: 680 },
  { id: '2', name: 'Caesar Salad', price: '₹210', emoji: '🥗', calories: 320 },
  { id: '3', name: 'Mango Lassi', price: '₹120', emoji: '🥤', calories: 180 },
  { id: '4', name: 'Pasta Alfredo', price: '₹380', emoji: '🍝', calories: 720 },
];

export const CART_ITEMS = [
  { id: '1', name: 'Margherita Pizza', shop: 'Bella Italia', price: 320, emoji: '🍕', qty: 1 },
  { id: '2', name: 'Caesar Salad', shop: 'Bella Italia', price: 210, emoji: '🥗', qty: 1 },
  { id: '3', name: 'Mango Lassi', shop: 'Bella Italia', price: 120, emoji: '🥤', qty: 1 },
];

export const NOTIFICATIONS = [
  {
    id: '1',
    icon: '🛵',
    title: 'Order out for delivery',
    body: 'Ravi is on the way with your Bella Italia order.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    icon: '🎉',
    title: 'Exclusive offer unlocked',
    body: '50% off your next order — code SAVOR50.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: '3',
    icon: '✅',
    title: 'Order delivered',
    body: 'How was your meal? Tap to rate your order.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    icon: '🍕',
    title: 'Bella Italia is trending',
    body: 'Popular near you — free delivery today.',
    time: '2 days ago',
    unread: false,
  },
];

export const FOOD_PREFS = [
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'noodles', label: 'Noodles', icon: '🍜' },
  { id: 'indian', label: 'Indian', icon: '🍛' },
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'sushi', label: 'Sushi', icon: '🍣' },
];

export const DIET_TAGS = ['Vegetarian', 'Vegan', 'Non-veg'];

export const MY_ORDERS = [
  {
    id: 'ORD-8820',
    restaurant: 'Bella Italia',
    emoji: '🍕',
    items: 'Margherita Pizza, Caesar Salad +1',
    total: '₹1,090',
    status: 'Delivered',
    statusColor: '#2E7D32',
    date: 'Today, 7:45 PM',
  },
  {
    id: 'ORD-8812',
    restaurant: 'Spice Garden',
    emoji: '🍛',
    items: 'Paneer Tikka, Garlic Naan',
    total: '₹540',
    status: 'Delivered',
    statusColor: '#2E7D32',
    date: '28 May, 8:20 PM',
  },
  {
    id: 'ORD-8801',
    restaurant: 'Tokyo Bites',
    emoji: '🍣',
    items: 'Salmon Roll, Miso Soup',
    total: '₹890',
    status: 'Cancelled',
    statusColor: '#C62828',
    date: '25 May, 1:15 PM',
  },
];

export const FAVOURITES = [
  { id: '1', name: 'Margherita Pizza', shop: 'Bella Italia', price: '₹320', emoji: '🍕', rating: 4.8 },
  { id: '2', name: 'Paneer Tikka', shop: 'Spice Garden', price: '₹280', emoji: '🍛', rating: 4.7 },
  { id: '3', name: 'Dragon Roll', shop: 'Tokyo Bites', price: '₹450', emoji: '🍣', rating: 4.9 },
];

export const ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    line1: '42, Sunrise Apartments',
    line2: 'Subhash Nagar, Jaipur',
    pin: '302016',
    default: true,
  },
  {
    id: 'work',
    label: 'Work',
    icon: 'briefcase',
    line1: 'Welfog IT Solutions',
    line2: 'Malviya Nagar, Jaipur',
    pin: '302017',
    default: false,
  },
];

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / PhonePe', detail: 'rahul@ybl', icon: 'phone-portrait-outline', default: true },
  { id: 'card', label: 'HDFC Debit Card', detail: '•••• 4242', icon: 'card-outline', default: false },
  { id: 'cod', label: 'Cash on Delivery', detail: 'Pay when order arrives', icon: 'cash-outline', default: false },
];
