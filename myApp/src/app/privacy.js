import { View, StyleSheet } from 'react-native';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius } from '../constants/savorTheme';

const SECTIONS = [
  {
    title: 'Data we collect',
    body: 'We collect your name, email, phone, delivery addresses, and order history to provide the service.',
  },
  {
    title: 'How we use it',
    body: 'Your data is used to process orders, improve recommendations, and send order updates. We never sell your personal data.',
  },
  {
    title: 'Your rights',
    body: 'You can request account deletion, export your data, or update preferences anytime in Settings.',
  },
];

export default function Privacy() {
  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Privacy & Security" />

      {SECTIONS.map((s) => (
        <View key={s.title} style={styles.block}>
          <SansText size={16} weight="semi" color={SavorColors.text}>{s.title}</SansText>
          <SansText size={14} style={styles.body}>{s.body}</SansText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  block: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginBottom: 12,
    gap: 8,
  },
  body: { lineHeight: 22 },
});
