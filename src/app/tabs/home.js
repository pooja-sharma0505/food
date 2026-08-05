import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/savor/Screen';
import { SearchBar } from '../../components/savor/SearchBar';
import { SansText, SerifText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { showAlert } from '../../services/alertHelper';
import { fetchCategories, fetchRestaurants } from '../../services/api';

const CATEGORY_EMOJI = {
  pizza: '🍕',
  burger: '🍔',
  indian: '🍛',
  chinese: '🥢',
  sushi: '🍣',
  dessert: '🍰',
  drinks: '🥤',
  salad: '🥗',
  mexican: '🌮',
  thai: '🌶️',
};

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [catData, restData] = await Promise.all([fetchCategories(), fetchRestaurants()]);
        setCategories(catData);
        setRestaurants(restData);
      } catch (err) {
        console.error('Failed to load home data:', err.message);
        showAlert('Error', err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get trending restaurants (top rated)
  const trending = restaurants
    .filter((r) => r.is_open)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Get featured restaurants
  const featured = restaurants
    .filter((r) => r.delivery_fee === 0 || r.delivery_fee === '0')
    .slice(0, 3);

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <View style={styles.header}>
        <SerifText size={32}>Savor</SerifText>
        <TouchableOpacity onPress={() => router.push('/tabs/profile')}>
          <View style={styles.avatar}>
            <SansText size={16} weight="bold" color="#fff">U</SansText>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={1} onPress={() => router.push('/search')}>
        <SearchBar
          placeholder="Search dishes, cuisines..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {/* Categories */}
      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.section}>
        Categories
      </SansText>
      {loading ? (
        <ActivityIndicator size="small" color={SavorColors.orange} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/tabs/explore', params: { category: cat.slug } })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: SavorColors.orangeSoft }]}>
                <SansText size={28}>{CATEGORY_EMOJI[cat.slug] || '🍽️'}</SansText>
              </View>
              <SansText size={13} color={SavorColors.text} weight="medium">
                {cat.name}
              </SansText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Trending */}
      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.section}>
        Trending now
      </SansText>
      {loading ? (
        <ActivityIndicator size="small" color={SavorColors.orange} />
      ) : (
        trending.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.restaurantCard}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(r.id) } })}
            activeOpacity={0.9}
          >
            <View style={[styles.restThumb, { backgroundColor: SavorColors.orangeLight }]}>
              <SansText size={32}>{CATEGORY_EMOJI[r.cuisine?.split(',')[0]?.trim().toLowerCase()] || '🍽️'}</SansText>
            </View>
            <View style={styles.restInfo}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{r.name}</SansText>
              <SansText size={13} color={SavorColors.textMuted}>
                ⭐ {r.rating} · {r.delivery_time_min}-{r.delivery_time_max} min
              </SansText>
              <View style={styles.restTags}>
                {(r.cuisine || '').split(',').slice(0, 2).map((c) => (
                  <View key={c.trim()} style={styles.tag}>
                    <SansText size={11} color={SavorColors.orange}>{c.trim()}</SansText>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Featured */}
      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.section}>
        Free delivery
      </SansText>
      {loading ? (
        <ActivityIndicator size="small" color={SavorColors.orange} />
      ) : (
        featured.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.restaurantCard}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(r.id) } })}
            activeOpacity={0.9}
          >
            <View style={[styles.restThumb, { backgroundColor: SavorColors.orangeLight }]}>
              <SansText size={32}>{CATEGORY_EMOJI[r.cuisine?.split(',')[0]?.trim().toLowerCase()] || '🍽️'}</SansText>
            </View>
            <View style={styles.restInfo}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{r.name}</SansText>
              <SansText size={13} color={SavorColors.textMuted}>
                ⭐ {r.rating} · {r.delivery_time_min}-{r.delivery_time_max} min
              </SansText>
              <View style={styles.restTags}>
                {(r.cuisine || '').split(',').slice(0, 2).map((c) => (
                  <View key={c.trim()} style={styles.tag}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: { marginBottom: 20 },
  section: { marginBottom: 12 },
  categories: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    ...SavorShadow.card,
  },
  restThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  restInfo: { flex: 1, gap: 4 },
  restTags: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
});
