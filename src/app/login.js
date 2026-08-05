import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AuthCard } from '../components/savor/AuthCard';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SegmentedTabs } from '../components/savor/SegmentedTabs';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SocialAuth } from '../components/savor/SocialAuth';
import { SavorColors } from '../constants/savorTheme';
import { login } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        router.replace('/tabs/home');
      } else {
        setPasswordError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <View style={styles.logoWrap}>
        <SavorLogo size={52} />
      </View>

      <SerifText size={26} style={styles.center}>Welcome back</SerifText>
      <SansText size={14} style={styles.center}>Sign in to continue</SansText>

      <SegmentedTabs
        options={[
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'email' ? (
        <>
          <SavorInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          <SavorInput
            label="Password"
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={SavorColors.textMuted} />
              </TouchableOpacity>
            }
          />
        </>
      ) : (
        <SavorInput label="Phone number" placeholder="+91 98765 43210" keyboardType="phone-pad" />
      )}

      <TouchableOpacity onPress={() => router.push('/forgot')} style={styles.forgotWrap}>
        <SansText size={13} color={SavorColors.orange} weight="semi">
          Forgot password?
        </SansText>
      </TouchableOpacity>

      <SavorButton
        label={loading ? 'Signing in...' : 'Sign in'}
        onPress={handleLogin}
        disabled={loading}
        loading={loading}
        style={styles.btn}
      />

      <SocialAuth />

      <SansText size={14} style={styles.bottom}>
        No account?{' '}
        <SansText size={14} color={SavorColors.orange} weight="semi" onPress={() => router.push('/signup1')}>
          Sign up
        </SansText>
      </SansText>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignSelf: 'center', marginBottom: 20 },
  center: { textAlign: 'center', marginBottom: 4 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 8, marginTop: -4 },
  btn: { marginTop: 4 },
  bottom: { textAlign: 'center', marginTop: 8 },
});
