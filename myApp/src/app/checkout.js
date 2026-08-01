import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchCart, fetchAddresses, placeOrder } from '../services/api';
import { showAlert } from '../services/alertHelper';

const PAYMENTS = ['upi', 'cash', 'card'];

export default function Checkout() {
  const router = useRouter();
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cartData, addrData] = await Promise.all([fetchCart(), fetchAddresses()]);
        setCart(cartData);
        setAddresses(addrData);
        if (addrData.length > 0) {
          const defaultAddr = addrData.find((a) => a.is_default) || addrData[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Failed to load checkout data:', err.message);
        showAlert('Error', err.message || 'Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showAlert('Error', 'Please select a delivery address.');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      showAlert('Error', 'Your cart is empty.');
      return;
    }

    // Get the restaurant_id from the first cart item
    const restaurantId = cart.items[0].restaurant_id;

    try {
      const order = await placeOrder({
        restaurantId,
        addressId: selectedAddress.id,
        paymentMethod: payment,
      });

      showAlert(
        'Order Placed',
        `Your order ${order.order_number} has been placed successfully.`,
        [{
          text: 'OK',
          onPress: () => router.push({
            pathname: '/order-placed',
            params: { orderId: order.id, orderNumber: order.order_number },
          }),
        }]
      );
    } catch (err) {
      showAlert('Error', err.message || 'Failed to place order.');
    }
  };

  const subtotal = cart?.total || 0;
  const deliveryFee = cart?.items?.[0]?.delivery_fee ? parseFloat(cart.items[0].delivery_fee) : 0;
  const total = subtotal + deliveryFee;

  const paymentLabel = {
    upi: 'UPI / PhonePay',
    cash: 'Cash on Delivery',
    card: 'Debit Card',
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Checkout" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Checkout" />

      <SansText size={14} weight="semi" color={SavorColors.text}>Delivery address</SansText>
      {selectedAddress ? (
        <View style={styles.addressCard}>
          <Ionicons name="home" size={22} color={SavorColors.orange} />
          <View style={{ flex: 1 }}>
            <SansText size={14} weight="medium" color={SavorColors.text}>{selectedAddress.label}</SansText>
            <SansText size={13}>{selectedAddress.address_line1}, {selectedAddress.city}</SansText>
          </View>
          <TouchableOpacity onPress={() => router.push('/addresses')}>
            <SansText size={13} color={SavorColors.orange} weight="semi">Change</SansText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addressCard}
          onPress={() => router.push('/addresses')}
        >
          <Ionicons name="add" size={22} color={SavorColors.orange} />
          <SansText size={14} color={SavorColors.text}>Add a delivery address</SansText>
        </TouchableOpacity>
      )}

      <SansText size={14} weight="semi" color={SavorColors.text} style={styles.section}>
        Payment method
      </SansText>
      {PAYMENTS.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.payCard, payment === p && styles.payActive]}
          onPress={() => setPayment(p)}
        >
          <View style={[styles.radio, payment === p && styles.radioOn]} />
          <SansText size={14} weight="medium" color={SavorColors.text}>{paymentLabel[p]}</SansText>
        </TouchableOpacity>
      ))}

      <View style={styles.summary}>
        <View style={styles.row}>
          <SansText>Subtotal</SansText>
          <SansText weight="medium">₹{subtotal.toLocaleString('en-IN')}</SansText>
        </View>
        <View style={styles.row}>
          <SansText>Delivery</SansText>
          <SansText weight="medium" color={SavorColors.successText}>
            {deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}
          </SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total</SansText>
          <SerifText size={22} color={SavorColors.orange}>₹{total.toLocaleString('en-IN')}</SerifText>
        </View>
      </View>

      <SavorButton label="Place Order" variant="dark" onPress={handlePlaceOrder} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  section: { marginTop: 20, marginBottom: 10 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginTop: 8,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.md,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  payActive: { borderColor: SavorColors.orange },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SavorColors.border,
  },
  radioOn: { borderColor: SavorColors.orange, backgroundColor: SavorColors.orange },
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 24,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: SavorColors.border },
});
