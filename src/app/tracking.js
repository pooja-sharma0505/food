import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchOrderById } from '../services/api';

const STEPS = [
  { key: 'pending', label: 'Order placed', icon: 'cart' },
  { key: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle' },
  { key: 'preparing', label: 'Preparing', icon: 'restaurant' },
  { key: 'out_for_delivery', label: 'Out for delivery', icon: 'bicycle' },
  { key: 'delivered', label: 'Delivered', icon: 'home' },
];

export default function Tracking() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err.message);
        showAlert('Error', err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleCall = () => {
    // In a real app, this would use the restaurant's phone number
    Linking.openURL('tel:+919876543210');
  };

  const handleMessage = () => {
    showAlert('Message', 'Contact your delivery partner via the app chat.', [{ text: 'OK' }]);
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Track Order" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Track Order" />
        <SansText>Order not found.</SansText>
      </Screen>
    );
  }

  const currentStatus = order.order_status || 'pending';
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStatus);
  const activeStep = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Track Order" />

      <SerifText size={24} style={styles.center}>#{order.order_number}</SerifText>
      <SansText size={14} style={styles.center} color={SavorColors.textMuted}>
        {order.restaurant_name}
      </SansText>

      {/* Status Timeline */}
      <View style={styles.timeline}>
        {STEPS.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;
          return (
            <View key={step.key} style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepCircle, isActive && styles.stepCircleActive, isCurrent && styles.stepCircleCurrent]}>
                  <Ionicons
                    name={step.icon}
                    size={18}
                    color={isActive ? '#fff' : SavorColors.textLight}
                  />
                </View>
                {index < STEPS.length - 1 ? (
                  <View style={[styles.stepLine, isActive && styles.stepLineActive]} />
                ) : null}
              </View>
              <View style={styles.stepInfo}>
                <SansText size={14} weight={isCurrent ? 'semi' : 'regular'} color={isActive ? SavorColors.text : SavorColors.textLight}>
                  {step.label}
                </SansText>
                <SansText size={12} color={SavorColors.textLight}>
                  {isCurrent ? 'In progress' : isActive ? 'Completed' : 'Pending'}
                </SansText>
              </View>
            </View>
          );
        })}
      </View>

      {/* Estimated Delivery */}
      <View style={styles.etaCard}>
        <SansText size={13} color={SavorColors.textMuted}>Estimated delivery</SansText>
        <SerifText size={28} color={SavorColors.orange}>7:45 PM</SerifText>
        <SansText size={13} color={SavorColors.textMuted}>~25 min remaining</SansText>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
          <Ionicons name="call" size={20} color={SavorColors.orange} />
          <SansText size={14} color={SavorColors.orange} weight="medium">Call restaurant</SansText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleMessage}>
          <Ionicons name="chatbubble" size={20} color={SavorColors.orange} />
          <SansText size={14} color={SavorColors.orange} weight="medium">Message</SansText>
        </TouchableOpacity>
      </View>

      {order.order_status === 'delivered' ? (
        <SavorButton
          label="Rate your order"
          onPress={() => router.push({ pathname: '/review', params: { orderId: String(order.id) } })}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  center: { textAlign: 'center', marginTop: 4 },
  timeline: {
    marginVertical: 24,
    paddingLeft: 4,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 14,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: SavorColors.border,
  },
  stepCircleActive: {
    backgroundColor: SavorColors.orange,
    borderColor: SavorColors.orange,
  },
  stepCircleCurrent: {
    backgroundColor: SavorColors.orange,
    shadowColor: SavorColors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  stepLine: {
    width: 2,
    height: 32,
    backgroundColor: SavorColors.border,
    marginTop: 4,
  },
  stepLineActive: {
    backgroundColor: SavorColors.orange,
  },
  stepInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  etaCard: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    ...SavorShadow.card,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: SavorRadius.pill,
  },
});
