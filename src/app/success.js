import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { useSignupStore } from '../hooks/useSignupStore';

export default function Success() {
  const router = useRouter();
  const { data } = useSignupStore();
  const firstName = data.name ? data.name.split(' ')[0] : 'Rahul';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <View style={styles.check}>
          <Ionicons name="checkmark-circle" size={64} color={SavorColors.successText} />
        </View>

        <SerifText size={28} style={styles.center}>You're all set, {firstName}!</SerifText>
        <SansText size={15} style={[styles.center, styles.sub]}>
          Your Savor account is ready. Start exploring curated flavors near you.
        </SansText>

        <View style={styles.coupon}>
          <SansText size={12} weight="medium" color={SavorColors.textMuted}>
            Welcome coupon
          </SansText>
          <SerifText size={32} color={SavorColors.orange}>SAVOR50</SerifText>
          <SansText size={14}>50% off your first order</SansText>
        </View>

        <SavorButton label="Start Exploring" onPress={() => router.replace('/tabs/home')} />
        <SansText
          size={14}
          color={SavorColors.textMuted}
          style={styles.skip}
          onPress={() => router.replace('/tabs/home')}
        >
          Skip for now
        </SansText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SavorColors.background, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.xl,
    padding: 28,
    ...SavorShadow.card,
  },
  check: { alignSelf: 'center', marginBottom: 16 },
  center: { textAlign: 'center' },
  sub: { marginTop: 8, marginBottom: 24, lineHeight: 22 },
  coupon: {
    backgroundColor: SavorColors.orangeSoft,
    borderRadius: SavorRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  skip: { textAlign: 'center', marginTop: 16 },
});
