import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchOrders } from '../services/api';

const STATUS_COLORS = {
  pending: SavorColors.orange,
  confirmed: SavorColors.orange,
  preparing: SavorColors.orange,
  out_for_delivery: SavorColors.orange,
  delivered: SavorColors.successText,
  cancelled: SavorColors.textMuted,
};

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const loadOrders = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err.message);
        showAlert('Error', err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useFocusEffect(loadOrders);

  const activeOrders = orders.filter((o) => o.order_status !== 'delivered' && o.order_status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.order_status === 'delivered' || o.order_status === 'cancelled');

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

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

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <SansText size={14} weight={activeTab === 'active' ? 'semi' : 'regular'} color={activeTab === 'active' ? SavorColors.orange : SavorColors.textMuted}>
            Active
          </SansText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <SansText size={14} weight={activeTab === 'past' ? 'semi' : 'regular'} color={activeTab === 'past' ? SavorColors.orange : SavorColors.textMuted}>
            Past
          </SansText>
        </TouchableOpacity>
      </View>

      {displayOrders.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>📦</SansText>
          <SansText size={15} style={styles.emptyText}>
            {activeTab === 'active'
              ? 'No active orders. Start ordering from your favorite restaurants!'
              : 'No past orders yet.'}
          </SansText>
        </View>
      ) : (
        displayOrders.map((order) => {
          const statusColor = STATUS_COLORS[order.order_status] || SavorColors.textMuted;
          const isDelivered = order.order_status === 'delivered';
          const isCancelled = order.order_status === 'cancelled';

          return (
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
                  <View style={[styles.badge, { backgroundColor: `${statusColor}18` }]}>
                    <SansText size={11} weight="semi" style={{ color: statusColor }}>
                      {order.order_status}
                    </SansText>
                  </View>
                </View>
                <SansText size={13} numberOfLines={1}>
                  Order #{order.order_number}
                </SansText>
                <View style={styles.bottomRow}>
                  <SansText size={12} color={SavorColors.textLight}>
                    {new Date(order.placed_at).toLocaleDateString()}
                  </SansText>
                  <SansText size={14} weight="semi" color={SavorColors.orange}>
                    Rs {parseFloat(order.total_amount).toLocaleString('en-IN')}
                  </SansText>
                </View>
              </View>

              {/* Track button for active orders */}
              {!isDelivered && !isCancelled ? (
                <TouchableOpacity
                  style={styles.trackBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push({ pathname: '/tracking', params: { orderId: String(order.id) } });
                  }}
                >
                  <SansText size={12} color={SavorColors.orange} weight="semi">
                    Track
                  </SansText>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 32 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.pill,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SavorRadius.pill,
  },
  tabActive: {
    backgroundColor: SavorColors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
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
  trackBtn: {
    paddingLeft: 12,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
});
