import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchPayments } from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payments:', err.message);
        Alert.alert('Error', err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSetDefault = (pm) => {
    Alert.alert('Set as Default', `Set "${pm.label}" as your default payment method?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Set Default', style: 'default' },
    ]);
  };

  const handleAddNew = () => {
    Alert.alert('Add Payment Method', 'Add a new payment method.', [{ text: 'OK' }]);
  };

  const paymentLabel = {
    upi: 'UPI / PhonePay',
    card: 'Debit Card',
    cash: 'Cash on Delivery',
  };

  const paymentIcon = {
    upi: 'phone-portrait-outline',
    card: 'card-outline',
    cash: 'cash-outline',
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Payment Methods" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Payment Methods" />

      {payments.map((pm) => (
        <View key={pm.id} style={[styles.card, pm.status === 'paid' && styles.cardDefault]}>
          <View style={styles.iconWrap}>
            <Ionicons name={paymentIcon[pm.payment_method] || 'card-outline'} size={24} color={SavorColors.orange} />
          </View>
          <View style={styles.info}>
            <SansText size={16} weight="semi" color={SavorColors.text}>{paymentLabel[pm.payment_method] || pm.payment_method}</SansText>
            <SansText size={13}>Rs {pm.amount} · {pm.status}</SansText>
          </View>
          {pm.status === 'paid' ? (
            <Ionicons name="checkmark-circle" size={24} color={SavorColors.orange} />
          ) : (
            <TouchableOpacity onPress={() => handleSetDefault(pm)}>
              <SansText size={13} color={SavorColors.textMuted}>Set default</SansText>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <SavorButton label="+ Add Payment Method" variant="ghost" onPress={handleAddNew} style={styles.add} />
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
