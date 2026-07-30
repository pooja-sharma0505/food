import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorButton } from '../../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { fetchCart, addToCart, removeFromCart } from '../../services/api';
import { showAlert } from '../../services/alertHelper';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err.message);
      showAlert('Error', err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = router.addListener('focus', loadCart);
    return unsubscribe;
  }, [router]);

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

  const items = cart?.items || [];
  const total = cart?.total || 0;

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
        </View>
      ) : (
        items.map((item) => (
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
        ))
      )}

      <View style={styles.totalRow}>
        <SansText size={14} color={SavorColors.textMuted}>Total</SansText>
        <SerifText size={32}>Rs {total.toLocaleString('en-IN')}</SerifText>
      </View>

      <SavorButton
        label="Proceed to Checkout"
        variant="dark"
        onPress={() => router.push('/checkout')}
        disabled={items.length === 0}
      />
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
});
