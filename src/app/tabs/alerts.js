import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { fetchNotifications } from '../../services/api';
import { showAlert } from '../../services/alertHelper';

export default function Alerts() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = router.addListener('focus', loadNotifications);
    return unsubscribe;
  }, [router]);

  async function loadNotifications() {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
      showAlert('Error', err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll padBottom contentStyle={styles.pad}>
        <SerifText size={32} style={styles.title}>Notifications</SerifText>
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Notifications</SerifText>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>🔔</SansText>
          <SansText size={15} style={styles.emptyText}>No notifications yet.</SansText>
        </View>
      ) : (
        notifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={styles.item}
            activeOpacity={0.9}
            onPress={() => {
              if (n.order_status === 'out_for_delivery' || n.order_status === 'preparing' || n.order_status === 'pending') {
                router.push({ pathname: '/tracking', params: { orderId: String(n.order_id) } });
              }
              if (n.order_status === 'delivered') {
                router.push({ pathname: '/review', params: { orderId: String(n.order_id) } });
              }
            }}
          >
            <View style={styles.iconBox}>
              <SansText size={22}>{n.icon}</SansText>
            </View>
            <View style={styles.body}>
              <SansText size={15} weight="semi" color={SavorColors.text}>{n.title}</SansText>
              <SansText size={13} numberOfLines={2}>{n.body}</SansText>
              <SansText size={12} color={SavorColors.textLight}>{n.time}</SansText>
            </View>
            {n.unread ? <View style={styles.dot} /> : null}
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  title: { marginBottom: 20 },
  item: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    ...SavorShadow.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  body: { flex: 1, gap: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SavorColors.orange,
    marginTop: 6,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
});
