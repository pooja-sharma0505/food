import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors } from '../constants/savorTheme';

export default function NotFound() {
  const router = useRouter();

  return (
    <Screen contentStyle={styles.container} padBottom={false}>
      <View style={styles.content}>
        <SansText size={56}>🍽️</SansText>
        <SerifText size={30} style={styles.title}>
          Page not found
        </SerifText>
        <SansText size={15} style={styles.desc}>
          This screen does not exist or the route was changed.
        </SansText>
      </View>

      <SavorButton label="Go to Home" onPress={() => router.replace('/tabs/home')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', gap: 24 },
  content: { alignItems: 'center', gap: 10, marginBottom: 8 },
  title: { textAlign: 'center' },
  desc: { textAlign: 'center', color: SavorColors.textMuted, paddingHorizontal: 20 },
});
