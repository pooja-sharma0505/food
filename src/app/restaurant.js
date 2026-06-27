import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { MENU_ITEMS } from '../data/mockData';

export default function Restaurant() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Restaurant" />
      <View style={styles.hero}>
        <SansText size={72}>🍕</SansText>
      </View>

      <SerifText size={28}>Bella Italia</SerifText>
      <SansText size={14} style={styles.meta}>⭐ 4.8 · 20–30 min · Italian</SansText>

      <View style={styles.tags}>
        {['Pizza', 'Pasta', 'Risotto'].map((t) => (
          <View key={t} style={styles.tag}>
            <SansText size={12} color={SavorColors.orange} weight="medium">{t}</SansText>
          </View>
        ))}
      </View>

      <SansText size={18} weight="semi" color={SavorColors.text} style={styles.menuHead}>
        Menu
      </SansText>

      {MENU_ITEMS.map((item) => (
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
      ))}
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
