import { View, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';

const DISHES = [
  { name: 'Margherita Pizza', emoji: '🍕', stars: '⭐⭐⭐⭐½' },
  { name: 'Caesar Salad', emoji: '🥗', stars: '⭐⭐⭐⭐⭐' },
];

export default function Review() {
  const router = useRouter();

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Rate your order" />
      <SansText size={14} style={styles.sub}>How was your experience?</SansText>

      <SansText size={36} style={styles.stars}>⭐⭐⭐⭐☆</SansText>

      <TextInput
        style={styles.input}
        multiline
        defaultValue="The pizza was absolutely delicious! Crispy crust and fresh toppings. Will order again!"
        placeholderTextColor={SavorColors.textLight}
      />

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Rate each dish
      </SansText>

      {DISHES.map((d) => (
        <View key={d.name} style={styles.dish}>
          <SansText size={16}>{d.emoji} {d.name}</SansText>
          <SansText size={14}>{d.stars}</SansText>
        </View>
      ))}

      <SavorButton label="Submit Review" onPress={() => router.replace('/tabs/home')} style={styles.btn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  sub: { marginTop: 6, marginBottom: 16 },
  stars: { marginBottom: 20 },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 16,
    minHeight: 110,
    textAlignVertical: 'top',
    color: SavorColors.text,
    marginBottom: 24,
  },
  section: { marginBottom: 12 },
  dish: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  btn: { marginTop: 24 },
});
