import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getUser, updateUser } from '@/lib/ServerActions/users';
import { getProducts } from '@/lib/ServerActions/products';
import { User, Product } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { AntDesign } from '@expo/vector-icons';

const WishlistTab = () => {
  const { user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!privyUser) return;

    setLoading(true);
    setError(null);
    try {
      const userData = await getUser(privyUser.id);
      setUser(userData);
      if (userData && userData.wishlist.length > 0) {
        const products = await getProducts({ find: { _id: { $in: userData.wishlist } } });
        setWishlistProducts(products);
      }
    } catch (err) {
      setError('Failed to fetch wishlist.');
    } finally {
      setLoading(false);
    }
  }, [privyUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;
    const updatedWishlist = user.wishlist.filter(id => id !== productId);
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    setWishlistProducts(wishlistProducts.filter(p => p._id !== productId));
    try {
      await updateUser(updatedUser);
    } catch (err) {
      setError('Failed to update wishlist.');
      // Revert UI change on error
      fetchWishlist(); 
    }
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
        <TouchableOpacity onPress={fetchWishlist} className="bg-primary p-3 rounded-lg">
          <AppText className="text-white font-bold">Retry</AppText>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <FlatList
        data={wishlistProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 border-b border-gray-200">
            <Image source={{ uri: item.mainImage }} className="w-16 h-16 rounded-lg" />
            <View className="flex-1 ml-4">
              <AppText type="defaultSemiBold">{item.name}</AppText>
              <AppText className="text-gray-600">{item.currency}{item.price.toFixed(2)}</AppText>
            </View>
            <TouchableOpacity onPress={() => handleRemoveFromWishlist(item._id)} className="p-2">
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <AppText className="text-lg text-gray-500">Your wishlist is empty.</AppText>
          </View>
        )}
      />
    </AppPage>
  );
};

export default WishlistTab;