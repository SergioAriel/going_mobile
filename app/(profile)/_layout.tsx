import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';

export default function ProfileTabLayout() {
  const { userData } = useUser();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="AccountTab"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
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
        name="AddressesTab"
        options={{
          title: 'Addresses',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map-marker" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="SellingTab"
        options={{
          title: 'Selling',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="tag" color={color} />,
        }}
      />

      {/* Seller-specific tabs */}
      {userData?.isSeller && (
        <Tabs.Screen
          name="ShipmentsTab"
          options={{
            title: 'Shipments',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="truck" color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="SettingsTab"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}