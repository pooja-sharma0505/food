import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { FAVOURITES } from '../data/mockData';

export default function Favourites() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Favourites" />

      {FAVOURITES.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>❤️</SansText>
          <SansText size={15} style={styles.emptyText}>No favourites yet. Heart dishes you love!</SansText>
        </View>
      ) : (
        FAVOURITES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push('/restaurant')}
            activeOpacity={0.9}
          >
            <View style={styles.thumb}>
              <SansText size={28}>{item.emoji}</SansText>
            </View>
            <View style={styles.info}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{item.name}</SansText>
              <SansText size={13}>{item.shop} · ⭐ {item.rating}</SansText>
              <SansText size={14} color={SavorColors.orange} weight="semi">{item.price}</SansText>
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
