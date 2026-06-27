import { View, TextInput, StyleSheet } from 'react-native';
import { SansText } from './SerifText';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function SavorInput({ label, focused, style, ...props }) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <SansText size={13} color={SavorColors.text} weight="medium" style={styles.label}>
          {label}
        </SansText>
      ) : null}
      <TextInput
        placeholderTextColor={SavorColors.textLight}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { marginBottom: 6 },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: SavorColors.backgroundInput,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: SavorRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: SavorColors.text,
  },
  inputFocused: {
    backgroundColor: SavorColors.card,
    borderColor: SavorColors.orange,
  },
});
