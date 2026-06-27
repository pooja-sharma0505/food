import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

export function useSavorFonts() {
  const [loaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  return {
    loaded,
    serif: 'PlayfairDisplay_700Bold',
    serifSemi: 'PlayfairDisplay_600SemiBold',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansSemi: 'DMSans_600SemiBold',
    sansBold: 'DMSans_700Bold',
  };
}
