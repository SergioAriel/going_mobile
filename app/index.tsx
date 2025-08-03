
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getProducts } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';
import { usePrivy } from '@privy-io/expo';
import ProductCard from '@/components/products/ProductCard';
import HeroSlider from '@/components/layout/HeroSlider';
import CryptoBanner from '@/components/home/CryptoBanner';
import { router } from 'expo-router';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = usePrivy();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }
      const featuredProducts = await getProducts({ find: { isFeatured: true } });
      setProducts(featuredProducts);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={fetchProducts} style={{ backgroundColor: '#14BFFB', padding: 15, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView>
      <HeroSlider />
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={{ color: '#14BFFB' }}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {products.map((product) => (
            <View key={product._id.toString()} style={{ width: '48%' }}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </View>
      <CryptoBanner />
      <View style={{ padding: 20, backgroundColor: '#f9fafb' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Why Choose Going Marketplace</Text>
        <View>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#14BFFB', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Svg height="50%" width="50%" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </Svg>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Secure Transactions</Text>
            <Text style={{ textAlign: 'center', color: '#666' }}>All transactions are encrypted and secure, whether using traditional payment methods or cryptocurrency.</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#D300E5', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Svg height="50%" width="50%" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </Svg>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Fast Delivery</Text>
            <Text style={{ textAlign: 'center', color: '#666' }}>Quick processing and shipping to get your products to you as soon as possible.</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <LinearGradient colors={['#14BFFB', '#D300E5']} style={{ width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Svg height="50%" width="50%" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </Svg>
            </LinearGradient>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Multiple Payment Options</Text>
            <Text style={{ textAlign: 'center', color: '#666' }}>Choose from credit cards, digital wallets, or cryptocurrencies like Solana for your purchases.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
