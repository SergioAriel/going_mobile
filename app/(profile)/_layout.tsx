import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileTabLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'AccountTab') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        } else if (route.name === 'OrdersTab') {
          iconName = focused ? 'cube' : 'cube-outline';
        } else if (route.name === 'WishlistTab') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'PaymentTab') {
          iconName = focused ? 'card' : 'card-outline';
        } else if (route.name === 'AddressesTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'NotificationsTab') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'SettingsTab') {
          iconName = focused ? 'settings' : 'settings-outline';
        } else if (route.name === 'SellingTab') {
          iconName = focused ? 'pricetags' : 'pricetags-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tabs.Screen name="AccountTab" options={{ title: 'Account' }} />
      <Tabs.Screen name="OrdersTab" options={{ title: 'Orders' }} />
      <Tabs.Screen name="WishlistTab" options={{ title: 'Wishlist' }} />
      <Tabs.Screen name="PaymentTab" options={{ title: 'Payment' }} />
      <Tabs.Screen name="AddressesTab" options={{ title: 'Addresses' }} />
      <Tabs.Screen name="NotificationsTab" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="SettingsTab" options={{ title: 'Settings' }} />
      <Tabs.Screen name="SellingTab" options={{ title: 'Selling' }} />
    </Tabs>
  );
}