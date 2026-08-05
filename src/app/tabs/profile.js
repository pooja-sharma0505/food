import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/savor/Screen';
import { SansText, SerifText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { showAlert } from '../../services/alertHelper';
import { fetchProfile, logout } from '../../services/api';

const ACCOUNT_MENU = [
  { icon: 'receipt-outline', label: 'My Orders', route: '/orders' },
  { icon: 'heart-outline', label: 'Favourites', route: '/favourites' },
  { icon: 'location-outline', label: 'Saved Addresses', route: '/addresses' },
  { icon: 'card-outline', label: 'Payment Methods', route: '/payments' },
];

const APP_MENU = [
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
  { icon: 'help-circle-outline', label: 'Help & Support', route: '/help' },
  { icon: 'information-circle-outline', label: 'About Savor', route: '/about' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Security', route: '/privacy' },
];

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    (async () => {
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
    })();
  }, []);

  useFocusEffect(loadProfile);

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

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

  const renderMenuSection = (title, items) => (
    <View style={styles.menuSection}>
      <SansText size={12} color={SavorColors.textLight} weight="medium" style={styles.sectionHeader}>
        {title}
      </SansText>
      <View style={styles.menu}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.row, i < items.length - 1 && styles.border]}
            onPress={() => item.route && router.push(item.route)}
          >
            <Ionicons name={item.icon} size={22} color={SavorColors.textMuted} />
            <SansText size={15} weight="medium" color={SavorColors.text} style={styles.rowLabel}>
              {item.label}
            </SansText>
            <Ionicons name="chevron-forward" size={20} color={SavorColors.textLight} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Profile</SerifText>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <SansText size={28} color="#fff" weight="bold">{initials}</SansText>
        </View>
        <SerifText size={24}>{profile.name}</SerifText>
        <SansText size={14} color={SavorColors.textMuted}>{profile.email}</SansText>
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
            <SansText size={12} color={SavorColors.textMuted}>{s.label}</SansText>
          </TouchableOpacity>
        ))}
      </View>

      {renderMenuSection('Account', ACCOUNT_MENU)}
      {renderMenuSection('App', APP_MENU)}

      <TouchableOpacity
        style={styles.logoutRow}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={22} color={SavorColors.orange} />
        <SansText size={15} weight="medium" color={SavorColors.orange} style={styles.rowLabel}>
          Log out
        </SansText>
      </TouchableOpacity>
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
    gap: 4,
    ...SavorShadow.card,
  },
  menuSection: { marginBottom: 20 },
  sectionHeader: {
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    marginTop: 8,
    ...SavorShadow.card,
  },
});
