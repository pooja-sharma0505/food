import { View, StyleSheet } from 'react-native';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function ProgressSteps({ step, total = 3 }) {
  const pct = `${(step / total) * 100}%`;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: pct }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.full,
    marginBottom: 22,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: SavorColors.orange,
    borderRadius: SavorRadius.full,
  },
});
