import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchFavourites } from '../services/api';

export default function Favourites() {
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = router.addListener('focus', loadFavourites);
    return unsubscribe;
  }, [router]);

  async function loadFavourites() {
    setLoading(true);
    try {
      const data = await fetchFavourites();
      setFavourites(data);
    } catch (err) {
      console.error('Failed to load favourites:', err.message);
      Alert.alert('Error', err.message || 'Failed to load favourites');
    } finally {
      setLoading(false);
    }
  }

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
          <SansText size={40}>❤️</SansText>
          <SansText size={15} style={styles.emptyText}>No favourites yet. Heart dishes you love!</SansText>
        </View>
      ) : (
        favourites.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push('/restaurant')}
            activeOpacity={0.9}
          >
            <View style={styles.thumb}>
              <SansText size={28}>{item.category_icon || '🍽️'}</SansText>
            </View>
            <View style={styles.info}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{item.food_name}</SansText>
              <SansText size={13}>{item.restaurant_name} · ⭐ {item.rating}</SansText>
              <SansText size={14} color={SavorColors.orange} weight="semi">
                Rs {item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}
              </SansText>
            </View>
            <Ionicons name="heart" size={22} color={SavorColors.orange} />
          </TouchableOpacity>
        ))
      )}
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
});
