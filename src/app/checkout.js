import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { CART_ITEMS, ADDRESSES } from '../data/mockData';

const PAYMENTS = ['UPI / PhonePe', 'Cash on Delivery', 'Net Banking'];

export default function Checkout() {
  const router = useRouter();
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const defaultAddress = ADDRESSES.find((a) => a.default) || ADDRESSES[0];
  const subtotal = CART_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Checkout" />

      <SansText size={14} weight="semi" color={SavorColors.text}>Delivery address</SansText>
      <View style={styles.addressCard}>
        <Ionicons name={defaultAddress.icon} size={22} color={SavorColors.orange} />
        <View style={{ flex: 1 }}>
          <SansText size={14} weight="medium" color={SavorColors.text}>{defaultAddress.label}</SansText>
          <SansText size={13}>{defaultAddress.line1}, {defaultAddress.line2}</SansText>
        </View>
        <TouchableOpacity onPress={() => router.push('/addresses')}>
          <SansText size={13} color={SavorColors.orange} weight="semi">Change</SansText>
        </TouchableOpacity>
      </View>

      <SansText size={14} weight="semi" color={SavorColors.text} style={styles.section}>
        Payment method
      </SansText>
      {PAYMENTS.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.payCard, payment === p && styles.payActive]}
          onPress={() => setPayment(p)}
        >
          <View style={[styles.radio, payment === p && styles.radioOn]} />
          <SansText size={14} weight="medium" color={SavorColors.text}>{p}</SansText>
        </TouchableOpacity>
      ))}

      <View style={styles.summary}>
        <View style={styles.row}>
          <SansText>Subtotal</SansText>
          <SansText weight="medium">₹{subtotal.toLocaleString('en-IN')}</SansText>
        </View>
        <View style={styles.row}>
          <SansText>Delivery</SansText>
          <SansText weight="medium" color={SavorColors.successText}>Free</SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total</SansText>
          <SerifText size={22} color={SavorColors.orange}>₹{total.toLocaleString('en-IN')}</SerifText>
        </View>
      </View>

      <SavorButton label="Place Order" variant="dark" onPress={() => router.push('/order-placed')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  title: { marginBottom: 24 },
  section: { marginTop: 20, marginBottom: 10 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginTop: 8,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.md,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  payActive: { borderColor: SavorColors.orange },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SavorColors.border,
  },
  radioOn: { borderColor: SavorColors.orange, backgroundColor: SavorColors.orange },
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 24,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: SavorColors.border },
});
