import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { getOrders, updateOrder } from '@/lib/ServerActions/orders';
import { Order } from '@/interfaces';
import { OrderCard } from '@/components/orders/OrderCard';
import { AppPage } from '@/components/app-page';
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'expo-camera';

const OrdersTab = () => {
  const { user, getAccessToken } = usePrivy();
  const [ordersBuyer, setOrdersBuyer] = useState<Order[]>([]);
  const [ordersSeller, setOrdersSeller] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const buyerOrders = await getOrders({ find: { 'buyer._id': user.id } }, token || undefined);
      setOrdersBuyer(buyerOrders);
      // Assuming you have a way to identify sellers, you can fetch seller orders here
      // For now, I'll leave it empty
      // const sellerOrders = await getOrders({ find: { 'seller._id': user.id } });
      // setOrdersSeller(sellerOrders);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleShowQR = (orderId: string) => {
    setShowQR(orderId);
  };

  const handleScanSuccess = async ({ data }: { data: string }) => {
    setShowScanner(false);
    try {
        const token = await getAccessToken();
      await updateOrder({
        _id: data,
        status: "delivered",
      }, token || undefined);
      alert("Order delivered successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error(error);
      alert("Error delivering order");
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
        <Text className="text-red-500 mb-5">{error}</Text>
        <TouchableOpacity onPress={fetchOrders} className="bg-primary p-3 rounded-lg">
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage className="p-5">
      {showQR && (
        <Modal visible={true} onRequestClose={() => setShowQR(null)} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-5 rounded-lg items-center">
              <QRCode value={showQR} size={256} />
              <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={() => setShowQR(null)}>
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {showScanner && (
        <Modal visible={true} onRequestClose={() => setShowScanner(false)}>
          <Camera style={{ flex: 1 }} onBarCodeScanned={handleScanSuccess} />
          <TouchableOpacity className="bg-blue-500 p-3 rounded-md m-5" onPress={() => setShowScanner(false)}>
            <Text className="text-white text-center font-bold">Close</Text>
          </TouchableOpacity>
        </Modal>
      )}
      <View>
        <Text className="text-xl font-bold mb-3">My Purchase Orders</Text>
        <FlatList
          data={ordersBuyer}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <OrderCard order={item} isBuyer onShowQR={handleShowQR} />}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg text-gray-500">You have no orders yet.</Text>
            </View>
          )}
        />
      </View>
      {/* Add seller section if needed */}
    </AppPage>
  );
};

export default OrdersTab;
