import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius } from '../constants/savorTheme';

export default function ItemDetail() {
  const router = useRouter();
  const { name = 'Margherita Pizza', price = '₹320', emoji = '🍕' } = useLocalSearchParams();
  const [qty, setQty] = useState(1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <PageHeader title="Item" />
        <View style={styles.hero}>
          <SansText size={80}>{emoji}</SansText>
        </View>

        <SerifText size={26}>{name}</SerifText>
        <SansText size={14} style={styles.sub}>Bella Italia · Classic Italian</SansText>

        <View style={styles.stats}>
          {[
            { label: 'Time', val: '25m' },
            { label: 'Cal', val: '680' },
            { label: 'Rate', val: '4.8' },
            { label: 'Price', val: price },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <SansText size={11} color={SavorColors.textLight}>{s.label}</SansText>
              <SansText size={14} weight="semi" color={SavorColors.text}>{s.val}</SansText>
            </View>
          ))}
        </View>

        <SansText size={14} style={styles.desc}>
          Fresh mozzarella, basil, and San Marzano tomato sauce on a wood-fired crust. A timeless classic.
        </SansText>

        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
            <SansText size={20} weight="semi">−</SansText>
          </TouchableOpacity>
          <SansText size={20} weight="bold">{qty}</SansText>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
            <SansText size={20} weight="semi" color={SavorColors.orange}>+</SansText>
          </TouchableOpacity>
          <SansText size={16} weight="semi" color={SavorColors.orange} style={styles.eq}>
            = {price}
          </SansText>
        </View>
      </View>

      <View style={styles.footer}>
        <SavorButton label={`Add to Cart – ${price}`} onPress={() => router.push('/tabs/cart')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SavorColors.background },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  hero: {
    height: 200,
    backgroundColor: SavorColors.orangeLight,
    borderRadius: SavorRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sub: { marginTop: 6, marginBottom: 16 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  stat: {
    flex: 1,
    backgroundColor: SavorColors.card,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  desc: { lineHeight: 22, marginBottom: 20 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 14,
    gap: 16,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eq: { marginLeft: 'auto' },
  footer: { padding: 20, paddingBottom: 8 },
});
