import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager, View } from 'react-native';
import { PageHeader } from '../components/savor/PageHeader';
import { Screen } from '../components/savor/Screen';
import { SansText } from '../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../constants/savorTheme';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = [
  { q: 'How do I track my order?', a: 'Go to Profile → My Orders or tap the notification when your order is on the way.' },
  { q: 'Can I cancel an order?', a: 'Orders can be cancelled within 2 minutes of placing. Contact support after that.' },
  { q: 'What payment methods are accepted?', a: 'UPI, cards, net banking, and cash on delivery.' },
  { q: 'How do I change my delivery address?', a: 'You can update your saved addresses in Profile → Saved Addresses.' },
  { q: 'Can I modify my order after placing it?', a: 'You can add special instructions or contact the restaurant directly through the order tracking screen.' },
];

const CONTACT = [
  { icon: 'chatbubble-ellipses-outline', label: 'Live chat', sub: 'Usually replies in 5 min' },
  { icon: 'call-outline', label: 'Call support', sub: '1800-123-4567' },
  { icon: 'mail-outline', label: 'Email us', sub: 'help@savor.app' },
];

export default function Help() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Screen scroll padBottom={false} contentStyle={styles.pad}>
      <PageHeader title="Help & Support" />

      {/* Contact Options */}
      {CONTACT.map((c) => (
        <TouchableOpacity key={c.label} style={styles.contact} activeOpacity={0.9}>
          <View style={styles.iconWrap}>
            <Ionicons name={c.icon} size={22} color={SavorColors.orange} />
          </View>
          <View>
            <SansText size={15} weight="semi" color={SavorColors.text}>{c.label}</SansText>
            <SansText size={13} color={SavorColors.textMuted}>{c.sub}</SansText>
          </View>
        </TouchableOpacity>
      ))}

      {/* FAQ Section */}
      <SansText size={16} weight="semi" color={SavorColors.text} style={styles.faqTitle}>
        FAQ
      </SansText>
      {FAQ.map((item, index) => {
        const isExpanded = expandedFaq === index;
        return (
          <View key={item.q} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.7}
            >
              <SansText size={15} weight="semi" color={SavorColors.text}>
                {item.q}
              </SansText>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={SavorColors.textMuted}
              />
            </TouchableOpacity>
            {isExpanded ? (
              <View style={styles.faqAnswer}>
                <SansText size={13} color={SavorColors.textMuted} style={styles.answerText}>
                  {item.a}
                </SansText>
              </View>
            ) : null}
          </View>
        );
      })}
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
  faqCard: {
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    marginBottom: 10,
    overflow: 'hidden',
    ...SavorShadow.card,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  answerText: {
    lineHeight: 20,
  },
});
