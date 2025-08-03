import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getOneProduct } from '@/lib/ServerActions/products';
import { getUser } from '@/lib/ServerActions/users';
import { Product } from '@/interfaces';
import { useLocalSearchParams } from 'expo-router';
import { AppPage } from '@/components/app-page';
import ProductDetail from '@/components/products/ProductDetail';

const ProductDetailScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getOneProduct({ _id: id });
        if (fetchedProduct) {
          const fetchedSeller = await getUser(fetchedProduct.seller);
          setProduct(fetchedProduct);
          setSeller(fetchedSeller);
        } else {
          setError('Product not found');
        }
      } catch {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <AppPage style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </AppPage>
    );
  }

  if (error || !product) {
    return (
      <AppPage style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error || 'Product not found'}</Text>
      </AppPage>
    );
  }

  return <ProductDetail product={product} seller={seller} />;
};

export default ProductDetailScreen;