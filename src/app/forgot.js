import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthCard } from '../components/savor/AuthCard';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorInput } from '../components/savor/SavorInput';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors } from '../constants/savorTheme';

export default function Forgot() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('rahul@gmail.com');
  const [emailError, setEmailError] = useState('');

  const validate = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    setSent(true);
  };

  return (
    <AuthCard>
      {!sent ? (
        <>
          <View style={styles.iconWrap}>
            <Ionicons name="lock-closed" size={28} color="#fff" />
          </View>

          <SerifText size={26} style={styles.center}>Reset password</SerifText>
          <SansText size={14} style={[styles.center, styles.desc]}>
            Enter your registered email and we'll send you a reset link.
          </SansText>

          <SavorInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <SavorButton label="Send Reset Link" onPress={handleSend} style={styles.btn} />

          <SavorButton label="← Back to Sign in" variant="ghost" onPress={() => router.push('/login')} />
        </>
      ) : (
        <>
          <View style={styles.iconWrap}>
            <Ionicons name="checkmark-circle" size={40} color={SavorColors.successText} />
          </View>

          <SerifText size={26} style={styles.center}>Check your email</SerifText>
          <SansText size={14} style={[styles.center, styles.desc]}>
            We've sent a password reset link to {email}. Check your inbox and follow the instructions.
          </SansText>

          <SavorButton label="Back to Sign in" onPress={() => router.push('/login')} />
        </>
      )}
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
});
