import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { ADDRESSES } from '../data/mockData';

export default function Addresses() {
  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Saved Addresses" />

      {ADDRESSES.map((addr) => (
        <View key={addr.id} style={[styles.card, addr.default && styles.cardDefault]}>
          <View style={styles.iconWrap}>
            <Ionicons name={addr.icon} size={22} color={SavorColors.orange} />
          </View>
          <View style={styles.info}>
            <View style={styles.labelRow}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{addr.label}</SansText>
              {addr.default ? (
                <View style={styles.defaultBadge}>
                  <SansText size={10} color={SavorColors.orange} weight="semi">DEFAULT</SansText>
                </View>
              ) : null}
            </View>
            <SansText size={13}>{addr.line1}</SansText>
            <SansText size={13}>{addr.line2} — {addr.pin}</SansText>
          </View>
          <TouchableOpacity>
            <SansText size={13} color={SavorColors.orange} weight="semi">Edit</SansText>
          </TouchableOpacity>
        </View>
      ))}

      <SavorButton label="+ Add New Address" variant="ghost" onPress={() => {}} style={styles.add} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1, gap: 2 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  defaultBadge: {
    backgroundColor: SavorColors.orangeSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  add: { marginTop: 8 },
});
