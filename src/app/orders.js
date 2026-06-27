import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { MY_ORDERS } from '../data/mockData';

export default function Orders() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="My Orders" />

      {MY_ORDERS.map((order) => (
        <TouchableOpacity
          key={order.id}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() =>
            router.push({ pathname: '/order-detail', params: { id: order.id } })
          }
        >
          <View style={styles.thumb}>
            <SansText size={28}>{order.emoji}</SansText>
          </View>
          <View style={styles.info}>
            <View style={styles.topRow}>
              <SansText size={16} weight="semi" color={SavorColors.text}>
                {order.restaurant}
              </SansText>
              <View style={[styles.badge, { backgroundColor: `${order.statusColor}18` }]}>
                <SansText size={11} weight="semi" style={{ color: order.statusColor }}>
                  {order.status}
                </SansText>
              </View>
            </View>
            <SansText size={13} numberOfLines={1}>{order.items}</SansText>
            <View style={styles.bottomRow}>
              <SansText size={12}>{order.date}</SansText>
              <SansText size={14} weight="semi" color={SavorColors.orange}>
                {order.total}
              </SansText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
});
