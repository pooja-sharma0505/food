import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchFoods, fetchRestaurants } from '../services/api';

export default function Restaurant() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Map API food objects to the format the UI expects
  const displayItems = menuItems.map((item) => ({
    id: String(item.id),
    name: item.name,
    price: `Rs ${item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}`,
    emoji: item.category_icon || '🍽️',
    calories: item.preparation_time,
  }));

  const restName = restaurant?.name || 'Restaurant';
  const restRating = restaurant?.rating || '4.8';
  const restTime = restaurant
    ? `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min`
    : '20-30 min';
  const restCuisine = restaurant?.cuisine || 'Italian';

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Restaurant" />
      <View style={styles.hero}>
        <SansText size={72}>🍕</SansText>
      </View>

      <SerifText size={28}>{restName}</SerifText>
      <SansText size={14} style={styles.meta}>⭐ {restRating} · {restTime} · {restCuisine}</SansText>

      <View style={styles.tags}>
        {(restCuisine || 'Italian').split(',').map((t) => (
          <View key={t.trim()} style={styles.tag}>
            <SansText size={12} color={SavorColors.orange} weight="medium">{t.trim()}</SansText>
          </View>
        ))}
      </View>

      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.menuHead}>
        Menu
      </SansText>

      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 20 }} />
      ) : (
        displayItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() =>
              router.push({ pathname: '/item', params: { name: item.name, price: item.price, emoji: item.emoji } })
            }
            activeOpacity={0.9}
          >
            <View style={styles.thumb}>
              <SansText size={28}>{item.emoji}</SansText>
            </View>
            <View style={styles.menuInfo}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{item.name}</SansText>
              <SansText size={14} color={SavorColors.orange} weight="semi">{item.price}</SansText>
            </View>
            <SansText size={20} color={SavorColors.textLight}>›</SansText>
          </TouchableOpacity>
        ))
      )}
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
  tags: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tag: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SavorRadius.pill,
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
});
