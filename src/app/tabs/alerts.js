import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/savor/Screen';
import { SansText, SerifText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { showAlert } from '../../services/alertHelper';
import { fetchNotifications } from '../../services/api';

// Map notification type to icon color
const TYPE_COLORS = {
  order: SavorColors.orange,
  promo: '#D63384', // pink
  system: SavorColors.textMuted,
};

export default function Alerts() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(() => {
    (async () => {
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
    })();
  }, []);

  useFocusEffect(loadNotifications);

  // Split notifications into Today and Earlier
  const today = notifications.filter((n) => n.time.includes('hour') || n.time.includes('min') || n.time.includes('now'));
  const earlier = notifications.filter((n) => !today.includes(n));

  if (loading) {
    return (
      <Screen scroll padBottom contentStyle={styles.pad}>
        <SerifText size={32} style={styles.title}>Notifications</SerifText>
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  const renderSection = (title, items) => (
    <View style={styles.section}>
      <SansText size={12} color={SavorColors.textLight} weight="medium" style={styles.sectionHeader}>
        {title}
      </SansText>
      {items.map((n) => {
        const typeColor = TYPE_COLORS[n.icon?.[0] === '✅' ? 'order' : n.icon?.[0] === '🛵' ? 'order' : n.icon?.[0] === '👨' ? 'order' : 'system'];
        return (
          <TouchableOpacity
            key={n.id}
            style={[styles.item, n.unread && styles.itemUnread]}
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
            <View style={[styles.iconBox, { backgroundColor: `${typeColor}20` }]}>
              <SansText size={22}>{n.icon}</SansText>
            </View>
            <View style={styles.body}>
              <SansText size={15} weight="semi" color={SavorColors.text}>{n.title}</SansText>
              <SansText size={13} numberOfLines={2}>{n.body}</SansText>
              <SansText size={12} color={SavorColors.textLight}>{n.time}</SansText>
            </View>
            {n.unread ? <View style={styles.dot} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Notifications</SerifText>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <SansText size={40}>🔔</SansText>
          <SansText size={15} style={styles.emptyText}>No notifications yet.</SansText>
        </View>
      ) : (
        <>
          {renderSection('Today', today)}
          {earlier.length > 0 ? renderSection('Earlier', earlier) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  title: { marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionHeader: {
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    ...SavorShadow.card,
  },
  itemUnread: {
    backgroundColor: SavorColors.orangeSoft,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
