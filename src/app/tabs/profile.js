import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { fetchProfile } from '../../services/api';
import { showAlert } from '../../services/alertHelper';

const MENU = [
  { icon: 'receipt-outline', label: 'My Orders', route: '/orders' },
  { icon: 'heart-outline', label: 'Favourites', route: '/favourites' },
  { icon: 'location-outline', label: 'Saved Addresses', route: '/addresses' },
  { icon: 'card-outline', label: 'Payment Methods', route: '/payments' },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
];

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = router.addListener('focus', loadProfile);
    return unsubscribe;
  }, [router]);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err.message);
      showAlert('Error', err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll padBottom contentStyle={styles.pad}>
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen scroll padBottom contentStyle={styles.pad}>
        <SerifText size={32} style={styles.title}>Profile</SerifText>
        <SansText>No profile data available.</SansText>
      </Screen>
    );
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const STATS = [
    { value: String(profile.order_count || 0), label: 'Orders', route: '/orders' },
    { value: String(profile.review_count || 0), label: 'Reviews', route: '/review' },
    { value: profile.status || 'Bronze', label: 'Status', route: null },
  ];

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Profile</SerifText>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <SansText size={28} color="#fff" weight="bold">{initials}</SansText>
        </View>
        <SerifText size={24}>{profile.name}</SerifText>
        <SansText size={14}>{profile.email}</SansText>
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
  title: { marginBottom: 20 },
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
