
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getOneProduct } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';
import { useLocalSearchParams } from 'expo-router';

const ProductDetailScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useLocalSearchParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getOneProduct(productId);
        setProduct(fetchedProduct);
      } catch {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, setProduct, setLoading, setError]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{product.name}</Text>
      <Text style={{ fontSize: 18, color: '#666', marginVertical: 10 }}>{product.description}</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>${product.price.toFixed(2)}</Text>
    </View>
  );
};

export default ProductDetailScreen;
