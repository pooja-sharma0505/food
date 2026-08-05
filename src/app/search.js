import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchFoods, fetchRestaurants } from '../services/api';

const CATEGORY_BG = {
  pizza: '#FFE8DC',
  burger: '#FFF3E0',
  indian: '#E8F5E9',
  chinese: '#E3F2FD',
  desserts: '#FCE4EC',
  drinks: '#E0F7FA',
};

// Recent searches - in a real app this would be persisted
const RECENT_SEARCHES = ['Pizza', 'Burger', 'Indian', 'Chinese'];

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(params.q?.toString() ?? '');
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showRecent, setShowRecent] = useState(true);
  const debounceRef = useRef(null);

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

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowRecent(true);
      return;
    }

    setShowRecent(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const dishResults = foods
        .filter((d) => d.name.toLowerCase().includes(lowerQuery) || d.category_slug?.toLowerCase().includes(lowerQuery))
        .map((f) => ({
          id: String(f.id),
          type: 'dish',
          name: f.name,
          restaurant: f.restaurant_name,
          price: `₹${f.discount_price && f.discount_price > 0 ? f.discount_price : f.price}`,
          emoji: f.category_icon || '🍽️',
          bg: CATEGORY_BG[f.category_slug] || '#F5F5F5',
        }));

      const restResults = restaurants
        .filter((r) => r.name.toLowerCase().includes(lowerQuery) || r.cuisine?.toLowerCase().includes(lowerQuery))
        .map((r) => ({
          id: String(r.id),
          type: 'restaurant',
          name: r.name,
          rating: r.rating,
          time: `${r.delivery_time_min}-${r.delivery_time_max} min`,
          emoji: '🍽️',
        }));

      setSearchResults([...dishResults, ...restResults]);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, foods, restaurants]);

  const handleRecentSearch = (term) => {
    setQuery(term);
  };

  const handleRemoveRecent = (term) => {
    // In a real app, this would remove from persisted storage
    // For now, we just filter it out visually
    setShowRecent(false);
  };

  const handleClearAll = () => {
    setShowRecent(false);
  };

  const displayDishes = searchResults.filter((r) => r.type === 'dish');
  const displayRestaurants = searchResults.filter((r) => r.type === 'restaurant');

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Search" />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={SavorColors.textMuted} />
        <TextInput
          placeholder="Search dishes, cuisines..."
          placeholderTextColor={SavorColors.textLight}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          autoFocus
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={SavorColors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Recent Searches */}
      {showRecent && query.length === 0 ? (
        <>
          <View style={styles.recentHeader}>
            <SansText size={14} weight="medium" color={SavorColors.text}>Recent searches</SansText>
            <TouchableOpacity onPress={handleClearAll}>
              <SansText size={13} color={SavorColors.textMuted}>Clear all</SansText>
            </TouchableOpacity>
          </View>
          <View style={styles.recentChips}>
            {RECENT_SEARCHES.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.recentChip}
                onPress={() => handleRecentSearch(term)}
              >
                <SansText size={13} color={SavorColors.text}>{term}</SansText>
                <TouchableOpacity
                  onPress={() => handleRemoveRecent(term)}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={16} color={SavorColors.textLight} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}

      {/* Live Results */}
      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      ) : (
        <>
          {query.length > 0 && searchResults.length === 0 ? (
            <View style={styles.empty}>
              <SansText size={15} color={SavorColors.textMuted}>
                No results for "{query}"
              </SansText>
              <SansText size={13} color={SavorColors.textLight} style={styles.emptySub}>
                Try browsing categories instead
              </SansText>
              <TouchableOpacity
                style={styles.browseLink}
                onPress={() => router.push('/tabs/explore')}
              >
                <SansText size={14} color={SavorColors.orange} weight="semi">
                  Browse categories →
                </SansText>
              </TouchableOpacity>
            </View>
          ) : null}

          {displayDishes.length > 0 ? (
            <>
              <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
                Dishes
              </SansText>
              {displayDishes.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={styles.row}
                  onPress={() => router.push({ pathname: '/restaurant', params: { id: d.id } })}
                >
                  <View style={[styles.dishThumb, { backgroundColor: d.bg }]}>
                    <SansText size={24}>{d.emoji}</SansText>
                  </View>
                  <View style={styles.info}>
                    <SansText size={15} weight="semi" color={SavorColors.text}>{d.name}</SansText>
                    <SansText size={13} color={SavorColors.textMuted}>{d.restaurant} · {d.price}</SansText>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : null}

          {displayRestaurants.length > 0 ? (
            <>
              <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
                Restaurants
              </SansText>
              {displayRestaurants.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.row}
                  onPress={() => router.push({ pathname: '/restaurant', params: { id: r.id } })}
                >
                  <View style={styles.restThumb}>
                    <SansText size={24}>{r.emoji}</SansText>
                  </View>
                  <View style={styles.info}>
                    <SansText size={15} weight="semi" color={SavorColors.text}>{r.name}</SansText>
                    <SansText size={13} color={SavorColors.textMuted}>⭐ {r.rating} · {r.time}</SansText>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: SavorColors.text,
    padding: 0,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...SavorShadow.card,
  },
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
  dishThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, gap: 2 },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptySub: { textAlign: 'center', marginTop: 4 },
  browseLink: {
    marginTop: 12,
  },
});
