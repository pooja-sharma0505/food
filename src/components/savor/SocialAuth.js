import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SansText } from './SerifText';
import { SavorColors, SavorRadius } from '../../constants/savorTheme';

const PROVIDERS = [
  { id: 'google', icon: 'logo-google', color: '#DB4437' },
  { id: 'facebook', icon: 'logo-facebook', color: '#1877F2' },
  { id: 'apple', icon: 'logo-apple', color: SavorColors.text },
];

export function SocialAuth() {
  return (
    <View>
      <SansText style={styles.or}>or</SansText>
      <View style={styles.row}>
        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.btn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Coming soon', `${p.id} sign-in will be available shortly.`)}
          >
            <Ionicons name={p.icon} size={22} color={p.color} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  or: { textAlign: 'center', marginVertical: 18 },
  row: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: SavorRadius.md,
    borderWidth: 1,
    borderColor: SavorColors.border,
    backgroundColor: SavorColors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
