import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchProfile, updateProfile } from '../services/api';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfile();
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } catch (err) {
        console.error('Failed to load profile:', err.message);
        showAlert('Error', err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('Error', 'Name is required');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name, email, phone });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.back();
      }, 1500);
    } catch (err) {
      showAlert('Error', err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Screen scroll padBottom={false} keyboard contentStyle={styles.pad}>
      <PageHeader title="Edit Profile" />

      {/* Avatar with camera icon */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <SansText size={28} color="#fff" weight="bold">{initials}</SansText>
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color={SavorColors.white} />
          </View>
        </View>
      </View>

      <View style={styles.field}>
        <SansText size={13} color={SavorColors.text} weight="medium" style={styles.label}>
          Full name
        </SansText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={SavorColors.textLight}
        />
      </View>

      <View style={styles.field}>
        <SansText size={13} color={SavorColors.text} weight="medium" style={styles.label}>
          Email address
        </SansText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={SavorColors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <SansText size={13} color={SavorColors.text} weight="medium" style={styles.label}>
          Phone number
        </SansText>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone"
          placeholderTextColor={SavorColors.textLight}
          keyboardType="phone-pad"
        />
      </View>

      {saved ? (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color={SavorColors.successText} />
          <SansText size={14} color={SavorColors.successText} weight="medium">
            Profile saved successfully!
          </SansText>
        </View>
      ) : null}

      <SavorButton
        label={saving ? 'Saving...' : 'Save Changes'}
        onPress={handleSave}
        disabled={saving}
        loading={saving}
        style={styles.btn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SavorColors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: SavorColors.backgroundInput,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: SavorRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: SavorColors.text,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SavorColors.success,
    padding: 14,
    borderRadius: SavorRadius.md,
    marginBottom: 16,
  },
  btn: { marginTop: 8 },
});
