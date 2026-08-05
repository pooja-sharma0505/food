import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { Screen } from '../components/savor/Screen';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchCart, fetchFoods, fetchRestaurants } from '../services/api';

export default function Restaurant() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch restaurant details (if id provided) and its food items
  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const rests = await fetchRestaurants();
          const rest = rests.find((r) => String(r.id) === String(id) || r.slug === id);
          if (rest) setRestaurant(rest);
        }

        const foods = await fetchFoods(id ? { restaurant: id } : {});
        setMenuItems(foods);
      } catch (err) {
        console.error('Failed to fetch restaurant/foods:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Load cart count
  const loadCart = useCallback(() => {
    (async () => {
      try {
        const cart = await fetchCart();
        setCartItemCount(cart.items?.length || 0);
        setCartTotal(cart.total || 0);
      } catch (err) {
        // Silently fail
      }
    })();
  }, []);

  useFocusEffect(loadCart);

  // Map API food objects to the format the UI expects
  const displayItems = menuItems.map((item) => ({
    id: String(item.id),
    name: item.name,
    price: `Rs ${item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}`,
    emoji: item.category_icon || '🍽️',
    calories: item.preparation_time,
    isVeg: item.is_veg,
    isAvailable: item.is_available,
  }));

  // Group items by category
  const categories = ['All', 'Popular', ...new Set(displayItems.map((i) => i.category || 'Other'))];
  const [activeCategory, setActiveCategory] = useState('All');

  const restName = restaurant?.name || 'Restaurant';
  const restRating = restaurant?.rating || '4.8';
  const restTime = restaurant
    ? `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min`
    : '20-30 min';
  const restCuisine = restaurant?.cuisine || 'Italian';
  const isClosed = !restaurant?.is_open;

  // Header height for sticky effect
  const headerHeight = 180;
  const stickyTop = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });

  const filteredItems = activeCategory === 'All'
    ? displayItems
    : displayItems.filter((item) => item.category === activeCategory || activeCategory === 'Popular');

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Restaurant" />

      {/* Cover block */}
      <Animated.View style={[styles.hero, { transform: [{ translateY: stickyTop }] }]}>
        <SansText size={72}>{restaurant?.cuisine ? '🍽️' : '🍕'}</SansText>
      </Animated.View>

      <SerifText size={28}>{restName}</SerifText>
      <SansText size={14} style={styles.meta}>⭐ {restRating} · {restTime} · {restCuisine}</SansText>

      {isClosed ? (
        <View style={styles.closedBanner}>
          <SansText size={13} color={SavorColors.white} weight="semi">Currently closed</SansText>
        </View>
      ) : null}

      <View style={styles.tags}>
        {(restCuisine || 'Italian').split(',').map((t) => (
          <View key={t.trim()} style={styles.tag}>
            <SansText size={12} color={SavorColors.orange} weight="medium">{t.trim()}</SansText>
          </View>
        ))}
      </View>

      {/* Sticky Category Tabs */}
      <View style={styles.categoryTabs}>
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryTab, active && styles.categoryTabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <SansText size={14} color={active ? SavorColors.orange : SavorColors.textMuted} weight={active ? 'semi' : 'regular'}>
                {cat}
              </SansText>
            </TouchableOpacity>
          );
        })}
      </View>

      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.menuHead}>
        Menu
      </SansText>

      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 20 }} />
      ) : filteredItems.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={15} color={SavorColors.textMuted}>No items in this category.</SansText>
        </View>
      ) : (
        filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuCard, !item.isAvailable && styles.menuCardDisabled]}
            onPress={() =>
              router.push({ pathname: '/item', params: { name: item.name, price: item.price, emoji: item.emoji, foodItemId: item.id } })
            }
            activeOpacity={0.9}
            disabled={!item.isAvailable}
          >
            <View style={styles.thumb}>
              <SansText size={28}>{item.emoji}</SansText>
            </View>
            <View style={styles.menuInfo}>
              <View style={styles.menuTop}>
                <SansText size={16} weight="semi" color={SavorColors.text}>{item.name}</SansText>
                {item.isVeg ? (
                  <View style={styles.vegBadge}>
                    <View style={styles.vegDot} />
                    <SansText size={10} color={SavorColors.successText} weight="bold">VEG</SansText>
                  </View>
                ) : (
                  <View style={styles.vegBadge}>
                    <View style={[styles.vegDot, styles.nonVegDot]} />
                    <SansText size={10} color={SavorColors.orange} weight="bold">NON-VEG</SansText>
                  </View>
                )}
              </View>
              <SansText size={14} color={SavorColors.orange} weight="semi">{item.price}</SansText>
            </View>
            <SansText size={20} color={SavorColors.textLight}>›</SansText>
          </TouchableOpacity>
        ))
      )}

      {/* Floating Cart Summary Pill */}
      {cartItemCount > 0 ? (
        <TouchableOpacity
          style={styles.cartPill}
          onPress={() => router.push('/tabs/cart')}
          activeOpacity={0.8}
        >
          <View style={styles.cartPillInner}>
            <SansText size={14} color={SavorColors.white} weight="semi">
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''} · Rs {cartTotal.toLocaleString('en-IN')}
            </SansText>
          </View>
          <View style={styles.cartPillArrow}>
            <SansText size={16} color={SavorColors.white}>›</SansText>
          </View>
        </TouchableOpacity>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 32 },
  hero: {
    height: 180,
    backgroundColor: SavorColors.orangeLight,
    borderRadius: SavorRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  meta: { marginTop: 6, marginBottom: 14 },
  closedBanner: {
    backgroundColor: SavorColors.orange,
    borderRadius: SavorRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tags: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tag: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SavorRadius.pill,
  },
  categoryTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
    backgroundColor: SavorColors.card,
  },
  categoryTabActive: {
    backgroundColor: SavorColors.orangeSoft,
    borderColor: SavorColors.orange,
  },
  menuHead: { marginBottom: 12 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 10,
    ...SavorShadow.card,
  },
  menuCardDisabled: { opacity: 0.4 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuInfo: { flex: 1, gap: 4 },
  menuTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SavorColors.successText,
  },
  nonVegDot: {
    backgroundColor: SavorColors.orange,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  // Floating Cart Pill
  cartPill: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: SavorColors.orange,
    borderRadius: SavorRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SavorShadow.tab,
  },
  cartPillInner: {
    flex: 1,
  },
  cartPillArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
