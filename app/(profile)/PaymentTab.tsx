import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEmbeddedSolanaWallet } from '@privy-io/expo';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';

const PaymentTab = () => {
  const { wallets } = useEmbeddedSolanaWallet();

  return (
    <AppPage className="p-5">
      <AppText type="subtitle" className="mb-5">Associated Wallets</AppText>
      <FlatList
        data={wallets}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <AppText type="defaultSemiBold">{item.walletClientType}</AppText>
            <AppText>{item.address}</AppText>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <AppText className="text-lg text-gray-500">No wallets associated.</AppText>
          </View>
        )}
      />
    </AppPage>
  );
};

export default PaymentTab;

