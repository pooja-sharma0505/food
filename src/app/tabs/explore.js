import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SavorButton } from '../../components/savor/SavorButton';
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

const SORT_OPTIONS = [
  { label: 'Rating', value: 'rating' },
  { label: 'Delivery time', value: 'delivery_time' },
  { label: 'Distance', value: 'distance' },
];

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('rating');
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [restData, catData] = await Promise.all([fetchRestaurants(), fetchCategories()]);
        setRestaurants(restData);
        setCategories(catData);
      } catch (err) {
        console.error('Failed to fetch explore data:', err.message);
        showAlert('Error', err.message || 'Failed to load data');
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

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'delivery_time') return a.delivery_time_min - b.delivery_time_min;
    return 0; // distance - not available in mock data
  });

  const handleSortSelect = (value) => {
    setSort(value);
    setSortSheetVisible(false);
  };

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

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryPill, filter === cat.name && styles.categoryPillActive]}
            onPress={() => setFilter(cat.name)}
          >
            <SansText size={14} color={filter === cat.name ? '#fff' : SavorColors.text} weight={filter === cat.name ? 'semi' : 'regular'}>
              {CATEGORY_EMOJI[cat.slug] || '🍽️'} {cat.name}
            </SansText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Button */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortSheetVisible(true)}
          activeOpacity={0.8}
        >
          <SansText size={13} color={SavorColors.textMuted} weight="medium">
            Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label || 'Rating'}
          </SansText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      ) : sorted.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>🔍</SansText>
          <SansText size={15} style={styles.emptyText}>No restaurants match your filters.</SansText>
          <SavorButton label="Clear filter" onPress={() => { setFilter('All'); setSort('rating'); }} variant="ghost" />
        </View>
      ) : (
        sorted.map((r) => {
          const isClosed = !r.is_open;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.card, isClosed && styles.cardClosed]}
              onPress={() => {
                if (isClosed) {
                  showAlert('Currently Closed', `${r.name} is not accepting orders right now.`);
                  return;
                }
                router.push({ pathname: '/restaurant', params: { id: String(r.id) } });
              }}
              activeOpacity={0.9}
              disabled={isClosed}
            >
              <View style={[styles.thumb, { backgroundColor: SavorColors.orangeSoft }]}>
                <SansText size={32}>{CATEGORY_EMOJI[r.cuisine?.split(',')[0]?.trim().toLowerCase()] || '🍽️'}</SansText>
                {!isClosed ? null : (
                  <View style={styles.closedBadge}>
                    <SansText size={10} color={SavorColors.white} weight="bold">
                      CLOSED
                    </SansText>
                  </View>
                )}
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
          );
        })
      )}

      {/* Sort Bottom Sheet */}
      <Modal
        visible={sortSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SansText size={16} weight="semi" color={SavorColors.text} style={styles.modalTitle}>
              Sort by
            </SansText>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.modalOption, sort === opt.value && styles.modalOptionActive]}
                onPress={() => handleSortSelect(opt.value)}
              >
                <SansText size={15} color={sort === opt.value ? SavorColors.orange : SavorColors.text} weight={sort === opt.value ? 'semi' : 'regular'}>
                  {opt.label}
                </SansText>
                {sort === opt.value ? (
                  <View style={styles.checkmark}>
                    <SansText size={14} color={SavorColors.orange}>✓</SansText>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
            <SavorButton label="Done" onPress={() => setSortSheetVisible(false)} variant="ghost" style={styles.modalDone} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  title: { marginBottom: 20 },
  search: { marginBottom: 16 },
  categories: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
    backgroundColor: SavorColors.card,
    marginRight: 8,
  },
  categoryPillActive: { backgroundColor: SavorColors.orange, borderColor: SavorColors.orange },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  sortBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 12,
    ...SavorShadow.card,
  },
  cardClosed: { opacity: 0.6 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: SavorRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  closedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: SavorColors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SavorColors.background,
    borderTopLeftRadius: SavorRadius.xl,
    borderTopRightRadius: SavorRadius.xl,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: { marginBottom: 16, textAlign: 'center' },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: SavorColors.border,
  },
  modalOptionActive: { backgroundColor: SavorColors.orangeSoft },
  checkmark: { width: 24, alignItems: 'center' },
  modalDone: { marginTop: 12 },
});
