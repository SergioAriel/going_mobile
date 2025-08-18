import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getUser } from '@/lib/ServerActions/users';
import { getProducts, deleteProduct } from '@/lib/ServerActions/products';
import { User, Product } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SellingTab = () => {
  const { user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSellingProducts = useCallback(async () => {
    if (!privyUser) return;

    setLoading(true);
    setError(null);
    try {
      const userData = await getUser(privyUser.id);
      setUser(userData);
      if (userData && userData.isSeller) {
        const products = await getProducts({ find: { seller: privyUser.id } });
        setUserProducts(products);
      }
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [privyUser]);

  useEffect(() => {
    fetchSellingProducts();
  }, [fetchSellingProducts]);

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    fetchSellingProducts();
  };

  if (loading) {
    return (
      <AppPage className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </AppPage>
    );
  }

  if (error) {
    return (
      <AppPage className="flex-1 justify-center items-center p-5">
        <AppText className="text-red-500 mb-5">{error}</AppText>
        <TouchableOpacity onPress={fetchSellingProducts} className="bg-primary p-3 rounded-lg">
          <AppText className="text-white font-bold">Retry</AppText>
        </TouchableOpacity>
      </AppPage>
    );
  }

  if (!user?.isSeller) {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-center mb-4">To become a seller, please add an address.</Text>
            <TouchableOpacity className="bg-blue-500 p-3 rounded-md" onPress={() => router.push('/(profile)/AddressesTab')}>
                <Text className="text-white font-bold">Add Address</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <AppPage>
        <TouchableOpacity className="bg-blue-500 p-3 rounded-md m-5" onPress={() => router.push('/uploadProduct')}>
            <Text className="text-white text-center font-bold">+ Add New Product</Text>
        </TouchableOpacity>
      <FlatList
        data={userProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 border-b border-gray-200">
            <Image source={{ uri: item.mainImage }} className="w-16 h-16 rounded-lg" />
            <View className="flex-1 ml-4">
              <AppText type="defaultSemiBold">{item.name}</AppText>
              <AppText className="text-gray-600">{item.currency}{item.price.toFixed(2)}</AppText>
            </View>
            <TouchableOpacity onPress={() => router.push(`/products/${item._id}?edit=true`)} className="p-2">
              <AntDesign name="edit" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(item._id)} className="p-2">
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <AppText className="text-lg text-gray-500">You have no products for sale.</AppText>
          </View>
        )}
      />
    </AppPage>
  );
};

export default SellingTab;