import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useUser } from '@/context/UserContext';
import { usePrivy } from '@privy-io/expo';
import { getUser, updateUser } from '@/lib/ServerActions/users';
import { User, Address } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';

const AddressesTab = () => {
  const { user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Address | null>(null);

  const fetchUser = useCallback(async () => {
    if (!privyUser) return;

    setLoading(true);
    setError(null);
    try {
      const userData = await getUser(privyUser.id);
      setUser(userData);
    } catch (err) {
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  }, [privyUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUser(user);
      setIsEditing(null);
    } catch (err) {
      setError('Failed to update addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    if (isEditing) {
        const updatedAddress = { ...isEditing, [field]: value };
        const updatedAddresses = user?.addresses.map(addr => addr.name === isEditing.name ? updatedAddress : addr) || [];
        setUser({ ...user, addresses: updatedAddresses } as User);
        setIsEditing(updatedAddress);
    }
  }

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
        <TouchableOpacity onPress={fetchUser} className="bg-primary p-3 rounded-lg">
          <AppText className="text-white font-bold">Retry</AppText>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage>
        {isEditing ? (
            <ScrollView className="p-5">
                <TextInput value={isEditing.name} onChangeText={(text) => handleAddressChange('name', text)} placeholder="Name" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.street} onChangeText={(text) => handleAddressChange('street', text)} placeholder="Street" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.city} onChangeText={(text) => handleAddressChange('city', text)} placeholder="City" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.state} onChangeText={(text) => handleAddressChange('state', text)} placeholder="State" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.zipCode} onChangeText={(text) => handleAddressChange('zipCode', text)} placeholder="Zip Code" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.country} onChangeText={(text) => handleAddressChange('country', text)} placeholder="Country" className="border-b border-gray-300 mb-3 p-2" />
                <TextInput value={isEditing.phone} onChangeText={(text) => handleAddressChange('phone', text)} placeholder="Phone" className="border-b border-gray-300 mb-3 p-2" />
                <TouchableOpacity onPress={handleUpdate} className="bg-primary p-3 rounded-lg mt-3">
                    <AppText className="text-white text-center font-bold">Save</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsEditing(null)} className="bg-gray-300 p-3 rounded-lg mt-3">
                    <AppText className="text-center font-bold">Cancel</AppText>
                </TouchableOpacity>
            </ScrollView>
        ) : (
            <FlatList
                data={user?.addresses || []}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                <View className="p-4 border-b border-gray-200">
                    <AppText type="defaultSemiBold">{item.name}</AppText>
                    <AppText>{item.street}, {item.city}, {item.state} {item.zipCode}</AppText>
                    <AppText>{item.country}</AppText>
                    <AppText>{item.phone}</AppText>
                    <TouchableOpacity onPress={() => setIsEditing(item)} className="bg-primary p-2 rounded-lg mt-2 self-start">
                        <AppText className="text-white">Edit</AppText>
                    </TouchableOpacity>
                </View>
                )}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center">
                        <AppText className="text-lg text-gray-500">You have no addresses saved.</AppText>
                    </View>
                )}
            />
        )}
    </AppPage>
  );
};

export default AddressesTab;