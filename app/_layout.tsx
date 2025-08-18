import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProviders } from '@/components/app-providers';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useTrackLocations } from '@/hooks/use-track-locations';
import { AppSplashController } from '@/components/app-splash-controller';
import { PrivyElements } from '@privy-io/expo/ui';
import { SocketProvider } from '@/context/SocketContext';
import Header from '@/components/layout/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import react-query

SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  useTrackLocations((pathname, params) => {
    console.log(`Track ${pathname}`, { params });
  });

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppProviders>
          <SocketProvider>
            <AppSplashController />
            <Header />
            <Stack >

              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(profile)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <PrivyElements />
          </SocketProvider>
        </AppProviders>
        <PortalHost />
      </View>
    </QueryClientProvider>
  );
}