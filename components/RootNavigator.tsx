
import { router, Stack } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { useEffect } from 'react';

export function RootNavigator() {
  const { user, isReady } = usePrivy();

  useEffect(() => {
    if (!isReady) return;

    if (user) {
      router.replace('/');
    } else {
      router.replace('/sign-in');
    }
  }, [isReady, user]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
