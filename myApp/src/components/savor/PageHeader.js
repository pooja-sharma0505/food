import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SerifText } from './SerifText';
import { SavorColors } from '../../constants/savorTheme';

export function PageHeader({ title, onBack }) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.back}
        onPress={onBack ?? (() => router.back())}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={24} color={SavorColors.text} />
      </TouchableOpacity>
      <SerifText size={24} style={styles.title}>
        {title}
      </SerifText>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SavorColors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { flex: 1, textAlign: 'center', marginHorizontal: 8 },
  spacer: { width: 40 },
});
