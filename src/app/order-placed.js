import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius } from '../constants/savorTheme';

export default function OrderPlaced() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <SansText size={48}>🎉</SansText>
        </View>
        <SerifText size={32} style={styles.center}>Order placed!</SerifText>
        <View style={styles.badge}>
          <SansText size={13} weight="medium" color={SavorColors.textMuted}>
            Order #ORD-8820
          </SansText>
        </View>
        <SansText size={15} style={[styles.center, styles.desc]}>
          Your food is being prepared.{'\n'}Estimated delivery: 7:45 PM
        </SansText>
        <SavorButton label="📍  Track My Order" onPress={() => router.push('/tracking')} />
        <SansText
          size={14}
          color={SavorColors.textMuted}
          style={styles.link}
          onPress={() => router.replace('/tabs/home')}
        >
          Back to Home
        </SansText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SavorColors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  center: { textAlign: 'center' },
  badge: {
    backgroundColor: SavorColors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SavorRadius.pill,
    marginTop: 12,
    marginBottom: 16,
  },
  desc: { lineHeight: 24, marginBottom: 28 },
  link: { marginTop: 20 },
});
