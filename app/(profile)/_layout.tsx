import { Tabs } from 'expo-router';

export default function ProfileTabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="AccountTab" />
      <Tabs.Screen name="OrdersTab" />
      <Tabs.Screen name="WishlistTab" />
      <Tabs.Screen name="PaymentTab" />
      <Tabs.Screen name="AddressesTab" />
      <Tabs.Screen name="NotificationsTab" />
      <Tabs.Screen name="SettingsTab" />
      <Tabs.Screen name="SellingTab" />
    </Tabs>
  );
}