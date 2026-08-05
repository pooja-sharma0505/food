import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { SavorButton } from '../components/savor/SavorButton';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { StarRating } from '../components/savor/StarRating';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';
import { showAlert } from '../services/alertHelper';
import { fetchOrderById } from '../services/api';

export default function Review() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [reviewText, setReviewText] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallRating, setOverallRating] = useState(0);
  const [dishRatings, setDishRatings] = useState({});

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
          id: item.id,
          name: item.food_name,
          emoji: '🍽️',
          rating: 0,
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

  const handleDishRate = (dishId, stars) => {
    setDishRatings((prev) => ({ ...prev, [dishId]: stars }));
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, rating: stars } : d))
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0) {
      showAlert('Error', 'Please select a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      showAlert('Error', 'Please write a review.');
      return;
    }
    // In a real app, this would submit to the API
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

      {/* Interactive Star Rating */}
      <View style={styles.starsContainer}>
        <StarRating
          rating={overallRating}
          size={36}
          editable={true}
          onRate={setOverallRating}
        />
        <SansText size={14} color={SavorColors.textMuted} style={styles.ratingLabel}>
          {overallRating === 0 ? 'Tap to rate' : `${overallRating} star${overallRating !== 1 ? 's' : ''}`}
        </SansText>
      </View>

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
        <View key={d.id} style={styles.dish}>
          <View style={styles.dishInfo}>
            <SansText size={16}>{d.emoji} {d.name}</SansText>
            <StarRating
              rating={d.rating}
              size={20}
              editable={true}
              onRate={(stars) => handleDishRate(d.id, stars)}
            />
          </View>
        </View>
      ))}

      <SavorButton
        label="Submit Review"
        onPress={handleSubmit}
        disabled={overallRating === 0}
        style={styles.btn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  sub: { marginTop: 6, marginBottom: 16 },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  ratingLabel: {
    fontSize: 14,
  },
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
  dishInfo: {
    flex: 1,
    gap: 8,
  },
  btn: { marginTop: 24 },
});
