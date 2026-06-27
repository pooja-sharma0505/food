import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SearchBar } from '../../components/savor/SearchBar';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { RESTAURANTS } from '../../data/mockData';

const FILTERS = ['All', 'Italian', 'Indian', 'Chinese'];

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

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

      {RESTAURANTS.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={styles.card}
          onPress={() => router.push('/restaurant')}
          activeOpacity={0.9}
        >
          <View style={styles.thumb}>
            <SansText size={32}>{r.emoji}</SansText>
          </View>
          <View style={styles.info}>
            <SansText size={17} weight="semi" color={SavorColors.text}>{r.name}</SansText>
            <SansText size={13}>
              ⭐ {r.rating} · {r.time} · {r.fee}
            </SansText>
            <View style={styles.tagRow}>
              {r.cuisines.map((c) => (
                <View key={c} style={styles.tag}>
                  <SansText size={11} color={SavorColors.orange}>{c}</SansText>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
