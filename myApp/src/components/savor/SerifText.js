import { Text } from 'react-native';
import { SavorColors } from '../../constants/savorTheme';

export function SerifText({ children, style, size = 28, color = SavorColors.text, ...rest }) {
  return (
    <Text
      style={[{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: size, color, lineHeight: size * 1.2 }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function SansText({ children, style, size = 15, color = SavorColors.textMuted, weight = 'regular', ...rest }) {
  const families = {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semi: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
  };
  return (
    <Text style={[{ fontFamily: families[weight], fontSize: size, color }, style]} {...rest}>
      {children}
    </Text>
  );
}
