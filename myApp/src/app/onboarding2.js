import { useRouter } from 'expo-router';
import { OnboardingSlide } from '../components/savor/OnboardingSlide';

export default function Onboarding2() {
  const router = useRouter();
  return (
    <OnboardingSlide
      step={1}
      iconName="bicycle-outline"
      title={'Fast &\nReliable Delivery'}
      description="Track your order in real-time and get delivery in under 30 minutes."
      buttonLabel="Next →"
      onNext={() => router.push('/onboarding3')}
    />
  );
}