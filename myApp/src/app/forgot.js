import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius } from '../constants/savorTheme';

export default function Forgot() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  return (
    <AuthCard>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={28} color="#fff" />
      </View>

      <SerifText size={26} style={styles.center}>Reset password</SerifText>
      <SansText size={14} style={[styles.center, styles.desc]}>
        Enter your registered email and we'll send you a reset link.
      </SansText>

      <SavorInput label="Email address" defaultValue="rahul@gmail.com" focused keyboardType="email-address" />

      <SavorButton label="Send Reset Link" onPress={() => setSent(true)} style={styles.btn} />

      <SavorButton label="← Back to Sign in" variant="ghost" onPress={() => router.push('/login')} />

      {sent ? (
        <View style={styles.success}>
          <Ionicons name="checkmark-circle" size={20} color={SavorColors.successText} />
          <SansText size={13} color={SavorColors.successText} style={styles.successText}>
            Reset link sent! Check your inbox.
          </SansText>
        </View>
      ) : null}
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  center: { textAlign: 'center' },
  desc: { marginBottom: 20, marginTop: 8, lineHeight: 22 },
  btn: { marginBottom: 12 },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SavorColors.success,
    padding: 14,
    borderRadius: SavorRadius.md,
    marginTop: 16,
  },
  successText: { flex: 1 },
});
