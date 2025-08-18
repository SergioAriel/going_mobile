
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileTabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="AccountTab"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="AddressesTab"
        options={{
          title: 'Addresses',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map-marker" color={color} />,
        }}
      />
      <Tabs.Screen
        name="NotificationsTab"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="OrdersTab"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="PaymentTab"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="credit-card" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SellingTab"
        options={{
          title: 'Selling',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="tag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SettingsTab"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="WishlistTab"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
        }}
      />
    </Tabs>
  );
}
