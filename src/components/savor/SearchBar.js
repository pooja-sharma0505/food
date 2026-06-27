import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

export function SearchBar({ placeholder, value, onChangeText, style, editable = true, pointerEvents }) {
  return (
    <View style={[styles.wrap, style]} pointerEvents={pointerEvents}>
      <Ionicons name="search" size={20} color={SavorColors.textMuted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={SavorColors.textLight}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: SavorColors.text,
    padding: 0,
  },
});
