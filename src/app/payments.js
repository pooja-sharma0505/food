import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchPayments } from '../services/api';

export default function Payments() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectMode = params.select === 'true';
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payments:', err.message);
        showAlert('Error', err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSetDefault = (pm) => {
    showAlert('Set as Default', `Set "${pm.label}" as your default payment method?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Set Default', style: 'default' },
    ]);
  };

  const handleAddNew = () => {
    showAlert('Add Payment Method', 'Add a new payment method.', [{ text: 'OK' }]);
  };

  const handleSelect = (pm) => {
    if (selectMode) {
      router.back({ selectedPayment: pm });
    }
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
        <TouchableOpacity
          key={pm.id}
          style={[styles.card, pm.status === 'paid' && styles.cardDefault, selectMode && styles.cardSelectable]}
          onPress={() => handleSelect(pm)}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={paymentIcon[pm.payment_method] || 'card-outline'} size={24} color={SavorColors.orange} />
          </View>
          <View style={styles.info}>
            <SansText size={16} weight="semi" color={SavorColors.text}>{paymentLabel[pm.payment_method] || pm.payment_method}</SansText>
            <SansText size={13} color={SavorColors.textMuted}>Rs {pm.amount} · {pm.status}</SansText>
          </View>

          {selectMode ? (
            <View style={styles.radio}>
              <Ionicons name="radio-button" size={20} color={SavorColors.textLight} />
            </View>
          ) : pm.status === 'paid' ? (
            <Ionicons name="checkmark-circle" size={24} color={SavorColors.orange} />
          ) : (
            <TouchableOpacity onPress={() => handleSetDefault(pm)}>
              <SansText size={13} color={SavorColors.textMuted}>Set default</SansText>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      {!selectMode ? (
        <SavorButton label="+ Add Payment Method" variant="ghost" onPress={handleAddNew} style={styles.add} />
      ) : null}
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
  cardSelectable: {
    borderWidth: 2,
    borderColor: SavorColors.orange,
  },
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
  radio: {
    paddingLeft: 8,
  },
  add: { marginTop: 8 },
});
