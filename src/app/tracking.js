import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';

const STEPS = [
  { label: 'Order Confirmed', time: '7:12 PM', status: 'done' },
  { label: 'Preparing Your Food', sub: 'Bella Italia Kitchen', status: 'done' },
  { label: 'Out for Delivery', sub: 'Ravi is on the way', status: 'active' },
  { label: 'Delivered', sub: 'Pending', status: 'pending' },
];

export default function Tracking() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Tracking Order" />
      <SansText size={14} style={styles.sub}>Est. arrival: 7:45 PM · #ORD-8820</SansText>

      <View style={styles.map}>
        <View style={styles.mapLine} />
        <View style={styles.mapPin}>
          <Ionicons name="location" size={28} color={SavorColors.orange} />
        </View>
      </View>

      {STEPS.map((step) => (
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
            {step.time ? <SansText size={13}>{step.time}</SansText> : null}
            {step.sub ? <SansText size={13}>{step.sub}</SansText> : null}
          </View>
        </View>
      ))}

      <View style={styles.driver}>
        <View style={styles.driverAvatar}>
          <SansText color="#fff" weight="bold">RK</SansText>
        </View>
        <View style={{ flex: 1 }}>
          <SansText size={15} weight="semi" color={SavorColors.text}>Ravi Kumar</SansText>
          <SansText size={13}>⭐ 4.9 delivery partner</SansText>
        </View>
        <TouchableOpacity style={styles.call}>
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <SavorButton label="Rate your order" onPress={() => router.push('/review')} style={styles.btn} />
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
