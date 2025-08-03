
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useCart } from '@/context';
import { useUser } from '@/context';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useUser();
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image source={require('@/assets/images/logo.svg')} style={{ width: 100, height: 40, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.push('/products')} style={{ marginRight: 15 }}>
          <Text>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/categories')} style={{ marginRight: 15 }}>
          <Text>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/offers')} style={{ marginRight: 15 }}>
          <Text>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginRight: 15 }}>
          <AntDesign name="user" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/cart')} style={{ position: 'relative' }}>
          <AntDesign name="shoppingcart" size={24} color="#333" />
          {getTotalItems() > 0 && (
            <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#14BFFB', borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 12 }}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
        {user && (
          <TouchableOpacity onPress={logout} style={{ marginLeft: 15 }}>
            <AntDesign name="logout" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
