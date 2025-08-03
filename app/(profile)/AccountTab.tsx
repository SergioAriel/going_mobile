import React from 'react';
import { View, TextInput, Button, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useUser } from '@/context/UserContext';

export default function AccountTab() {
    const { userData, setUserData } = useUser();

    return (
        <ScrollView className="flex-1 p-5 bg-gray-100">
            <View className="items-center mb-5">
                {/* Avatar placeholder */}
                <View className="w-24 h-24 rounded-full bg-gray-300" />
            </View>
            <TextInput
                className="border border-gray-300 rounded-md p-3 mb-3 bg-white"
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                placeholder="Full Name"
            />
            <TextInput
                className="border border-gray-300 rounded-md p-3 mb-3 bg-white"
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder="Email Address"
                keyboardType="email-address"
            />
            <TextInput
                className="border border-gray-300 rounded-md p-3 mb-3 bg-white"
                value={userData.location}
                onChangeText={(text) => setUserData(prev => ({ ...prev, location: text }))}
                placeholder="Location"
            />
            <TextInput
                className="border border-gray-300 rounded-md p-3 mb-3 bg-white h-24"
                value={userData.bio}
                onChangeText={(text) => setUserData(prev => ({ ...prev, bio: text }))}
                placeholder="Bio"
                multiline
            />
            <TouchableOpacity className="bg-blue-500 p-3 rounded-md" onPress={() => { /* Logic to save changes */ }}>
                <Text className="text-white text-center font-bold">Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
