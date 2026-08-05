import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { addToCart, fetchOrderById } from '../services/api';

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
        showAlert('Error', err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleReorder = async () => {
    if (!order || !order.order_items) return;
    try {
      for (const item of order.order_items) {
        await addToCart(item.food_item_id, item.quantity);
      }
      showAlert('Success', 'All items added to your cart!', [
        { text: 'OK', onPress: () => router.push('/tabs/cart') },
      ]);
    } catch (err) {
      showAlert('Error', err.message || 'Failed to reorder');
    }
  };

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

  const statusColor = order.order_status === 'delivered' ? SavorColors.successText : SavorColors.orange;

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
          <View style={styles.lineInfo}>
            <SansText size={14} weight="semi" color={SavorColors.text}>{item.food_name}</SansText>
            <SansText size={12} color={SavorColors.textMuted}>x{item.quantity}</SansText>
          </View>
          <SansText size={14} weight="medium">Rs {parseFloat(item.total_price).toLocaleString('en-IN')}</SansText>
        </View>
      ))}

      {/* Delivery Address */}
      <SansText size={15} weight="semi" color={SavorColors.text} style={styles.section}>
        Delivery address
      </SansText>
      <View style={styles.infoCard}>
        <SansText size={14} weight="medium" color={SavorColors.text}>{order.address_label || 'Home'}</SansText>
        <SansText size={13} color={SavorColors.textMuted}>
          {order.address_line1}, {order.city}
        </SansText>
      </View>

      {/* Payment Method */}
      <SansText size={15} weight="semi" color={SavorColors.text} style={styles.section}>
        Payment method
      </SansText>
      <View style={styles.infoCard}>
        <SansText size={14} weight="medium" color={SavorColors.text}>
          {order.payment_method === 'upi' ? 'UPI / PhonePay' : order.payment_method === 'card' ? 'Debit Card' : 'Cash on Delivery'}
        </SansText>
        <SansText size={12} color={SavorColors.textMuted}>
          {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
        </SansText>
      </View>

      {/* Cost Breakdown */}
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
        <View style={styles.row}>
          <SansText>Tax</SansText>
          <SansText weight="medium">Rs {parseFloat(order.tax || 0).toLocaleString('en-IN')}</SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total paid</SansText>
          <SerifText size={20} color={SavorColors.orange}>Rs {parseFloat(order.total_amount).toLocaleString('en-IN')}</SerifText>
        </View>
      </View>

      {order.order_status === 'delivered' ? (
        <>
          <SavorButton
            label="Rate this order"
            onPress={() => router.push({ pathname: '/review', params: { orderId: String(order.id) } })}
          />
          <SavorButton
            label="Reorder"
            variant="ghost"
            onPress={handleReorder}
            style={styles.reorder}
          />
        </>
      ) : (
        <SavorButton label="Track order" onPress={() => router.push({ pathname: '/tracking', params: { orderId: String(order.id) } })} />
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
    alignItems: 'center',
  },
  lineInfo: { flex: 1 },
  infoCard: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 16,
    marginBottom: 16,
    gap: 4,
    ...SavorShadow.card,
  },
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 20,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: SavorColors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  reorder: { marginTop: 12 },
});
