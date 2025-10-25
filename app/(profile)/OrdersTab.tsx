import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getOrders } from '@/lib/ServerActions/orders';
import { Order } from '@/interfaces';
import { OrderCard } from '@/components/orders/OrderCard';
import { AppPage } from '@/components/app-page';

const OrdersTab = () => {
  const { user, getAccessToken } = usePrivy();
  const [ordersBuyer, setOrdersBuyer] = useState<Order[]>([]);
  const [ordersSeller, setOrdersSeller] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      
      // Enhanced query for buyer orders, similar to web
      const connectedWallets = user.linked_accounts
        .filter(acc => acc.type === 'wallet')
        .map(acc => acc.address);

      const buyerQuery = {
        $or: [
          { 'buyer.walletAddress': { $in: connectedWallets } },
          { 'buyer._id': user.id }
        ]
      };
      const buyerOrders = await getOrders({ find: buyerQuery }, token || undefined);
      setOrdersBuyer(buyerOrders);

      // Seller orders logic remains the same
      if (user.isSeller) { // Assuming user object has isSeller property
        const sellerQuery = { sellers: user.id };
        const sellerOrders = await getOrders({ find: sellerQuery }, token || undefined);
        setOrdersSeller(sellerOrders);
      }

    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        <Text className="text-red-500 mb-5">{error}</Text>
        <TouchableOpacity onPress={fetchOrders} className="bg-primary p-3 rounded-lg">
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage className="p-5">
      <View className="mb-8">
        <Text className="text-xl font-bold mb-3">My Purchase Orders</Text>
        <FlatList
          data={ordersBuyer}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <OrderCard order={item} isBuyer />}
          ListEmptyComponent={() => (
            <View className="py-10 items-center">
              <Text className="text-lg text-gray-500">You have no purchase orders.</Text>
            </View>
          )}
        />
      </View>

      {user.isSeller && (
        <View>
          <Text className="text-xl font-bold mb-3">My Sales Orders</Text>
          <FlatList
            data={ordersSeller}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <OrderCard order={item} isSeller />}
            ListEmptyComponent={() => (
              <View className="py-10 items-center">
                <Text className="text-lg text-gray-500">You have no sales orders.</Text>
              </View>
            )}
          />
        </View>
      )}
    </AppPage>
  );
};

export default OrdersTab;
