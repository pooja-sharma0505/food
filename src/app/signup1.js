import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { ProgressSteps } from '../components/savor/ProgressSteps';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';

export default function Signup1() {
  const router = useRouter();
  return (
    <AuthCard>
      <ProgressSteps step={1} />
      <SerifText size={26}>Create account</SerifText>
      <SansText size={14} style={styles.sub}>Step 1 of 3 — Basic info</SansText>
      <SavorInput label="Full name" placeholder="Rahul Sharma" style={styles.field} />
      <SavorInput label="Email address" placeholder="rahul@gmail.com" focused keyboardType="email-address" />
      <SavorInput label="Password" placeholder="••••••••" secureTextEntry />
      <SavorButton label="Continue →" onPress={() => router.push('/signup2')} style={styles.btn} />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: 20, marginTop: 4 },
  field: { marginTop: 8 },
  btn: { marginTop: 8 },
});
