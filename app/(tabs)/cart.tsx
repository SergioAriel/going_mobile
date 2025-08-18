
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart, useCurrencies } from '@/context';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/app-text';

const CartScreen = () => {
  const { items, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart();
  const { userCurrency, listCryptoCurrencies } = useCurrencies();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const total = items.reduce((total, product) => {
      const priceProductToDollar = listCryptoCurrencies.find(currency => currency.symbol === product.currency);
      const convertedPrice = ((priceProductToDollar?.price || 0) * (product?.price || 1)) / (userCurrency.price || 1);
      return total + (convertedPrice * product.quantity);
    }, 0);
    setTotalPrice(total);
  }, [items, listCryptoCurrencies, userCurrency]);

  if (items.length === 0) {
    return (
      <View style={{ flex: 1 }}>

        <AppPage className="flex-1 justify-center items-center p-5">
          <AntDesign name="shoppingcart" size={50} color="#ccc" />
          <AppText type="title" className="my-5">Your cart is empty</AppText>
          <TouchableOpacity onPress={() => router.push('/products')} className="bg-primary p-4 rounded-lg">
            <AppText className="text-white text-lg font-bold">Continue Shopping</AppText>
          </TouchableOpacity>
        </AppPage>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      <AppPage>
        <ScrollView className="p-5">
          <AppText type="title" className="mb-5">Your Cart</AppText>
          {items.map((item) => (
            <View key={item._id.toString()} className="flex-row mb-5 border-b border-gray-200 pb-5">
              <Image source={{ uri: item.mainImage || '/imageNotFound.svg' }} className="w-20 h-20 rounded-lg" />
              <View className="flex-1 ml-3">
                <AppText type="defaultSemiBold">{item.name}</AppText>
                <AppText className="text-gray-600">{item.currency}{(item.price || 0).toFixed(2)}</AppText>
                <View className="flex-row items-center mt-3">
                  <TouchableOpacity onPress={() => updateQuantity(item._id.toString(), item.quantity - 1)} className="p-1.5 bg-gray-200 rounded-md">
                    <AntDesign name="minus" size={18} color="#333" />
                  </TouchableOpacity>
                  <AppText className="mx-3">{item.quantity}</AppText>
                  <TouchableOpacity onPress={() => updateQuantity(item._id.toString(), item.quantity + 1)} className="p-1.5 bg-gray-200 rounded-md">
                    <AntDesign name="plus" size={18} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="items-end">
                <AppText type="defaultSemiBold">{item.currency}{(item.price * item.quantity).toFixed(2)}</AppText>
                <TouchableOpacity onPress={() => removeFromCart(item._id.toString())} className="mt-3">
                  <AntDesign name="closecircleo" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View className="mt-5">
            <View className="flex-row justify-between mb-3">
              <AppText>Subtotal ({getTotalItems()} items)</AppText>
              <AppText>{userCurrency.currency}{totalPrice.toFixed(2)}</AppText>
            </View>
            <TouchableOpacity onPress={() => router.push('/checkout')} className="bg-primary p-4 rounded-lg items-center mt-5">
              <AppText className="text-white text-lg font-bold">Proceed to Checkout</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearCart} className="items-center mt-5">
              <AppText className="text-red-500">Clear Cart</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AppPage>
    </View>
  );
};

export default CartScreen;
