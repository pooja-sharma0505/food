import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifText, SansText } from './SerifText';
import { SavorButton } from './SavorButton';
import { DotIndicator } from './DotIndicator';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function OnboardingSlide({ imageUri, title, description, step, total, buttonLabel, onNext }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.imageBox}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
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

        <SavorButton label={buttonLabel} onPress={onNext} />
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
  image: { width: 140, height: 140 },
  title: { textAlign: 'center', marginBottom: 12 },
  desc: { textAlign: 'center', lineHeight: 24, marginBottom: 28, paddingHorizontal: 8 },
  dots: { marginBottom: 28 },
});
