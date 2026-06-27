import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SavorColors } from '../constants/savorTheme';

export default function Splash() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <SavorLogo size={72} />
        <SerifText size={36} color="#fff" style={styles.title}>
          Savor{'\n'}Every Bite
        </SerifText>
        <SansText size={15} color={SavorColors.textLight} style={styles.subtitle}>
          Restaurant-quality food delivered to your door
        </SansText>
      </View>

      <View style={styles.footer}>
        <SavorButton label="Get Started" onPress={() => router.push('/onboarding1')} />
        <SansText size={14} color={SavorColors.textLight} style={styles.bottom}>
          Already a member?{' '}
          <SansText
            size={14}
            color={SavorColors.orange}
            weight="semi"
            onPress={() => router.push('/login')}
          >
            Sign in
          </SansText>
        </SansText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SavorColors.brownDark,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { textAlign: 'center', marginTop: 28, marginBottom: 12 },
  subtitle: { textAlign: 'center', lineHeight: 24, paddingHorizontal: 12 },
  footer: { gap: 16, alignItems: 'center' },
  bottom: { textAlign: 'center' },
});
