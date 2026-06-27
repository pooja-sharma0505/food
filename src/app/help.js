import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/savor/Screen';
import { PageHeader } from '../components/savor/PageHeader';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';

const FAQ = [
  { q: 'How do I track my order?', a: 'Go to Profile → My Orders or tap the notification when your order is on the way.' },
  { q: 'Can I cancel an order?', a: 'Orders can be cancelled within 2 minutes of placing. Contact support after that.' },
  { q: 'What payment methods are accepted?', a: 'UPI, cards, net banking, and cash on delivery.' },
];

const CONTACT = [
  { icon: 'chatbubble-ellipses-outline', label: 'Live chat', sub: 'Usually replies in 5 min' },
  { icon: 'call-outline', label: 'Call support', sub: '1800-123-4567' },
  { icon: 'mail-outline', label: 'Email us', sub: 'help@savor.app' },
];

export default function Help() {
  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Help & Support" />

      {CONTACT.map((c) => (
        <TouchableOpacity key={c.label} style={styles.contact} activeOpacity={0.9}>
          <View style={styles.iconWrap}>
            <Ionicons name={c.icon} size={22} color={SavorColors.orange} />
          </View>
          <View>
            <SansText size={15} weight="semi" color={SavorColors.text}>{c.label}</SansText>
            <SansText size={13}>{c.sub}</SansText>
          </View>
        </TouchableOpacity>
      ))}

      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.faqTitle}>
        FAQ
      </SansText>
      {FAQ.map((item) => (
        <View key={item.q} style={styles.faq}>
          <SansText size={15} weight="semi" color={SavorColors.text}>{item.q}</SansText>
          <SansText size={13} style={styles.answer}>{item.a}</SansText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingBottom: 40 },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginBottom: 10,
    ...SavorShadow.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SavorColors.orangeSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqTitle: { marginTop: 20, marginBottom: 12 },
  faq: {
    backgroundColor: SavorColors.card,
    padding: 16,
    borderRadius: SavorRadius.lg,
    marginBottom: 10,
    gap: 8,
    ...SavorShadow.card,
  },
  answer: { lineHeight: 20 },
});
