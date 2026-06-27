import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AuthCard } from '../components/savor/AuthCard';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SerifText, SansText } from '../components/savor/SerifText';
import { OtpInput } from '../components/savor/OtpInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors } from '../constants/savorTheme';

export default function OTP() {
  const router = useRouter();
  const [code, setCode] = useState('832');

  return (
    <AuthCard>
      <View style={styles.logoWrap}>
        <SavorLogo size={52} />
      </View>

      <SerifText size={26} style={styles.center}>OTP Verify</SerifText>
      <SansText size={14} style={styles.center}>Sent to +91 98765 43210</SansText>
      <SansText size={13} style={[styles.center, styles.hint]}>
        Enter the 4-digit code we sent to your phone
      </SansText>

      <OtpInput value={code} onChange={setCode} />

      <SavorButton label="Verify & Sign in" onPress={() => router.replace('/tabs/home')} />

      <SansText size={14} color={SavorColors.orange} weight="semi" style={styles.resend}>
        Resend in 0:24
      </SansText>

      <TouchableOpacity style={styles.alt} onPress={() => router.back()}>
        <SansText weight="medium">Use email instead</SansText>
      </TouchableOpacity>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignSelf: 'center', marginBottom: 20 },
  center: { textAlign: 'center', marginBottom: 4 },
  hint: { marginBottom: 24, marginTop: 8 },
  resend: { textAlign: 'center', marginTop: 16 },
  alt: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    alignItems: 'center',
  },
});
