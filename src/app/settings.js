import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';

const LINKS = [
  { icon: 'person-outline', label: 'Edit Profile', route: '/edit-profile' },
  { icon: 'notifications-outline', label: 'Notifications', route: null },
  { icon: 'language-outline', label: 'Language', value: 'English' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Security', route: '/privacy' },
  { icon: 'help-circle-outline', label: 'Help & Support', route: '/help' },
  { icon: 'information-circle-outline', label: 'About Savor', route: '/about' },
];

export default function Settings() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call the API to delete the account
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Settings" />

      {/* Notifications Section */}
      <View style={styles.section}>
        <SansText size={12} color={SavorColors.textLight} weight="medium" style={styles.sectionHeader}>
          Notifications
        </SansText>
        <View style={styles.card}>
          <View style={[styles.toggleRow, styles.border]}>
            <SansText size={15} weight="medium" color={SavorColors.text}>Push notifications</SansText>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: SavorColors.orange }}
            />
          </View>
          <View style={styles.toggleRow}>
            <SansText size={15} weight="medium" color={SavorColors.text}>Promotional emails</SansText>
            <Switch
              value={promoEnabled}
              onValueChange={setPromoEnabled}
              trackColor={{ true: SavorColors.orange }}
            />
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <SansText size={12} color={SavorColors.textLight} weight="medium" style={styles.sectionHeader}>
          Preferences
        </SansText>
        <View style={styles.menu}>
          {LINKS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, i < LINKS.length - 1 && styles.border]}
              onPress={() => item.route && router.push(item.route)}
              disabled={!item.route && !item.value}
            >
              <Ionicons name={item.icon} size={22} color={SavorColors.textMuted} />
              <SansText size={15} weight="medium" color={SavorColors.text} style={styles.rowLabel}>
                {item.label}
              </SansText>
              {item.value ? (
                <SansText size={13}>{item.value}</SansText>
              ) : item.route ? (
                <Ionicons name="chevron-forward" size={20} color={SavorColors.textLight} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <SansText size={12} color={SavorColors.textLight} weight="medium" style={styles.sectionHeader}>
          Account
        </SansText>
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.row, styles.border]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={22} color={SavorColors.orange} />
            <SansText size={15} weight="medium" color={SavorColors.orange} style={styles.rowLabel}>
              Delete Account
            </SansText>
          </TouchableOpacity>
        </View>
      </View>

      <SavorButton
        label="Log out"
        variant="ghost"
        onPress={() => router.replace('/login')}
        style={styles.logout}
      />
      <SansText size={12} style={styles.version}>Savor v1.0.0</SansText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionHeader: {
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    ...SavorShadow.card,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  border: { borderBottomWidth: 1, borderBottomColor: SavorColors.border },
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
  rowLabel: { flex: 1 },
  logout: { marginTop: 24 },
  version: { textAlign: 'center', marginTop: 12, color: SavorColors.textLight },
});
