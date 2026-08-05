import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SavorColors } from '../../constants/savorTheme';

export function StarRating({ rating = 0, size = 24, editable = false, onRate }) {
  const [tempRating, setTempRating] = useState(rating);

  const handlePress = (star) => {
    if (editable) {
      setTempRating(star);
      onRate?.(star);
    }
  };

  const handleHover = (star) => {
    if (editable) {
      setTempRating(star);
    }
  };

  const handleLeave = () => {
    if (editable) {
      setTempRating(rating);
    }
  };

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (editable ? tempRating : rating);
        return (
          <TouchableOpacity
            key={star}
            onPress={() => handlePress(star)}
            onPressIn={() => handleHover(star)}
            onPressOut={handleLeave}
            activeOpacity={editable ? 0.7 : 1}
          >
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? SavorColors.orange : SavorColors.textLight}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
