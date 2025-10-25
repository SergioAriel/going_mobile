import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/interfaces';
import { getProducts } from '@/lib/ServerActions/products';

const OffersScreen = () => {
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const products = await getProducts({ find: { isOffer: true } });
        setOfferProducts(products);
      } catch (error) {
        console.error("Failed to fetch offer products:", error);
        // Optionally, set an error state to show a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchOfferProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading offers...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <FlatList
        data={offerProducts}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No offers available at the moment.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OffersScreen;