import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchAddresses } from '../services/api';
import { showAlert } from '../services/alertHelper';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAddresses();
        setAddresses(data);
      } catch (err) {
        console.error('Failed to load addresses:', err.message);
        showAlert('Error', err.message || 'Failed to load addresses');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = (addr) => {
    showAlert('Edit Address', `Edit "${addr.label}" address.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK' },
    ]);
  };

  const handleAddNew = () => {
    showAlert('Add Address', 'Add a new delivery address.', [{ text: 'OK' }]);
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Saved Addresses" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Saved Addresses" />

      {addresses.map((addr) => (
        <View key={addr.id} style={[styles.card, addr.is_default && styles.cardDefault]}>
          <View style={styles.iconWrap}>
            <Ionicons name={addr.label === 'Home' ? 'home' : 'briefcase'} size={22} color={SavorColors.orange} />
          </View>
          <View style={styles.info}>
            <View style={styles.labelRow}>
              <SansText size={16} weight="semi" color={SavorColors.text}>{addr.label}</SansText>
              {addr.is_default ? (
                <View style={styles.defaultBadge}>
                  <SansText size={10} color={SavorColors.orange} weight="semi">DEFAULT</SansText>
                </View>
              ) : null}
            </View>
            <SansText size={13}>{addr.address_line1}</SansText>
            <SansText size={13}>{addr.address_line2} — {addr.postal_code}</SansText>
          </View>
          <TouchableOpacity onPress={() => handleEdit(addr)}>
            <SansText size={13} color={SavorColors.orange} weight="semi">Edit</SansText>
          </TouchableOpacity>
        </View>
      ))}

      <SavorButton label="+ Add New Address" variant="ghost" onPress={handleAddNew} style={styles.add} />
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
