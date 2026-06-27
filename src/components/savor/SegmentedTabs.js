import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function SegmentedTabs({ options, value, onChange }) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.pill,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SavorRadius.pill,
  },
  tabActive: {
    backgroundColor: SavorColors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontFamily: 'DMSans_500Medium', fontSize: 14, color: SavorColors.textMuted },
  labelActive: { fontFamily: 'DMSans_600SemiBold', color: SavorColors.text },
});
