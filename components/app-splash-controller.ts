import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

export function AppSplashController() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
