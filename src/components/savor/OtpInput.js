import { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function OtpInput({ length = 4, value, onChange }) {
  const refs = useRef([]);

  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  const handleChange = (text, index) => {
    const clean = text.replace(/\D/g, '');
    const arr = digits.map((d) => (d === ' ' ? '' : d));
    arr[index] = clean.slice(-1);
    const next = arr.join('').trim();
    onChange(next);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <View style={styles.row}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          style={[styles.box, d.trim() && styles.boxFilled]}
          value={d.trim()}
          onChangeText={(t) => handleChange(t, i)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  box: {
    width: 64,
    height: 64,
    borderRadius: SavorRadius.md,
    borderWidth: 2,
    borderColor: SavorColors.border,
    backgroundColor: SavorColors.backgroundInput,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
    fontSize: 22,
    color: SavorColors.text,
  },
  boxFilled: { borderColor: SavorColors.orange, backgroundColor: SavorColors.card },
});
