
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getProducts } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredProducts = await getProducts({ isFeatured: true });
        setProducts(featuredProducts);
      } catch {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts, setLoading, setError]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
        </View>
      )}
    />
  );
};

export default HomeScreen;
