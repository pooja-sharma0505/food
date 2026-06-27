import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorButton } from '../../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { CART_ITEMS } from '../../data/mockData';

export default function Cart() {
  const router = useRouter();
  const total = CART_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <View style={styles.titleRow}>
        <SerifText size={28}>Your Cart</SerifText>
        <Ionicons name="cart" size={24} color={SavorColors.orange} />
      </View>

      {CART_ITEMS.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.thumb}>
            <SansText size={24}>{item.emoji}</SansText>
          </View>
          <View style={styles.info}>
            <SansText size={15} weight="semi" color={SavorColors.text}>{item.name}</SansText>
            <SansText size={12}>{item.shop}</SansText>
            <SansText size={14} color={SavorColors.orange} weight="semi">
              ₹{item.price * item.qty}
            </SansText>
          </View>
          <View style={styles.qty}>
            <TouchableOpacity><Ionicons name="remove" size={18} /></TouchableOpacity>
            <SansText weight="semi">{item.qty}</SansText>
            <TouchableOpacity><Ionicons name="add" size={18} color={SavorColors.orange} /></TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.totalRow}>
        <SansText size={14} color={SavorColors.textMuted}>Total</SansText>
        <SerifText size={32}>₹{total.toLocaleString('en-IN')}</SerifText>
      </View>

      <SavorButton label="Proceed to Checkout" variant="dark" onPress={() => router.push('/checkout')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
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
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1, gap: 2 },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SavorColors.backgroundInput,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  totalRow: { marginVertical: 20 },
});
