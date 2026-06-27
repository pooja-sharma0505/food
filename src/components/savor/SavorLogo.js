import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function SavorLogo({ size = 56, dark = false }) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.28 }, dark && styles.boxDark]}>
      <Ionicons name="restaurant" size={size * 0.45} color="#fff" />
    </View>
  );
}

export function SavorLogoEmoji({ size = 56 }) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Text style={{ fontSize: size * 0.45 }}>🍽️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxDark: {
    backgroundColor: SavorColors.orange,
  },
});
