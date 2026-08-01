import { Platform } from 'react-native';

export const SavorColors = {
  orange: '#E8500A',
  orangeDark: '#C94308',
  orangeSoft: '#FFE8DC',
  orangeLight: '#FFCBA4',
  peach: '#FFF0E8',
  brownDark: '#1A0F0A',
  brownTab: '#1B0D05',
  background: '#F2EBE5',
  backgroundInput: '#EDE4DC',
  card: '#FFFFFF',
  text: '#1A0F0A',
  textMuted: '#6B6057',
  textLight: '#A09088',
  border: '#E0D6CE',
  black: '#2A140A',
  success: '#E8F5E9',
  successText: '#2E7D32',
  white: '#FFFFFF',
};

export const SavorRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 30,
  full: 999,
};

export const SavorShadow = {
  card: Platform.select({
    web: {
      boxShadow: '0px 4px 12px rgba(26, 15, 10, 0.08)',
    },
    default: {
      shadowColor: '#1A0F0A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  }),
  tab: Platform.select({
    web: {
      boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.15)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 12,
    },
  }),
};

export const TAB_BAR_HEIGHT = 72;
