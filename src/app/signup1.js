import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { ProgressSteps } from '../components/savor/ProgressSteps';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';
import { signup } from '../services/api';
import { showAlert } from '../services/alertHelper';

export default function Signup1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name || !email || !password) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const data = await signup(name, email, password);
      if (data.success) {
        // Navigate to step 2 (preferences)
        router.push('/signup2');
      } else {
        showAlert('Signup Failed', data.message || 'Something went wrong.');
      }
    } catch (err) {
      showAlert('Signup Failed', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <ProgressSteps step={1} />
      <SerifText size={26}>Create account</SerifText>
      <SansText size={14} style={styles.sub}>Step 1 of 3 — Basic info</SansText>
      <SavorInput
        label="Full name"
        placeholder="Rahul Sharma"
        style={styles.field}
        value={name}
        onChangeText={setName}
      />
      <SavorInput
        label="Email address"
        placeholder="rahul@gmail.com"
        focused
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <SavorInput
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <SavorButton
        label={loading ? 'Creating...' : 'Continue →'}
        onPress={handleContinue}
        disabled={loading}
        loading={loading}
        style={styles.btn}
      />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: 20, marginTop: 4 },
  field: { marginTop: 8 },
  btn: { marginTop: 8 },
});
