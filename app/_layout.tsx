import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProviders } from '@/components/app-providers';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useTrackLocations } from '@/hooks/use-track-locations';
import { AppSplashController } from '@/components/app-splash-controller';
import { usePrivy } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SocketProvider } from '@/context/SocketContext';
import { SolanaProvider } from '@/context/SolanaContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Use this hook to track the locations for analytics or debugging.
  // Delete if you don't need it.
  useTrackLocations((pathname, params) => {
    console.log(`Track ${pathname}`, { params });
  });
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    console.log('onLayoutRootView');
    if (loaded) {
      console.log('loaded');
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <View style={{ flex: 1 }}
        onLayout={onLayoutRootView}
      >
        <AppProviders>
          <SocketProvider>
            <SolanaProvider>
              <Header />
              <AppSplashController />
              <RootNavigator />
              <Footer />
              <StatusBar style="auto" />
              <PrivyElements />
            </SolanaProvider>
          </SocketProvider>
        </AppProviders>
        <PortalHost />
      </View>
    </>
  );
}

function RootNavigator() {
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