import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchOrderById, fetchOrderTracking } from '../services/api';
import { showAlert } from '../services/alertHelper';

const ALL_STEPS = [
  { label: 'Order Confirmed', key: 'confirmed' },
  { label: 'Preparing Your Food', key: 'preparing' },
  { label: 'Out for Delivery', key: 'out_for_delivery' },
  { label: 'Delivered', key: 'delivered' },
];

const STATUS_STEP_INDEX = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: 1,
};

export default function Tracking() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      showAlert('Error', 'No order ID provided.');
      router.back();
      return;
    }
    (async () => {
      try {
        const [orderData, trackingData] = await Promise.all([
          fetchOrderById(orderId),
          fetchOrderTracking(orderId),
        ]);
        setOrder(orderData);
        setTracking(trackingData);
      } catch (err) {
        console.error('Failed to load tracking:', err.message);
        showAlert('Error', err.message || 'Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Tracking Order" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Tracking Order" />
        <SansText>Order not found.</SansText>
      </Screen>
    );
  }

  const activeStepIndex = STATUS_STEP_INDEX[order.order_status] ?? 0;
  const steps = ALL_STEPS.map((step, idx) => {
    if (idx < activeStepIndex) return { ...step, status: 'done' };
    if (idx === activeStepIndex) return { ...step, status: 'active' };
    return { ...step, status: 'pending' };
  });

  const latestTracking = tracking.length > 0 ? tracking[tracking.length - 1] : null;
  const etaText = latestTracking
    ? `${latestTracking.message} · ${new Date(latestTracking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Est. arrival: 30-40 min';

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Tracking Order" />
      <SansText size={14} style={styles.sub}>
        {etaText} · #{order.order_number}
      </SansText>

      <View style={styles.map}>
        <View style={styles.mapLine} />
        <View style={styles.mapPin}>
          <Ionicons name="location" size={28} color={SavorColors.orange} />
        </View>
      </View>

      {steps.map((step) => (
        <View key={step.label} style={styles.step}>
          <View
            style={[
              styles.dot,
              step.status === 'done' && styles.dotDone,
              step.status === 'active' && styles.dotActive,
            ]}
          >
            {step.status === 'done' ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
          </View>
          <View style={styles.stepBody}>
            <SansText size={15} weight="semi" color={SavorColors.text}>{step.label}</SansText>
            {step.status === 'active' && latestTracking ? (
              <SansText size={13}>{latestTracking.message}</SansText>
            ) : null}
          </View>
        </View>
      ))}

      {order.order_status === 'out_for_delivery' ? (
        <View style={styles.driver}>
          <View style={styles.driverAvatar}>
            <SansText color="#fff" weight="bold">
              {order.restaurant_name?.[0] || 'D'}
            </SansText>
          </View>
          <View style={{ flex: 1 }}>
            <SansText size={15} weight="semi" color={SavorColors.text}>
              {order.restaurant_name || 'Your order'}
            </SansText>
            <SansText size={13}>⭐ {order.restaurant_rating || '4.8'} restaurant</SansText>
          </View>
          <TouchableOpacity style={styles.call}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : null}

      <SavorButton
        label="Rate your order"
        onPress={() => router.push({ pathname: '/review', params: { orderId: String(order.id) } })}
        style={styles.btn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  sub: { marginTop: 6, marginBottom: 20 },
  map: {
    height: 140,
    backgroundColor: '#D4EDDA',
    borderRadius: SavorRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  mapLine: {
    position: 'absolute',
    width: '70%',
    height: 4,
    backgroundColor: SavorColors.orange,
    borderRadius: 2,
  },
  mapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SavorColors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...SavorShadow.card,
  },
  step: { flexDirection: 'row', marginBottom: 18 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: SavorColors.border,
    marginRight: 14,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotDone: { backgroundColor: SavorColors.orange, borderColor: SavorColors.orange },
  dotActive: { borderColor: SavorColors.orange, borderWidth: 3 },
  stepBody: { flex: 1, gap: 2 },
  driver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.peach,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginVertical: 24,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  call: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SavorColors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: { marginTop: 4 },
});
