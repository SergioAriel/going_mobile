
import React from 'react';
import { View, Text, FlatList, Button, Image } from 'react-native';
import { useCart } from '../context/CartContext';
import { useCurrencies } from '../context/CurrenciesContext';

const CartScreen = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { userCurrency, listCryptoCurrencies } = useCurrencies();

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Your cart is empty</Text>
      </View>
    );
  }

  const getTotalPrice = () => {
    return items.reduce((total, product) => {
      const priceProductToDollar = listCryptoCurrencies.find(currency => currency.symbol === product.currency)
      const convertedPrice = ((priceProductToDollar?.price || 0) * (product?.price || 1)) / (userCurrency.price || 1)
      return total + (convertedPrice * product.quantity)
    }, 0);
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
            const priceProductToDollar = listCryptoCurrencies.find(currency => currency.symbol === item.currency)
            const convertedPrice = ((priceProductToDollar?.price || 0) * (item?.price || 1)) / (userCurrency.price || 1)
            return (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row' }}>
                    <Image source={{ uri: item.mainImage }} style={{ width: 50, height: 50, marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text>{item.name}</Text>
                        <Text>{item.currency} {item.price.toFixed(2)}</Text>
                        <Text>{userCurrency.currency} {convertedPrice.toFixed(2)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Button title="-" onPress={() => updateQuantity(item._id, item.quantity - 1)} />
                            <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                            <Button title="+" onPress={() => updateQuantity(item._id, item.quantity + 1)} />
                        </View>
                    </View>
                    <Button title="Remove" onPress={() => removeFromCart(item._id)} />
                </View>
            )
        }}
      />
      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <Text>Total: {userCurrency.currency} {getTotalPrice().toFixed(2)}</Text>
        <Button title="Clear Cart" onPress={() => clearCart()} />
        <Button title="Checkout" onPress={() => { /* Navigate to checkout */ }} />
      </View>
    </View>
  );
};

export default CartScreen;
