import { View, StyleSheet } from 'react-native';
import { SavorColors } from '../../constants/savorTheme';

export function DotIndicator({ total = 3, active = 0 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.active]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4C9C0',
  },
  active: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: SavorColors.orange,
  },
});
