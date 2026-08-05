import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AuthCard } from '../components/savor/AuthCard';
import { OtpInput } from '../components/savor/OtpInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors } from '../constants/savorTheme';

const CORRECT_CODE = '8321';
const RESEND_COOLDOWN = 30;

export default function OTP() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const intervalRef = useRef(null);

  // Start countdown on mount
  useEffect(() => {
    startCountdown();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === 4) {
      // Small delay to let user see the last digit
      const timer = setTimeout(() => {
        handleVerify(code);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [code]);

  const startCountdown = () => {
    setResendCountdown(RESEND_COOLDOWN);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async (enteredCode) => {
    if (enteredCode !== CORRECT_CODE) {
      setError('Incorrect code. Please try again.');
      setCode('');
      // Focus first input after a brief delay
      setTimeout(() => {
        // The OtpInput component will reset focus internally
      }, 100);
      return;
    }

    setError('');
    setVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setVerifying(false);
      router.replace('/tabs/home');
    }, 800);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setCode('');
    setError('');
    startCountdown();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

      <OtpInput value={code} onChange={setCode} error={!!error} />

      {error ? (
        <SansText size={13} color={SavorColors.orange} style={styles.errorText}>
          {error}
        </SansText>
      ) : null}

      <SavorButton
        label={verifying ? 'Verifying...' : 'Verify & Sign in'}
        onPress={() => handleVerify(code)}
        disabled={verifying || code.length < 4}
        loading={verifying}
      />

      <TouchableOpacity onPress={handleResend} disabled={resendCountdown > 0} activeOpacity={0.7}>
        <SansText
          size={14}
          color={resendCountdown > 0 ? SavorColors.textLight : SavorColors.orange}
          weight="semi"
          style={styles.resend}
        >
          {resendCountdown > 0 ? `Resend in ${formatTime(resendCountdown)}` : 'Resend code'}
        </SansText>
      </TouchableOpacity>

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
  errorText: { textAlign: 'center', marginBottom: 8 },
  resend: { textAlign: 'center', marginTop: 16 },
  alt: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    alignItems: 'center',
  },
});
