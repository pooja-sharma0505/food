import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { SansText, SerifText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { addToCart, fetchFoods } from '../services/api';

export default function ItemDetail() {
  const router = useRouter();
  const { name = 'Margherita Pizza', price = 'Rs 320', emoji = '🍕', foodItemId } = useLocalSearchParams();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [foodItem, setFoodItem] = useState(null);

  // Fetch food item details if foodItemId is provided
  useEffect(() => {
    if (foodItemId) {
      (async () => {
        try {
          const foods = await fetchFoods();
          const item = foods.find((f) => String(f.id) === String(foodItemId));
          if (item) setFoodItem(item);
        } catch (err) {
          console.error('Failed to fetch food item:', err.message);
        }
      })();
    }
  }, [foodItemId]);

  // Calculate price based on quantity
  const getBasePrice = () => {
    if (foodItem) {
      const basePrice = foodItem.discount_price && foodItem.discount_price > 0
        ? foodItem.discount_price
        : foodItem.price;
      return basePrice * qty;
    }
    // Fallback: parse from price string
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    return numericPrice * qty;
  };

  const totalPrice = getBasePrice();

  const handleAddToCart = async () => {
    if (!foodItemId) {
      // No food item ID — just navigate to cart
      router.push('/tabs/cart');
      return;
    }
    setAdding(true);
    try {
      await addToCart(foodItemId, qty, specialInstructions);
      router.push('/tabs/cart');
    } catch (err) {
      showAlert('Error', err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const displayName = foodItem?.name || name;
  const displayPrice = foodItem
    ? `Rs ${foodItem.discount_price && foodItem.discount_price > 0 ? foodItem.discount_price : foodItem.price}`
    : price;
  const displayEmoji = foodItem?.category_icon || emoji;
  const displayRestaurant = foodItem?.restaurant_name || 'Restaurant';
  const displayDescription = foodItem?.description || 'A delicious dish from our kitchen.';
  const displayTime = foodItem?.preparation_time || 20;
  const displayCalories = foodItem?.calories || (foodItem?.preparation_time ? `${foodItem.preparation_time * 25}` : '—');
  const displayRating = foodItem?.rating || '—';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <PageHeader title="Item" />
        <View style={styles.hero}>
          <SansText size={80}>{displayEmoji}</SansText>
        </View>

        <SerifText size={26}>{displayName}</SerifText>
        <SansText size={14} style={styles.sub}>{displayRestaurant} · Classic Italian</SansText>

        <View style={styles.stats}>
          {[
            { label: 'Time', val: `${displayTime}m` },
            { label: 'Cal', val: displayCalories },
            { label: 'Rate', val: displayRating },
            { label: 'Price', val: displayPrice },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <SansText size={11} color={SavorColors.textLight}>{s.label}</SansText>
              <SansText size={14} weight="semi" color={SavorColors.text}>{s.val}</SansText>
            </View>
          ))}
        </View>

        <SansText size={14} style={styles.desc}>
          {displayDescription}
        </SansText>

        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
            <SansText size={20} weight="semi">−</SansText>
          </TouchableOpacity>
          <SansText size={20} weight="bold">{qty}</SansText>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
            <SansText size={20} weight="semi" color={SavorColors.orange}>+</SansText>
          </TouchableOpacity>
          <SansText size={16} weight="semi" color={SavorColors.orange} style={styles.eq}>
            = Rs {totalPrice.toLocaleString('en-IN')}
          </SansText>
        </View>

        {/* Special Instructions */}
        <View style={styles.instructions}>
          <SansText size={14} weight="medium" color={SavorColors.text} style={styles.instructionsLabel}>
            Special instructions
          </SansText>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g. no onions, extra spicy"
            placeholderTextColor={SavorColors.textLight}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            maxLength={100}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <SavorButton
          label={`Add to Cart – Rs ${totalPrice.toLocaleString('en-IN')}`}
          onPress={handleAddToCart}
          loading={adding}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SavorColors.background },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  hero: {
    height: 200,
    backgroundColor: SavorColors.orangeLight,
    borderRadius: SavorRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sub: { marginTop: 6, marginBottom: 16 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  stat: {
    flex: 1,
    backgroundColor: SavorColors.card,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  desc: { lineHeight: 22, marginBottom: 20 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.md,
    padding: 14,
    gap: 16,
    marginBottom: 20,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eq: { marginLeft: 'auto' },
  instructions: {
    marginBottom: 20,
  },
  instructionsLabel: {
    marginBottom: 8,
  },
  instructionsInput: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.md,
    padding: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: SavorColors.text,
  },
  footer: { padding: 20, paddingBottom: 8 },
});
