import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getUser, updateUser } from '@/lib/ServerActions/users';
import { User } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';

const AccountTab = () => {
  const { user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <AppPage className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </AppPage>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <AppPage className="flex-1 justify-center items-center p-5">
          <AppText className="text-red-500 mb-5">{error}</AppText>
          <TouchableOpacity onPress={fetchUser} className="bg-primary p-3 rounded-lg">
            <AppText className="text-white font-bold">Retry</AppText>
          </TouchableOpacity>
        </AppPage>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppPage>
        <ScrollView className="p-5">
          {isEditing ? (
            <View>
              <TextInput value={user?.name} onChangeText={(text) => setUser({ ...user, name: text } as User)} placeholder="Name" className="border-b border-gray-300 mb-3 p-2" />
              <TextInput value={user?.bio} onChangeText={(text) => setUser({ ...user, bio: text } as User)} placeholder="Bio" className="border-b border-gray-300 mb-3 p-2" />
              <TextInput value={user?.website} onChangeText={(text) => setUser({ ...user, website: text } as User)} placeholder="Website" className="border-b border-gray-300 mb-3 p-2" />
              <TouchableOpacity onPress={handleUpdate} className="bg-primary p-3 rounded-lg mt-3">
                <AppText className="text-white text-center font-bold">Save</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(false)} className="bg-gray-300 p-3 rounded-lg mt-3">
                <AppText className="text-center font-bold">Cancel</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <AppText type="title">{user?.name}</AppText>
              <AppText className="text-gray-500">{user?.email}</AppText>
              <AppText className="mt-5">{user?.bio}</AppText>
              <AppText className="text-blue-500 mt-2">{user?.website}</AppText>
              <TouchableOpacity onPress={() => setIsEditing(true)} className="bg-primary p-3 rounded-lg mt-5">
                <AppText className="text-white text-center font-bold">Edit Profile</AppText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </AppPage>
    </View>
  );
};

export default AccountTab;
