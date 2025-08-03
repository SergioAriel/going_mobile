
import React from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { useLogin } from '@privy-io/expo/ui';

export default function SettingsTab() {
    const { user, logout } = usePrivy();
    const { login } = useLogin();

    return (
        <View className="flex-1 items-center justify-center p-5">
            {user ? (
                <TouchableOpacity className="bg-red-500 p-3 rounded-md" onPress={() => logout()}>
                    <Text className="text-white font-bold">Logout</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="bg-blue-500 p-3 rounded-md" onPress={() => login({loginMethods: ['google']})}>
                    <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
