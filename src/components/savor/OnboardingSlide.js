import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';
import { DotIndicator } from './DotIndicator';
import { SavorButton } from './SavorButton';
import { SansText, SerifText } from './SerifText';

export function OnboardingSlide({ iconName, title, description, step, total = 3, buttonLabel, onNext, onSkip }) {
  const isLast = step === total - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.imageBox}>
          <Ionicons name={iconName} size={100} color={SavorColors.orange} />
        </View>

        <SerifText size={30} style={styles.title}>
          {title}
        </SerifText>

        <SansText size={15} style={styles.desc}>
          {description}
        </SansText>

        <View style={styles.dots}>
          <DotIndicator total={total} active={step} />
        </View>

        <View style={styles.bottomRow}>
          {!isLast ? (
            <TouchableOpacity onPress={onSkip} hitSlop={12}>
              <SansText size={14} color={SavorColors.textMuted} weight="medium">
                Skip
              </SansText>
            </TouchableOpacity>
          ) : <View style={styles.skipPlaceholder} />}

          <SavorButton
            label={buttonLabel}
            onPress={onNext}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SavorColors.peach },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    width: '100%',
    height: 240,
    backgroundColor: SavorColors.orangeLight,
    borderRadius: SavorRadius.lg,
    marginBottom: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { textAlign: 'center', marginBottom: 12 },
  desc: { textAlign: 'center', lineHeight: 24, marginBottom: 28, paddingHorizontal: 8 },
  dots: { marginBottom: 28 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  skipPlaceholder: { width: 60 },
  button: { flex: 1, minWidth: 140 },
});