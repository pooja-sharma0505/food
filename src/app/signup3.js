import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthCard } from '../components/savor/AuthCard';
import { SerifText, SansText } from '../components/savor/SerifText';
import { ProgressSteps } from '../components/savor/ProgressSteps';
import { SavorInput } from '../components/savor/SavorInput';
import { SavorButton } from '../components/savor/SavorButton';
import { SavorColors, SavorRadius } from '../constants/savorTheme';
import { useSignupStore } from '../hooks/useSignupStore';

export default function Signup3() {
  const router = useRouter();
  const { data, update } = useSignupStore();

  return (
    <AuthCard>
      <ProgressSteps step={3} />
      <SerifText size={26}>Delivery address</SerifText>
      <SansText size={14} style={styles.sub}>Step 3 of 3 — Where to deliver?</SansText>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <SansText size={18} color="#fff" weight="bold">
            {data.name ? data.name.charAt(0).toUpperCase() : 'R'}
          </SansText>
        </View>
        <View style={{ flex: 1 }}>
          <SansText weight="semi" color={SavorColors.text}>{data.name || 'Rahul Sharma'}</SansText>
          <SansText size={13}>{data.email || 'rahul@gmail.com'}</SansText>
        </View>
        <TouchableOpacity onPress={() => router.push('/edit-profile')}>
          <SansText size={13} color={SavorColors.orange} weight="semi">Edit</SansText>
        </TouchableOpacity>
      </View>

      <SavorInput
        label="Flat / House no."
        value={data.flat}
        onChangeText={(t) => update({ flat: t })}
        placeholder="42, Sunrise Apartments"
      />
      <SavorInput
        label="Area / Street"
        value={data.area}
        onChangeText={(t) => update({ area: t })}
        placeholder="Subhash Nagar"
        focused
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <SavorInput
            label="City"
            value={data.city}
            onChangeText={(t) => update({ city: t })}
            placeholder="Jaipur"
          />
        </View>
        <View style={styles.half}>
          <SavorInput
            label="Pincode"
            value={data.pincode}
            onChangeText={(t) => update({ pincode: t })}
            placeholder="302016"
            keyboardType="number-pad"
          />
        </View>
      </View>

      <SavorButton label="Create My Account" onPress={() => router.push('/success')} style={styles.btn} />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: 16, marginTop: 4 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SavorColors.backgroundInput,
    padding: 14,
    borderRadius: SavorRadius.md,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SavorColors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  btn: { marginTop: 8 },
});
