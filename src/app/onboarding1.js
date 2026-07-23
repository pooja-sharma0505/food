import { useRouter } from 'expo-router';
import { OnboardingSlide } from '../components/savor/OnboardingSlide';

export default function Onboarding1() {
  const router = useRouter();
  return (
    <OnboardingSlide
      step={0}
      iconName="compass-outline"
      title={'Discover Local\nFlavors'}
      description="Browse hundreds of curated restaurants from the finest local chefs."
      buttonLabel="Next →"
      onNext={() => router.push('/onboarding2')}
    />
  );
}


