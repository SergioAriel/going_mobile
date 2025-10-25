import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { updateUser } from '@/lib/ServerActions/users';
import { getProducts, deleteProduct } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { useAlert } from '@/context/AlertContext'; // Assuming you have an AlertContext

const SellingTab = () => {
  const { user: privyUser } = usePrivy();
  const { userData, setUserData } = useUser();
  const { handleAlert } = useAlert(); // Use the alert context for feedback
  const router = useRouter();

  const [userProducts, setUserProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSellerToggle, setIsSellerToggle] = useState(false);

  const fetchSellingProducts = useCallback(async () => {
    if (!userData?._id || !userData.isSeller) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const products = await getProducts({ find: { seller: userData._id } });
      setUserProducts(products || []);
    } catch (err) {
      handleAlert({ message: 'Failed to fetch products.', isError: true });
    } finally {
      setLoading(false);
    }
  }, [userData?._id, userData?.isSeller, handleAlert]);

  useEffect(() => {
    fetchSellingProducts();
  }, [fetchSellingProducts]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      handleAlert({ message: 'Product deleted successfully', isError: false });
      fetchSellingProducts(); // Refresh the list
    } catch (error) {
      handleAlert({ message: 'Failed to delete product', isError: true });
    }
  };

  const handleBecomeSeller = async () => {
    if (!userData) return;
    if (!isSellerToggle) {
      handleAlert({ message: "You must agree to become a seller.", isError: true });
      return;
    }

    const resp = await updateUser({ ...userData, isSeller: true });

    if (resp.status) {
      setUserData({ ...userData, isSeller: true });
      handleAlert({ message: "Congratulations! You are now a seller.", isError: false });
    } else {
      handleAlert({ message: resp.message || "An error occurred.", isError: true });
    }
  };

  if (loading) {
    return (
      <AppPage style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </AppPage>
    );
  }

  // 1. User is already a seller -> Show product list
  if (userData?.isSeller) {
    return (
      <AppPage>
        <TouchableOpacity style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, margin: 20 }} onPress={() => router.push('/uploadProduct')}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>+ Add New Product</Text>
        </TouchableOpacity>
        <FlatList
          data={userProducts}
          keyExtractor={(item) => item._id!.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
              <Image source={{ uri: item.mainImage }} style={{ width: 64, height: 64, borderRadius: 8 }} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <AppText type="defaultSemiBold">{item.name}</AppText>
                <AppText style={{ color: '#4b5563' }}>{item.currency}{item.price.toFixed(2)}</AppText>
              </View>
              <TouchableOpacity onPress={() => router.push(`/products/${item._id}?edit=true`)} style={{ padding: 8 }}>
                <AntDesign name="edit" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduct(item._id!.toString())} style={{ padding: 8 }}>
                <AntDesign name="delete" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <AppText style={{ fontSize: 18, color: '#6b7280' }}>You have no products for sale.</AppText>
            </View>
          )}
        />
      </AppPage>
    );
  }

  // 2. User is NOT a seller and has NO address -> Prompt to add address
  if (!userData?.addresses || userData.addresses.length === 0) {
    return (
        <AppPage style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <AppText style={{ textAlign: 'center', marginBottom: 16, fontSize: 16 }}>To become a seller, please add an address first.</AppText>
            <TouchableOpacity style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 8 }} onPress={() => router.push('/(profile)/AddressesTab')}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Address</Text>
            </TouchableOpacity>
        </AppPage>
    );
  }

  // 3. User is NOT a seller but HAS an address -> Show the 'Become a Seller' form
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ padding: 20 }}>
        <AppText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Become a Seller</AppText>
        <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12 }}>
          <AppText style={{ color: '#4b5563', marginBottom: 24 }}>To start selling, please review our terms and confirm your intention to become a seller.</AppText>
          
          <AppText style={{ fontWeight: 'bold', textAlign: 'center', color: '#6b7280', marginBottom: 24 }}>KYC Process Coming Soon</AppText>

          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <AppText style={{ fontWeight: '600', color: '#374151', marginBottom: 8 }}>I want to become a seller.</AppText>
            <Switch value={isSellerToggle} onValueChange={setIsSellerToggle} />
          </View>

          <TouchableOpacity
              onPress={handleBecomeSeller}
              disabled={!isSellerToggle}
              style={{
                backgroundColor: isSellerToggle ? '#3b82f6' : '#9ca3af',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
          >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Complete Seller Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SellingTab;