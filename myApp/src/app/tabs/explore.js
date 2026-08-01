import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SearchBar } from '../../components/savor/SearchBar';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { fetchRestaurants } from '../../services/api';
import { showAlert } from '../../services/alertHelper';

const FILTERS = ['All', 'Italian', 'Indian', 'Chinese'];

// Map cuisine keywords to emoji for display
const CUISINE_EMOJI = {
  pizza: '🍕',
  italian: '🍝',
  indian: '🍛',
  burger: '🍔',
  noodles: '🍜',
  sushi: '🍣',
  chinese: '🥢',
  salad: '🥗',
  mexican: '🌮',
  thai: '🌶️',
};

function getCuisineEmoji(cuisine) {
  if (!cuisine) return '🍽️';
  const lower = cuisine.toLowerCase();
  for (const [key, emoji] of Object.entries(CUISINE_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return '🍽️';
}

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err.message);
        showAlert('Error', err.message || 'Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'All'
    ? restaurants
    : restaurants.filter((r) =>
        r.cuisine && r.cuisine.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Explore</SerifText>
      <TouchableOpacity activeOpacity={1} onPress={() => router.push('/search')}>
        <SearchBar
          placeholder="Search restaurants..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <SansText size={14} color={active ? '#fff' : SavorColors.text} weight={active ? 'semi' : 'regular'}>
                {f}
              </SansText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      ) : (
        filtered.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(r.id) } })}
            activeOpacity={0.9}
          >
            <View style={styles.thumb}>
              <SansText size={32}>{getCuisineEmoji(r.cuisine)}</SansText>
            </View>
            <View style={styles.info}>
              <SansText size={17} weight="semi" color={SavorColors.text}>{r.name}</SansText>
              <SansText size={13}>
                ⭐ {r.rating} · {r.delivery_time_min}-{r.delivery_time_max} min · {r.delivery_fee > 0 ? `₹${r.delivery_fee}` : 'Free delivery'}
              </SansText>
              <View style={styles.tagRow}>
                {(r.cuisine || '').split(',').map((c) => c.trim()).filter(Boolean).map((c) => (
                  <View key={c} style={styles.tag}>
                    <SansText size={11} color={SavorColors.orange}>{c.trim()}</SansText>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  title: { marginBottom: 16 },
  search: { marginBottom: 16 },
  filters: { marginBottom: 16, marginHorizontal: -20, paddingHorizontal: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
    marginRight: 8,
    backgroundColor: SavorColors.card,
  },
  chipActive: { backgroundColor: SavorColors.orange, borderColor: SavorColors.orange },
  card: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 12,
    ...SavorShadow.card,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: SavorRadius.md,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
});
