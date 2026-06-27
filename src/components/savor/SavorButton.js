import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function SavorButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isDark = variant === 'dark';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isDark && styles.dark,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? SavorColors.orange : '#fff'} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.textLight,
            isDark && styles.textLight,
            isGhost && styles.textOrange,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: SavorRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: { backgroundColor: SavorColors.orange },
  dark: { backgroundColor: SavorColors.black },
  ghost: {
    backgroundColor: SavorColors.backgroundInput,
    borderWidth: 1,
    borderColor: SavorColors.border,
  },
  disabled: { opacity: 0.5 },
  text: { fontFamily: 'DMSans_600SemiBold', fontSize: 16 },
  textLight: { color: '#fff' },
  textOrange: { color: SavorColors.orange },
});
