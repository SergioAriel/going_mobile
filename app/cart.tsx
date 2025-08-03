
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useCart, useCurrencies } from '@/context';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
      <AppPage style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <AntDesign name="shoppingcart" size={50} color="#ccc" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 20 }}>Your cart is empty</Text>
        <TouchableOpacity onPress={() => router.push('/products')} style={{ backgroundColor: '#14BFFB', padding: 15, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Continue Shopping</Text>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Your Cart</Text>
        {items.map((item) => (
          <View key={item._id.toString()} style={{ flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 20 }}>
            <Image source={{ uri: item.mainImage || '/imageNotFound.svg' }} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.currency}{(item.price || 0).toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => updateQuantity(item._id.toString(), item.quantity - 1)} style={{ padding: 5, backgroundColor: '#eee', borderRadius: 5 }}>
                  <AntDesign name="minus" size={18} color="#333" />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item._id.toString(), item.quantity + 1)} style={{ padding: 5, backgroundColor: '#eee', borderRadius: 5 }}>
                  <AntDesign name="plus" size={18} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.currency}{(item.price * item.quantity).toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(item._id.toString())} style={{ marginTop: 10 }}>
                <AntDesign name="closecircleo" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>Subtotal ({getTotalItems()} items)</Text>
            <Text>{userCurrency.currency}{totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/checkout')} style={{ backgroundColor: '#14BFFB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Proceed to Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCart} style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'red' }}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppPage>
  );
};

export default CartScreen;
