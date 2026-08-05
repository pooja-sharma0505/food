import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchAddresses, fetchCart, placeOrder } from '../services/api';

const PAYMENTS = ['upi', 'cash', 'card'];

export default function Checkout() {
  const router = useRouter();
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [summaryExpanded, setSummaryExpanded] = useState(false);

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

    setPlacing(true);
    try {
      const order = await placeOrder({
        restaurantId,
        addressId: selectedAddress.id,
        paymentMethod: payment,
      });

      // Navigate to order-placed with replace to prevent back navigation
      router.replace({
        pathname: '/order-placed',
        params: { orderId: order.id, orderNumber: order.order_number },
      });
    } catch (err) {
      showAlert('Error', err.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    if (promoCode.toUpperCase() === 'SAVOR50') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const subtotal = cart?.total || 0;
  const deliveryFee = cart?.items?.[0]?.delivery_fee ? parseFloat(cart.items[0].delivery_fee) : 0;
  const discount = promoApplied ? subtotal * 0.5 : 0;
  const tax = (subtotal + deliveryFee - discount) * 0.05;
  const total = subtotal + deliveryFee - discount + tax;

  const paymentLabel = {
    upi: 'UPI / PhonePay',
    cash: 'Cash on Delivery',
    card: 'Debit Card',
  };

  const paymentIcon = {
    upi: 'phone-portrait-outline',
    card: 'card-outline',
    cash: 'cash-outline',
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

      {/* Delivery Address */}
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

      {/* Payment Method */}
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
          <Ionicons name={paymentIcon[p]} size={20} color={SavorColors.textMuted} />
          <SansText size={14} weight="medium" color={SavorColors.text}>{paymentLabel[p]}</SansText>
        </TouchableOpacity>
      ))}

      {/* Promo Code */}
      <SansText size={14} weight="semi" color={SavorColors.text} style={styles.section}>
        Promo code
      </SansText>
      <View style={styles.promoRow}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promo code"
          placeholderTextColor={SavorColors.textLight}
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.promoBtn, promoApplied && styles.promoBtnApplied]}
          onPress={handleApplyPromo}
          activeOpacity={0.8}
        >
          <SansText size={13} weight="semi" color={SavorColors.white}>
            {promoApplied ? 'Applied!' : 'Apply'}
          </SansText>
        </TouchableOpacity>
      </View>
      {promoError ? (
        <SansText size={12} color={SavorColors.orange} style={styles.promoError}>
          {promoError}
        </SansText>
      ) : null}

      {/* Order Summary */}
      <SansText size={14} weight="semi" color={SavorColors.text} style={styles.section}>
        Order summary
      </SansText>
      <TouchableOpacity
        style={styles.summaryHeader}
        onPress={() => setSummaryExpanded(!summaryExpanded)}
        activeOpacity={0.7}
      >
        <SansText size={14} color={SavorColors.textMuted}>
          {cart?.items?.length || 0} items
        </SansText>
        <Ionicons
          name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={SavorColors.textMuted}
        />
      </TouchableOpacity>

      {summaryExpanded ? (
        <View style={styles.summaryItems}>
          {(cart?.items || []).map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <SansText size={13} color={SavorColors.textMuted}>
                {item.food_name} x{item.quantity}
              </SansText>
              <SansText size={13} weight="medium">
                Rs {(item.effective_price * item.quantity).toLocaleString('en-IN')}
              </SansText>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.summary}>
        <View style={styles.row}>
          <SansText>Subtotal</SansText>
          <SansText weight="medium">Rs {subtotal.toLocaleString('en-IN')}</SansText>
        </View>
        <View style={styles.row}>
          <SansText>Delivery</SansText>
          <SansText weight="medium" color={SavorColors.successText}>
            {deliveryFee > 0 ? `Rs ${deliveryFee}` : 'Free'}
          </SansText>
        </View>
        {promoApplied ? (
          <View style={styles.row}>
            <SansText color={SavorColors.successText}>Discount (SAVOR50)</SansText>
            <SansText weight="medium" color={SavorColors.successText}>
              -Rs {discount.toLocaleString('en-IN')}
            </SansText>
          </View>
        ) : null}
        <View style={styles.row}>
          <SansText>Tax (5%)</SansText>
          <SansText weight="medium">Rs {tax.toLocaleString('en-IN')}</SansText>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <SansText weight="semi" color={SavorColors.text}>Total</SansText>
          <SerifText size={22} color={SavorColors.orange}>Rs {total.toLocaleString('en-IN')}</SerifText>
        </View>
      </View>

      <SavorButton
        label={placing ? 'Placing order...' : `Place Order — Rs ${total.toLocaleString('en-IN')}`}
        variant="dark"
        onPress={handlePlaceOrder}
        disabled={placing}
        loading={placing}
      />
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
  // Promo
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 12,
    marginBottom: 8,
    gap: 8,
    ...SavorShadow.card,
  },
  promoInput: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: SavorColors.text,
    padding: 0,
  },
  promoBtn: {
    backgroundColor: SavorColors.orange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SavorRadius.pill,
  },
  promoBtnApplied: { backgroundColor: SavorColors.successText },
  promoError: { marginBottom: 8, marginLeft: 4 },
  // Summary
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 14,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  summaryItems: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 14,
    marginBottom: 8,
    gap: 8,
    ...SavorShadow.card,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 20,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: SavorColors.border,
    paddingTop: 12,
    marginTop: 8,
  },
});
