import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';
import { SansText } from './SerifText';

export function SavorInput({ label, style, onFocus, onBlur, error, rightIcon, ...props }) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.wrap}>
      {label ? (
        <SansText size={13} color={SavorColors.text} weight="medium" style={styles.label}>
          {label}
        </SansText>
      ) : null}
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={SavorColors.textLight}
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
            rightIcon && styles.inputWithIcon,
            style,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <SansText size={12} color={SavorColors.orange} style={styles.error}>
          {error}
        </SansText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
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
  inputWithIcon: {
    paddingRight: 46,
  },
  inputFocused: {
    backgroundColor: SavorColors.card,
    borderColor: SavorColors.orange,
  },
  inputError: {
    borderColor: SavorColors.orange,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
  },
  error: {
    marginTop: 4,
    marginLeft: 4,
  },
});
