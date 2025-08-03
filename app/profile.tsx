
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tabs = [
  { id: "account", name: "My Account", icon: "user" },
  { id: "orders", name: "Orders", icon: "shoppingcart" },
  { id: "wishlist", name: "Wishlist", icon: "hearto" },
  { id: "payment", name: "Associated Wallets", icon: "creditcard" },
  { id: "addresses", name: "Addresses", icon: "enviromento" },
  { id: "selling", name: "My Products", icon: "tago" },
  { id: "settings", name: "Settings", icon: "setting" },
];

const ProfileScreen = () => {
  const { userData, logout } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  const router = useRouter();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab />;
      case 'orders':
        return <OrdersTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'payment':
        return <PaymentTab />;
      case 'addresses':
        return <AddressesTab />;
      case 'selling':
        return <SellingTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <AccountTab />;
    }
  };

  return (
    <AppPage>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Image source={{ uri: userData.avatar || 'https://via.placeholder.com/100' }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            <View style={{ marginLeft: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userData.name}</Text>
              <Text style={{ color: '#666' }}>{userData.email}</Text>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: activeTab === tab.id ? '#14BFFB' : '#eee' }}
              >
                <AntDesign name={tab.icon} size={24} color={activeTab === tab.id ? '#14BFFB' : '#333'} />
                <Text style={{ marginLeft: 15, fontSize: 16, color: activeTab === tab.id ? '#14BFFB' : '#333' }}>{tab.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
              <AntDesign name="logout" size={24} color="red" />
              <Text style={{ marginLeft: 15, fontSize: 16, color: 'red' }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </AppPage>
  );
};

const AccountTab = () => <View><Text>Account Details</Text></View>;
const OrdersTab = () => <View><Text>My Orders</Text></View>;
const WishlistTab = () => <View><Text>My Wishlist</Text></View>;
const PaymentTab = () => <View><Text>Payment Methods</Text></View>;
const AddressesTab = () => <View><Text>My Addresses</Text></View>;
const SellingTab = () => <View><Text>My Products for Sale</Text></View>;
const SettingsTab = () => <View><Text>App Settings</Text></View>;

export default ProfileScreen;
