import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SavorButton } from '../../components/savor/SavorButton';
import { Screen } from '../../components/savor/Screen';
import { SansText, SerifText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { showAlert } from '../../services/alertHelper';
import { addToCart, fetchCart, removeFromCart } from '../../services/api';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});
  const [notes, setNotes] = useState({});

  const loadCart = useCallback(() => {
    (async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (err) {
        console.error('Failed to load cart:', err.message);
        showAlert('Error', err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useFocusEffect(loadCart);

  // Update quantity: delta > 0 adds, delta < 0 removes
  const handleUpdate = async (id, delta) => {
    const item = cart.items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      // Remove the item entirely
      try {
        const data = await removeFromCart(id);
        setCart(data);
      } catch (err) {
        showAlert('Error', err.message);
      }
      return;
    }

    // Use the API to update quantity (POST adds to existing)
    try {
      const data = await addToCart(item.food_item_id, delta);
      setCart(data);
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      const data = await removeFromCart(id);
      setCart(data);
    } catch (err) {
      showAlert('Error', err.message);
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

  const toggleNotes = (itemId) => {
    setExpandedNotes((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const updateNote = (itemId, text) => {
    setNotes((prev) => ({ ...prev, [itemId]: text }));
  };

  const items = cart?.items || [];
  const subtotal = cart?.total || 0;
  const discount = promoApplied ? subtotal * 0.5 : 0;
  const deliveryFee = cart?.items?.[0]?.delivery_fee ? parseFloat(cart.items[0].delivery_fee) : 0;
  const total = subtotal - discount + deliveryFee;

  if (loading) {
    return (
      <Screen scroll padBottom contentStyle={styles.pad}>
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <View style={styles.titleRow}>
        <SerifText size={28}>Your Cart</SerifText>
        <Ionicons name="cart" size={24} color={SavorColors.orange} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={SavorColors.textLight} />
          <SansText size={15} style={styles.emptyText}>Your cart is empty. Add items from a restaurant!</SansText>
          <SavorButton label="Browse Restaurants" onPress={() => router.push('/tabs/explore')} variant="ghost" />
        </View>
      ) : (
        <>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.thumb}>
                <SansText size={24}>{item.category_icon || '🍽️'}</SansText>
              </View>
              <View style={styles.info}>
                <SansText size={15} weight="semi" color={SavorColors.text}>{item.food_name}</SansText>
                <SansText size={12}>{item.restaurant_name}</SansText>
                <SansText size={14} color={SavorColors.orange} weight="semi">
                  Rs {item.effective_price * item.quantity}
                </SansText>

                {/* Special Instructions */}
                <TouchableOpacity
                  onPress={() => toggleNotes(item.id)}
                  style={styles.noteToggle}
                  activeOpacity={0.7}
                >
                  <SansText size={12} color={SavorColors.textMuted} weight="medium">
                    {expandedNotes[item.id] ? 'Hide note' : 'Add a note'}
                  </SansText>
                </TouchableOpacity>
                {expandedNotes[item.id] ? (
                  <TextInput
                    style={styles.noteInput}
                    placeholder="e.g. no onions, extra spicy"
                    placeholderTextColor={SavorColors.textLight}
                    value={notes[item.id] || ''}
                    onChangeText={(text) => updateNote(item.id, text)}
                    multiline
                    maxLength={100}
                  />
                ) : null}
              </View>
              <View style={styles.qty}>
                <TouchableOpacity onPress={() => handleUpdate(item.id, -1)}>
                  <Ionicons name="remove" size={18} />
                </TouchableOpacity>
                <SansText weight="semi">{item.quantity}</SansText>
                <TouchableOpacity onPress={() => handleUpdate(item.id, 1)}>
                  <Ionicons name="add" size={18} color={SavorColors.orange} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
                  <Ionicons name="trash" size={16} color={SavorColors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Promo Code */}
          <View style={styles.promoCard}>
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
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <SansText size={14} color={SavorColors.textMuted}>Subtotal</SansText>
              <SansText size={14}>Rs {subtotal.toLocaleString('en-IN')}</SansText>
            </View>
            <View style={styles.summaryRow}>
              <SansText size={14} color={SavorColors.textMuted}>Delivery fee</SansText>
              <SansText size={14} color={SavorColors.successText}>
                {deliveryFee > 0 ? `Rs ${deliveryFee}` : 'Free'}
              </SansText>
            </View>
            {promoApplied ? (
              <View style={styles.summaryRow}>
                <SansText size={14} color={SavorColors.successText}>Discount (SAVOR50)</SansText>
                <SansText size={14} color={SavorColors.successText}>-Rs {discount.toLocaleString('en-IN')}</SansText>
              </View>
            ) : null}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <SansText size={16} weight="semi" color={SavorColors.text}>Total</SansText>
              <SerifText size={24} color={SavorColors.orange}>Rs {total.toLocaleString('en-IN')}</SerifText>
            </View>
          </View>

          <SavorButton
            label="Proceed to Checkout"
            variant="dark"
            onPress={() => router.push('/checkout')}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 10,
    ...SavorShadow.card,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1, gap: 2 },
  noteToggle: {
    marginTop: 6,
  },
  noteInput: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.md,
    padding: 10,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: SavorColors.text,
    marginTop: 6,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SavorColors.backgroundInput,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  removeBtn: { marginLeft: 4 },
  totalRow: { marginVertical: 20 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { textAlign: 'center', paddingHorizontal: 40 },
  // Promo
  promoCard: {
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
  summary: {
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 18,
    marginVertical: 20,
    gap: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: SavorColors.border,
    paddingTop: 12,
    marginTop: 8,
  },
});
