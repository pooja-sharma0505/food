import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { PAYMENT_METHODS } from '../data/mockData';

export default function Payments() {
  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Payment Methods" />

      {PAYMENT_METHODS.map((pm) => (
        <View key={pm.id} style={[styles.card, pm.default && styles.cardDefault]}>
          <View style={styles.iconWrap}>
            <Ionicons name={pm.icon} size={24} color={SavorColors.orange} />
          </View>
          <View style={styles.info}>
            <SansText size={16} weight="semi" color={SavorColors.text}>{pm.label}</SansText>
            <SansText size={13}>{pm.detail}</SansText>
          </View>
          {pm.default ? (
            <Ionicons name="checkmark-circle" size={24} color={SavorColors.orange} />
          ) : (
            <TouchableOpacity>
              <SansText size={13} color={SavorColors.textMuted}>Set default</SansText>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <SavorButton label="+ Add Payment Method" variant="ghost" onPress={() => {}} style={styles.add} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SavorShadow.card,
  },
  cardDefault: { borderColor: SavorColors.orange },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: { flex: 1, gap: 2 },
  add: { marginTop: 8 },
});
