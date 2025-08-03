
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CryptoBanner = () => {
  return (
    <LinearGradient
      colors={['#14BFFB', '#D300E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="py-16 relative overflow-hidden"
    >
      {/* Decorative elements can be added here if needed */}
      <View className="absolute top-0 left-0 w-full h-full opacity-10"></View>
      <View className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10"></View>
      <View className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5"></View>

      <View className="container mx-auto px-4 relative z-10">
        <View className="max-w-3xl mx-auto text-center items-center">
          <Text className="text-3xl md:text-4xl font-bold mb-6 text-white">Shop with Cryptocurrency</Text>
          <Text className="text-lg md:text-xl mb-8 text-white/90 text-center">
            Experience the future of online shopping with our Solana integration.
            Fast, secure, and eco-friendly transactions for the modern shopper.
          </Text>
          <View className="flex justify-center">
            <TouchableOpacity
              onPress={() => { /* Handle navigation */ }}
              className="bg-white py-2 px-5 rounded-lg"
            >
              <Text className="text-black text-base font-bold">Learn How It Works</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CryptoBanner;
