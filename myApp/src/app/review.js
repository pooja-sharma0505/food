import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SerifText, SansText } from '../components/savor/SerifText';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { fetchOrderById } from '../services/api';
import { showAlert } from '../services/alertHelper';

export default function Review() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [reviewText, setReviewText] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      showAlert('Error', 'No order ID provided.');
      router.back();
      return;
    }
    (async () => {
      try {
        const order = await fetchOrderById(orderId);
        const items = (order.order_items || []).map((item) => ({
          name: item.food_name,
          emoji: '🍽️',
          stars: '⭐⭐⭐⭐☆',
        }));
        setDishes(items);
      } catch (err) {
        console.error('Failed to load order:', err.message);
        showAlert('Error', err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      return;
    }
    router.replace('/tabs/home');
  };

  if (loading) {
    return (
      <Screen scroll padBottom={false} contentStyle={styles.pad}>
        <PageHeader title="Rate your order" />
        <ActivityIndicator size="large" color={SavorColors.orange} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Rate your order" />
      <SansText size={14} style={styles.sub}>How was your experience?</SansText>

      <SansText size={36} style={styles.stars}>⭐⭐⭐⭐☆</SansText>

      <TextInput
        style={styles.input}
        multiline
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Tell us about your experience..."
        placeholderTextColor={SavorColors.textLight}
      />

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.section}>
        Rate each dish
      </SansText>

      {dishes.map((d) => (
        <View key={d.name} style={styles.dish}>
          <SansText size={16}>{d.emoji} {d.name}</SansText>
          <SansText size={14}>{d.stars}</SansText>
        </View>
      ))}

      <SavorButton label="Submit Review" onPress={handleSubmit} style={styles.btn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  sub: { marginTop: 6, marginBottom: 16 },
  stars: { marginBottom: 20 },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    backgroundColor: SavorColors.backgroundInput,
    borderRadius: SavorRadius.lg,
    padding: 16,
    minHeight: 110,
    textAlignVertical: 'top',
    color: SavorColors.text,
    marginBottom: 24,
  },
  section: { marginBottom: 12 },
  dish: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginBottom: 8,
    ...SavorShadow.card,
  },
  btn: { marginTop: 24 },
});
