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
import { PrivyElements, usePrivy } from '@privy-io/expo';

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
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProviders>
        <AppSplashController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AppProviders>
      <PortalHost />
    </View>
  );
}

function RootNavigator() {
  const { user, isReady } = usePrivy();

  if (!isReady) {
    // TODO: we can return a loading indicator here
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="HomeScreen" />
        <Stack.Screen name="CategoriesScreen" />
        <Stack.Screen name="ProductsScreen" />
        <Stack.Screen name="ProductDetailScreen" />
        <Stack.Screen name="CartScreen" />
        <Stack.Screen name="CheckoutScreen" />
        <Stack.Screen name="DeliveryScreen" />
        <Stack.Screen name="OffersScreen" />
        <Stack.Screen name="OrderScreen" />
        <Stack.Screen name="ProfileScreen" />
        <Stack.Screen name="UploadProductScreen" />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
