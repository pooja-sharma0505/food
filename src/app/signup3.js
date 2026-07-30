import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { ProgressSteps } from '../components/savor/ProgressSteps';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius } from '../constants/savorTheme';
import { fetchProfile } from '../services/api';
import { showAlert } from '../services/alertHelper';

export default function Signup3() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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

  if (loading) {
    return (
      <AuthCard>
        <ProgressSteps step={3} />
        <SerifText size={26}>Delivery address</SerifText>
        <SansText size={14} style={styles.sub}>Step 3 of 3 — Where to deliver?</SansText>
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </AuthCard>
    );
  }

  const displayName = profile?.name || 'there';
  const displayEmail = profile?.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'R';

  return (
    <AuthCard>
      <ProgressSteps step={3} />
      <SerifText size={26}>Delivery address</SerifText>
      <SansText size={14} style={styles.sub}>Step 3 of 3 — Where to deliver?</SansText>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <SansText size={18} color="#fff" weight="bold">{avatarLetter}</SansText>
        </View>
        <View style={{ flex: 1 }}>
          <SansText weight="semi" color={SavorColors.text}>{displayName}</SansText>
          <SansText size={13}>{displayEmail}</SansText>
        </View>
        <TouchableOpacity onPress={() => router.push('/edit-profile')}>
          <SansText size={13} color={SavorColors.orange} weight="semi">Edit</SansText>
        </TouchableOpacity>
      </View>

      <SavorInput label="Flat / House no." placeholder="42, Sunrise Apartments" />
      <SavorInput label="Area / Street" placeholder="Subhash Nagar" focused />
      <View style={styles.row}>
        <View style={styles.half}>
          <SavorInput label="City" placeholder="Jaipur" />
        </View>
        <View style={styles.half}>
          <SavorInput label="Pincode" placeholder="302016" keyboardType="number-pad" />
        </View>
      </View>

      <SavorButton label="Create My Account" onPress={() => router.push('/success')} style={styles.btn} />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: 16, marginTop: 4 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.backgroundInput,
    padding: 14,
    borderRadius: SavorRadius.md,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  btn: { marginTop: 8 },
});
