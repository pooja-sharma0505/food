import { View, StyleSheet } from 'react-native';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorLogo } from '../components/savor/SavorLogo';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius } from '../constants/savorTheme';

export default function About() {
  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="About Savor" />

      <View style={styles.hero}>
        <SavorLogo size={80} />
        <SerifText size={28} style={styles.name}>Savor</SerifText>
        <SansText size={14}>Version 1.0.0</SansText>
      </View>

      <SansText size={15} style={styles.body}>
        Savor brings restaurant-quality food to your doorstep. Discover local chefs, track deliveries in
        real time, and enjoy exclusive member deals every day.
      </SansText>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <SansText size={20} weight="bold" color={SavorColors.text}>500+</SansText>
          <SansText size={12}>Restaurants</SansText>
        </View>
        <View style={styles.stat}>
          <SansText size={20} weight="bold" color={SavorColors.text}>50k+</SansText>
          <SansText size={12}>Happy users</SansText>
        </View>
        <View style={styles.stat}>
          <SansText size={20} weight="bold" color={SavorColors.text}>4.8</SansText>
          <SansText size={12}>App rating</SansText>
        </View>
      </View>

      <SansText size={12} style={styles.copy}>© 2026 Savor Food Delivery. All rights reserved.</SansText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 24, gap: 8 },
  name: { marginTop: 12 },
  body: { lineHeight: 24, textAlign: 'center', marginBottom: 28 },
  stats: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 20,
    marginBottom: 32,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  copy: { textAlign: 'center', color: SavorColors.textLight },
});
