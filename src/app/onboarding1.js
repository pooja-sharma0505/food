import { useRouter } from 'expo-router';
import { OnboardingSlide } from '../components/savor/OnboardingSlide';

export default function Onboarding1() {
  const router = useRouter();
  return (
    <OnboardingSlide
      step={0}
      imageUri="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
      title={'Discover Local\nFlavors'}
      description="Browse hundreds of curated restaurants from the finest local chefs."
      buttonLabel="Next →"
      onNext={() => router.push('/onboarding2')}
    />
  );
}


