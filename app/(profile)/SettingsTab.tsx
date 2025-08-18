import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getUser, updateUser } from '@/lib/ServerActions/users';
import { User } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';

const SettingsTab = () => {
  const { user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleUpdateSettings = async (settings: Partial<User['settings']>) => {
    if (!user) return;
    const updatedSettings = { ...user.settings, ...settings };
    const updatedUser = { ...user, settings: updatedSettings };
    setUser(updatedUser);
    try {
      await updateUser(updatedUser);
    } catch (err) {
      setError('Failed to update settings.');
      // Revert UI change on error
      fetchUser(); 
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
        <TouchableOpacity onPress={fetchUser} className="bg-primary p-3 rounded-lg">
          <AppText className="text-white font-bold">Retry</AppText>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage className="p-5">
        <View className="flex-row justify-between items-center mb-5">
            <AppText>Theme</AppText>
            {/* Implement theme switcher here */}
        </View>
        <View className="flex-row justify-between items-center mb-5">
            <AppText>Currency</AppText>
            {/* Implement currency switcher here */}
        </View>
        <View className="flex-row justify-between items-center mb-5">
            <AppText>Language</AppText>
            {/* Implement language switcher here */}
        </View>
    </AppPage>
  );
};

export default SettingsTab;