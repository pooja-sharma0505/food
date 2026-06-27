import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SearchBar } from '../../components/savor/SearchBar';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { CATEGORIES, POPULAR_DISHES } from '../../data/mockData';

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('pizza');

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <View style={styles.header}>
        <View>
          <SansText size={13}>Good Evening 🌙</SansText>
          <SerifText size={24}>What's for dinner?</SerifText>
        </View>
        <View style={styles.avatar}>
          <SansText size={13} color="#fff" weight="bold">RK</SansText>
        </View>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategory(c.id)}
            >
              <SansText size={14}>{c.icon}</SansText>
              <SansText size={14} color={active ? '#fff' : SavorColors.text} weight={active ? 'semi' : 'regular'}>
                {c.label}
              </SansText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.banner}>
        <View>
          <SansText size={18} color="#fff" weight="bold">50% Off Today!</SansText>
          <SansText size={12} color="#C9B8B0">Use code SAVOR50 at checkout</SansText>
        </View>
        <TouchableOpacity style={styles.claim}>
          <SansText size={13} color="#fff" weight="semi">Claim</SansText>
        </TouchableOpacity>
      </View>

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Popular now
      </SansText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {POPULAR_DISHES.map((dish) => (
          <TouchableOpacity
            key={dish.id}
            style={styles.foodCard}
            onPress={() => router.push('/restaurant')}
            activeOpacity={0.9}
          >
            <View style={[styles.foodImg, { backgroundColor: dish.bg }]}>
              <SansText size={40}>{dish.emoji}</SansText>
            </View>
            <SansText size={15} weight="semi" color={SavorColors.text} numberOfLines={1}>
              {dish.name}
            </SansText>
            <SansText size={12}>{dish.restaurant}</SansText>
            <SansText size={13} color={SavorColors.orange} weight="semi">
              {dish.price} · ⭐ {dish.rating}
            </SansText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: { marginBottom: 16 },
  chipsScroll: { marginBottom: 16, marginHorizontal: -20, paddingHorizontal: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
    marginRight: 10,
    backgroundColor: SavorColors.card,
  },
  chipActive: { backgroundColor: SavorColors.orange, borderColor: SavorColors.orange },
  banner: {
    backgroundColor: SavorColors.black,
    borderRadius: SavorRadius.lg,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  claim: {
    backgroundColor: SavorColors.orange,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: SavorRadius.pill,
  },
  section: { marginBottom: 14 },
  foodCard: {
    width: 160,
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 12,
    marginRight: 12,
    ...SavorShadow.card,
  },
  foodImg: {
    height: 100,
    borderRadius: SavorRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
