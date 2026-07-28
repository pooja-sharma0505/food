import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AuthCard } from '../components/savor/AuthCard';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SegmentedTabs } from '../components/savor/SegmentedTabs';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SocialAuth } from '../components/savor/SocialAuth';
import { SavorColors } from '../constants/savorTheme';
import { login } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        router.replace('/tabs/home');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Something went wrong.');
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
            focused
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <SavorInput
            label="Password"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
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
