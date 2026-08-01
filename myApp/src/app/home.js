import { useEffect } from 'react';
import { useRouter } from 'expo-router';

/** Old GreenBite screen — redirects to the real Savor home tab. */
export default function LegacyHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tabs/home');
  }, [router]);

  return null;
}
