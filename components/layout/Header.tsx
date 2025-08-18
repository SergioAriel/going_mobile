
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useCart, useUser } from '@/context';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-white">
      <View className="flex-row justify-between items-center border-b border-gray-200 px-2 h-16">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image source={require('@/assets/images/logo.png')} className="w-24 h-10" style={{ resizeMode: 'contain' }} />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push('/(profile)/AccountTab')} className="mr-4">
            <AntDesign name="user" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart')} className="relative">
            <AntDesign name="shoppingcart" size={24} color="#333" />
            {getTotalItems() > 0 && (
              <View className="absolute -top-1 -right-1 bg-blue-400 rounded-full w-5 h-5 justify-center items-center">
                <Text className="text-white text-xs">{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
          {user && (
            <TouchableOpacity onPress={logout} className="ml-4">
              <AntDesign name="logout" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;
