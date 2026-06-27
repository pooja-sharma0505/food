// import { useRouter } from 'expo-router';
// import { OnboardingSlide } from '../components/savor/OnboardingSlide';

// export default function Onboarding2() {
//   const router = useRouter();
//   return (
//     <OnboardingSlide
//       step={1}
//       imageUri="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
//       title={'Fast &\nReliable Delivery'}
//       description="Track your order in real-time and get delivery in under 30 minutes."
//       buttonLabel="Next →"
//       onNext={() => router.push('/onboarding3')}
//     />
//   );
// }

import { useRoute } from "expo-router";
import { OnboardingSlide } from "../components/savor/OnboardingSlide";

export default function Onboarding2() {
  const router = useRoute();
  return (
    <OnboardingSlide 
    step={1}
    imageUri="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
    title={'Fast &\nReliabe Delivery'}
    description="Track your order in real-time and get delivery in under 30 minutes."
    buttonLabel= "Next"
    onNext={() => router.push('/onboarding3')}
    />
  );
}