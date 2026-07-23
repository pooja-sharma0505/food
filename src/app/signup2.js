import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { ProgressSteps } from '../components/savor/ProgressSteps';
import { SavorButton } from '../components/savor/SavorButton';
import { FOOD_PREFS, DIET_TAGS } from '../data/mockData';
import { SavorColors, SavorRadius } from '../constants/savorTheme';
import { useSignupStore } from '../hooks/useSignupStore';

export default function Signup2() {
  const router = useRouter();
  const { data, update } = useSignupStore();

  const toggle = (id) => {
    update({
      preferences: data.preferences.includes(id)
        ? data.preferences.filter((x) => x !== id)
        : [...data.preferences, id],
    });
  };

  return (
    <AuthCard>
      <ProgressSteps step={2} />
      <SerifText size={26}>Your preferences</SerifText>
      <SansText size={14} style={styles.sub}>Step 2 of 3 — What do you love?</SansText>

      <View style={styles.grid}>
        {FOOD_PREFS.map((item) => {
          const on = data.preferences.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.prefCard, on && styles.prefActive]}
              onPress={() => toggle(item.id)}
            >
              <SansText size={28}>{item.icon}</SansText>
              <SansText size={14} weight={on ? 'semi' : 'regular'} color={SavorColors.text}>
                {item.label}
              </SansText>
            </TouchableOpacity>
          );
        })}
      </View>

      <SansText size={14} weight="medium" color={SavorColors.text} style={styles.dietLabel}>
        Dietary preference
      </SansText>
      <View style={styles.dietRow}>
        {DIET_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.dietTag, data.diet === tag && styles.dietActive]}
            onPress={() => update({ diet: tag })}
          >
            <SansText size={13} weight={data.diet === tag ? 'semi' : 'regular'} color={SavorColors.text}>
              {tag}
            </SansText>
          </TouchableOpacity>
        ))}
      </View>

      <SavorButton label="Continue →" onPress={() => router.push('/signup3')} style={styles.btn} />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: 16, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  prefCard: {
    width: '48%',
    padding: 16,
    borderRadius: SavorRadius.lg,
    borderWidth: 1.5,
    borderColor: SavorColors.border,
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  prefActive: { borderColor: SavorColors.orange, backgroundColor: SavorColors.orangeSoft },
  dietLabel: { marginTop: 16, marginBottom: 10 },
  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  dietTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SavorRadius.pill,
    borderWidth: 1,
    borderColor: SavorColors.border,
  },
  dietActive: { borderColor: SavorColors.orange, backgroundColor: SavorColors.orangeSoft },
  btn: { marginTop: 12 },
});
