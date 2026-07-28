import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchOrderById } from '../services/api';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err.message);
        Alert.alert('Error', err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Order Details" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Order Details" />
        <SansText>Order not found.</SansText>
      </Screen>
    );
  }

  const statusColor = order.order_status === 'delivered' ? '#2E7D32' : '#EF6C00';

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Order Details" />

      <View style={styles.hero}>
        <SansText size={48}>🍽️</SansText>
        <SerifText size={22} style={styles.center}>{order.restaurant_name}</SerifText>
        <SansText size={13} style={styles.center}>#{order.order_number} · {new Date(order.placed_at).toLocaleDateString()}</SansText>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
          <SansText size={13} weight="semi" style={{ color: statusColor }}>
            {order.order_status}
          </SansText>
        </View>
      </View>

      <SansText size={15} weight="semi" color={SavorColors.text} style={styles.section}>
        Items ordered
      </SansText>
      {(order.order_items || []).map((item) => (
        <View key={item.id} style={styles.line}>
          <SansText size={14}>{item.food_name} x{item.quantity}</SansText>
          <SansText size={14} weight="medium">Rs {parseFloat(item.total_price).toLocaleString('en-IN')}</SansText>
        </View>
      ))}

      <View style={styles.summary}>
        <View style={styles.row}>
          <SansText>Subtotal</SansText>
          <SansText weight="medium">Rs {parseFloat(order.subtotal).toLocaleString('en-IN')}</SansText>
        </View>
        <View style={styles.row}>
          <SansText>Delivery</SansText>
          <SansText weight="medium" color={SavorColors.successText}>
            {parseFloat(order.delivery_fee) > 0 ? `Rs ${order.delivery_fee}` : 'Free'}
          </SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total paid</SansText>
          <SerifText size={20} color={SavorColors.orange}>Rs {parseFloat(order.total_amount).toLocaleString('en-IN')}</SerifText>
        </View>
      </View>

      {order.order_status === 'delivered' ? (
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
