import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { MY_ORDERS, CART_ITEMS } from '../data/mockData';

export default function OrderDetail() {
  const router = useRouter();
  const { id = 'ORD-8820' } = useLocalSearchParams();
  const order = MY_ORDERS.find((o) => o.id === id) ?? MY_ORDERS[0];

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Order Details" />

      <View style={styles.hero}>
        <SansText size={48}>{order.emoji}</SansText>
        <SerifText size={22} style={styles.center}>{order.restaurant}</SerifText>
        <SansText size={13} style={styles.center}>{order.id} · {order.date}</SansText>
        <View style={[styles.statusPill, { backgroundColor: `${order.statusColor}20` }]}>
          <SansText size={13} weight="semi" style={{ color: order.statusColor }}>
            {order.status}
          </SansText>
        </View>
      </View>

      <SansText size={15} weight="semi" color={SavorColors.text} style={styles.section}>
        Items ordered
      </SansText>
      {CART_ITEMS.map((item) => (
        <View key={item.id} style={styles.line}>
          <SansText size={14}>{item.emoji} {item.name}</SansText>
          <SansText size={14} weight="medium">₹{item.price}</SansText>
        </View>
      ))}

      <View style={styles.summary}>
        <View style={styles.row}>
          <SansText>Subtotal</SansText>
          <SansText weight="medium">{order.total}</SansText>
        </View>
        <View style={styles.row}>
          <SansText>Delivery</SansText>
          <SansText weight="medium" color={SavorColors.successText}>Free</SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total paid</SansText>
          <SerifText size={20} color={SavorColors.orange}>{order.total}</SerifText>
        </View>
      </View>

      {order.status === 'Delivered' ? (
        <>
          <SavorButton label="Rate this order" onPress={() => router.push('/review')} />
          <SavorButton
            label="Reorder"
            variant="ghost"
            onPress={() => router.push('/restaurant')}
            style={styles.reorder}
          />
        </>
      ) : (
        <SavorButton label="Track order" onPress={() => router.push('/tracking')} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  hero: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...SavorShadow.card,
  },
  center: { textAlign: 'center', marginTop: 8 },
  statusPill: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  section: { marginBottom: 12 },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: SavorColors.card,
    padding: 14,
    borderRadius: SavorRadius.md,
    marginBottom: 8,
  },
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 20,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: SavorColors.border },
  reorder: { marginTop: 12 },
});
