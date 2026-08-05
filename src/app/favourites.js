import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchFavourites } from '../services/api';

export default function Favourites() {
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removedItem, setRemovedItem] = useState(null);

  const loadFavourites = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchFavourites();
        setFavourites(data);
      } catch (err) {
        console.error('Failed to load favourites:', err.message);
        showAlert('Error', err.message || 'Failed to load favourites');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useFocusEffect(loadFavourites);

  const handleUnfavourite = (item) => {
    setRemovedItem(item);
    setFavourites((prev) => prev.filter((f) => f.id !== item.id));
    // Show undo toast
    setTimeout(() => {
      setRemovedItem(null);
    }, 3000);
  };

  const handleUndo = () => {
    if (removedItem) {
      setFavourites((prev) => [...prev, removedItem]);
      setRemovedItem(null);
    }
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Favourites" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Favourites" />

      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={SavorColors.textLight} />
          <SansText size={15} style={styles.emptyText}>Save your favourite dishes to find them here fast.</SansText>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/tabs/explore')}
          >
            <SansText size={14} color={SavorColors.orange} weight="semi">
              Browse restaurants →
            </SansText>
          </TouchableOpacity>
        </View>
      ) : (
        favourites.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/restaurant', params: { id: String(item.restaurant_id) } })}
            activeOpacity={0.9}
          >
            <View style={styles.thumb}>
              <SansText size={28}>{item.category_icon || '🍽️'}</SansText>
            </View>
            <View style={styles.info}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{item.food_name}</SansText>
              <SansText size={13} color={SavorColors.textMuted}>{item.restaurant_name} · ⭐ {item.rating}</SansText>
              <SansText size={14} color={SavorColors.orange} weight="semi">
                Rs {item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}
              </SansText>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleUnfavourite(item);
              }}
              hitSlop={8}
            >
              <Ionicons name="heart" size={22} color={SavorColors.orange} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}

      {/* Undo Toast */}
      {removedItem ? (
        <View style={styles.undoToast}>
          <SansText size={13} color={SavorColors.white}>Removed from favourites</SansText>
          <TouchableOpacity onPress={handleUndo} hitSlop={8}>
            <SansText size={13} color={SavorColors.white} weight="bold">Undo</SansText>
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 32 },
  card: {
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
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1, gap: 3 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
  emptyBtn: {
    padding: 12,
    backgroundColor: SavorColors.orangeSoft,
    borderRadius: SavorRadius.pill,
  },
  undoToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SavorColors.black,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SavorRadius.md,
    ...SavorShadow.tab,
  },
});
