import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';

const MENU = [
  { icon: 'receipt-outline', label: 'My Orders', route: '/orders' },
  { icon: 'heart-outline', label: 'Favourites', route: '/favourites' },
  { icon: 'location-outline', label: 'Saved Addresses', route: '/addresses' },
  { icon: 'card-outline', label: 'Payment Methods', route: '/payments' },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
];

const STATS = [
  { value: '42', label: 'Orders', route: '/orders' },
  { value: '3', label: 'Reviews', route: '/review' },
  { value: 'Gold', label: 'Status', route: null },
];

export default function Profile() {
  const router = useRouter();

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <SansText size={28} color="#fff" weight="bold">R</SansText>
        </View>
        <SerifText size={24}>Rahul Sharma</SerifText>
        <SansText size={14}>rahul@gmail.com</SansText>
      </View>

      <View style={styles.stats}>
        {STATS.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={styles.statCard}
            disabled={!s.route}
            onPress={() => s.route && router.push(s.route)}
          >
            <SansText size={18} weight="bold" color={SavorColors.text}>{s.value}</SansText>
            <SansText size={12}>{s.label}</SansText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.menu}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.row, i < MENU.length - 1 && styles.border]}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={22} color={SavorColors.textMuted} />
            <SansText size={15} weight="medium" color={SavorColors.text} style={styles.rowLabel}>
              {item.label}
            </SansText>
            <Ionicons name="chevron-forward" size={20} color={SavorColors.textLight} />
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 16,
    alignItems: 'center',
    ...SavorShadow.card,
  },
  menu: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    ...SavorShadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  border: { borderBottomWidth: 1, borderBottomColor: SavorColors.border },
  rowLabel: { flex: 1 },
});
