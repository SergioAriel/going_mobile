
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/interfaces';

const offerProducts: Product[] = [
    {
      _id: "1",
      seller: "seller-id",
      name: "Smartwatch Deportivo",
      addressWallet: "wallet-address",
      description: "Reloj inteligente con GPS y monitoreo cardíaco",
      category: "Electrónica",
      price: 249.99,
      currency: "USD",
      status: "active",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099"],
      mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
      stock: 8,
      isOffer: true,
      offerPercentage: 20,
      rating: 4.2,
      reviews: [],
    },
    {
      _id: "2",
      seller: "seller-id",
      name: "Laptop Ultradelgada",
      addressWallet: "wallet-address",
      description: "Potente laptop con procesador de última generación",
      category: "Electrónica",
      price: 999.99,
      currency: "USD",
      status: "active",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071"],
      mainImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
      stock: 3,
      isOffer: true,
      offerPercentage: 15,
      rating: 4.7,
      reviews: [],
    },
  ];

const OffersScreen = () => (
  <View style={{ flex: 1 }}>
    <Header />
    <FlatList
      data={offerProducts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  </View>
);

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: 200,
    },
    overlay: {
        padding: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#999',
        marginRight: 10
    },
    offerPrice: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16
    },
    discountContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});

export default OffersScreen;
