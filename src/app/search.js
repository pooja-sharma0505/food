import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SearchBar } from '../components/savor/SearchBar';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { POPULAR_DISHES, RESTAURANTS } from '../data/mockData';

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(params.q?.toString() ?? '');

  const dishes = POPULAR_DISHES.filter(
    (d) => !query || d.name.toLowerCase().includes(query.toLowerCase()),
  );
  const restaurants = RESTAURANTS.filter(
    (r) => !query || r.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Search" />

      <SearchBar
        placeholder="Search dishes, cuisines..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Dishes
      </SansText>
      {dishes.map((d) => (
        <TouchableOpacity
          key={d.id}
          style={styles.row}
          onPress={() => router.push('/restaurant')}
        >
          <SansText size={24}>{d.emoji}</SansText>
          <View style={styles.info}>
            <SansText size={15} weight="semi" color={SavorColors.text}>{d.name}</SansText>
            <SansText size={13}>{d.restaurant} · {d.price}</SansText>
          </View>
        </TouchableOpacity>
      ))}

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Restaurants
      </SansText>
      {restaurants.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={styles.row}
          onPress={() => router.push('/restaurant')}
        >
          <SansText size={24}>{r.emoji}</SansText>
          <View style={styles.info}>
            <SansText size={15} weight="semi" color={SavorColors.text}>{r.name}</SansText>
            <SansText size={13}>⭐ {r.rating} · {r.time}</SansText>
          </View>
        </TouchableOpacity>
      ))}

      {dishes.length === 0 && restaurants.length === 0 ? (
        <SansText size={14} style={styles.empty}>No results for "{query}"</SansText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  search: { marginBottom: 20 },
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
  info: { flex: 1, gap: 2 },
  empty: { textAlign: 'center', marginTop: 40 },
});
