import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SearchBar } from '../components/savor/SearchBar';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchFoods, fetchRestaurants } from '../services/api';
import { showAlert } from '../services/alertHelper';

const CATEGORY_BG = {
  pizza: '#FFE8DC',
  burger: '#FFF3E0',
  indian: '#E8F5E9',
  chinese: '#E3F2FD',
  desserts: '#FCE4EC',
  drinks: '#E0F7FA',
};

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(params.q?.toString() ?? '');
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [foodData, restData] = await Promise.all([fetchFoods(), fetchRestaurants()]);
        setFoods(foodData);
        setRestaurants(restData);
      } catch (err) {
        console.error('Failed to fetch search data:', err.message);
        showAlert('Error', err.message || 'Failed to load search data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dishes = foods.filter(
    (d) => !query || d.name.toLowerCase().includes(query.toLowerCase()),
  );
  const restList = restaurants.filter(
    (r) => !query || r.name.toLowerCase().includes(query.toLowerCase()),
  );

  // Map API food objects to the format the UI expects
  const displayDishes = dishes.map((f) => ({
    id: String(f.id),
    name: f.name,
    restaurant: f.restaurant_name,
    price: `₹${f.discount_price && f.discount_price > 0 ? f.discount_price : f.price}`,
    emoji: f.category_icon || '🍽️',
    bg: CATEGORY_BG[f.category_slug] || '#F5F5F5',
    category: f.category_slug,
  }));

  // Map API restaurant objects to the format the UI expects
  const displayRestaurants = restList.map((r) => ({
    id: String(r.id),
    name: r.name,
    rating: r.rating,
    time: `${r.delivery_time_min}-${r.delivery_time_max} min`,
    emoji: '🍽️',
  }));

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Search" />

      <SearchBar
        placeholder="Search dishes, cuisines..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Dishes
      </SansText>
      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 20 }} />
      ) : (
        displayDishes.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={styles.row}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(d.id) } })}
          >
            <SansText size={24}>{d.emoji}</SansText>
            <View style={styles.info}>
              <SansText size={15} weight="semi" color={SavorColors.text}>{d.name}</SansText>
              <SansText size={13}>{d.restaurant} · {d.price}</SansText>
            </View>
          </TouchableOpacity>
        ))
      )}

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Restaurants
      </SansText>
      {loading ? null : (
        displayRestaurants.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.row}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(r.id) } })}
          >
            <SansText size={24}>{r.emoji}</SansText>
            <View style={styles.info}>
              <SansText size={15} weight="semi" color={SavorColors.text}>{r.name}</SansText>
              <SansText size={13}>⭐ {r.rating} · {r.time}</SansText>
            </View>
          </TouchableOpacity>
        ))
      )}

      {!loading && displayDishes.length === 0 && displayRestaurants.length === 0 ? (
        <SansText size={14} style={styles.empty}>No results for "{query}"</SansText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  search: { marginBottom: 20 },
  section: { marginBottom: 10, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: SavorColors.card,
    padding: 14,
    borderRadius: SavorRadius.lg,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  info: { flex: 1, gap: 2 },
  empty: { textAlign: 'center', marginTop: 40 },
});
