import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchOrders } from '../services/api';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = router.addListener('focus', loadOrders);
    return unsubscribe;
  }, [router]);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err.message);
      Alert.alert('Error', err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="My Orders" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="My Orders" />

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>📦</SansText>
          <SansText size={15} style={styles.emptyText}>No orders yet. Start ordering from your favorite restaurants!</SansText>
        </View>
      ) : (
        orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({ pathname: '/order-detail', params: { id: String(order.id) } })
            }
          >
            <View style={styles.thumb}>
              <SansText size={28}>🍽️</SansText>
            </View>
            <View style={styles.info}>
              <View style={styles.topRow}>
                <SansText size={16} weight="semi" color={SavorColors.text}>
                  {order.restaurant_name}
                </SansText>
                <View style={[styles.badge, { backgroundColor: '#2E7D3218' }]}>
                  <SansText size={11} weight="semi" style={{ color: '#2E7D32' }}>
                    {order.order_status}
                  </SansText>
                </View>
              </View>
              <SansText size={13} numberOfLines={1}>
                Order #{order.order_number}
              </SansText>
              <View style={styles.bottomRow}>
                <SansText size={12}>{new Date(order.placed_at).toLocaleDateString()}</SansText>
                <SansText size={14} weight="semi" color={SavorColors.orange}>
                  Rs {parseFloat(order.total_amount).toLocaleString('en-IN')}
                </SansText>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 12,
    ...SavorShadow.card,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
});
