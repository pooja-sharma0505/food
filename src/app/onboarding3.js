import { useRouter } from 'expo-router';
import { OnboardingSlide } from '../components/savor/OnboardingSlide';

export default function Onboarding3() {
  const router = useRouter();
  return (
    <OnboardingSlide
      step={2}
      imageUri="https://cdn-icons-png.flaticon.com/512/3159/3159066.png"
      title={'Exclusive Deals\nEvery Day'}
      description="Unlock member-only discounts, cashback, and free delivery passes."
      buttonLabel="Get Started 🎉"
      onNext={() => router.push('/login')}
    />
  );
}
