import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/savor/Screen';
import { SerifText, SansText } from '../../components/savor/SerifText';
import { SavorColors, SavorRadius, SavorShadow } from '../../constants/savorTheme';
import { NOTIFICATIONS } from '../../data/mockData';

export default function Alerts() {
  const router = useRouter();

  return (
    <Screen scroll padBottom contentStyle={styles.pad}>
      <SerifText size={32} style={styles.title}>Notifications</SerifText>

      {NOTIFICATIONS.map((n) => (
        <TouchableOpacity
          key={n.id}
          style={styles.item}
          activeOpacity={0.9}
          onPress={() => {
            if (n.id === '1') router.push('/tracking');
            if (n.id === '3') router.push('/review');
            if (n.id === '2') router.push('/favourites');
          }}
        >
          <View style={styles.iconBox}>
            <SansText size={22}>{n.icon}</SansText>
          </View>
          <View style={styles.body}>
            <SansText size={15} weight="semi" color={SavorColors.text}>{n.title}</SansText>
            <SansText size={13} numberOfLines={2}>{n.body}</SansText>
            <SansText size={12} color={SavorColors.textLight}>{n.time}</SansText>
          </View>
          {n.unread ? <View style={styles.dot} /> : null}
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 4 },
  title: { marginBottom: 20 },
  item: {
    flexDirection: 'row',
    backgroundColor: SavorColors.card,
    borderRadius: SavorRadius.lg,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    ...SavorShadow.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: SavorColors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  body: { flex: 1, gap: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SavorColors.orange,
    marginTop: 6,
  },
});
