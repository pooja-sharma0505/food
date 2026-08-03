/**
 * Mock data — Favourites
 * Mirrors the shape returned by GET /api/favourites
 * These are food items that the dummy user has favourited.
 */
import { foods } from './foods';

// Select a few food items as favourites (ids 1, 7, 13)
const favouriteFoodIds = [1, 7, 13];

export const favourites = favouriteFoodIds
  .map((foodId) => {
    const food = foods.find((f) => f.id === foodId);
    if (!food) return null;
    return {
      id: food.id,
      user_id: 1,
      food_item_id: food.id,
      created_at: '2025-03-01T10:00:00.000Z',
      food_name: food.name,
      price: food.price,
      discount_price: food.discount_price,
      image: food.image,
      rating: food.rating,
      restaurant_name: food.restaurant_name,
      category_icon: food.category_icon,
    };
  })
  .filter(Boolean);
