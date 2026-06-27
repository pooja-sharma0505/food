import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';

export default function EditProfile() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} keyboard contentStyle={styles.pad}>
      <PageHeader title="Edit Profile" />

      <SavorInput label="Full name" defaultValue="Rahul Sharma" />
      <SavorInput label="Email address" defaultValue="rahul@gmail.com" keyboardType="email-address" focused />
      <SavorInput label="Phone number" defaultValue="+91 98765 43210" keyboardType="phone-pad" />

      <SavorButton label="Save Changes" onPress={() => router.back()} style={styles.btn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  btn: { marginTop: 12 },
});
