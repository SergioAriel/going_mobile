import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Order } from "@/interfaces";
import { 
  // getOrders, 
  updateOrder } from "@/lib/ServerActions/orders";
import { useUser } from "@/context/UserContext";
// import { useSolanaWallets } from "@privy-io/expo";
import { OrderCard } from "@/components/orders/OrderCard";
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'expo-camera';

export default function OrdersTab () {
  const { userData } = useUser();
  const [ordersBuyer, setOrderBuyer] = useState<Order[]>([]);
  const [ordersSeller, setOrderSeller] = useState<Order[]>([]);
  // const { wallets } = useSolanaWallet();
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     if (userData?._id) {
  //       const resOrdersBuyer = await getOrders({ sellers: userData._id.toString() });
  //       setOrderSeller(resOrdersBuyer);
  //     }

  //     const connectedWallets = wallets.map(wallet => wallet?.address.toString());
  //     if (connectedWallets.length > 0 || userData?._id) {
  //       const query = {
  //         $or: [
  //           { 'buyer.walletAddress': { $in: connectedWallets } },
  //           { 'buyer._id': userData?._id.toString() }
  //         ]
  //       };
  //       const resOrdersSeller = await getOrders(query as any);
  //       setOrderBuyer(resOrdersSeller);
  //     }
  //   })();
  // }, [userData, wallets]);

  const handleShowQR = (orderId: string) => {
    setShowQR(orderId);
  };

  const handleScanSuccess = async ({ data }: { data: string }) => {
      setShowScanner(false);
      try {
          await updateOrder({
              _id: data,
              status: "delivered"
          })
          alert("Order delivered successfully");
      } catch (error) {
          console.error(error);
          alert("Error delivering order");
      }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
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
            {/* <Camera style={{...StyleSheet.absoluteFillObject}} onBarCodeScanned={handleScanSuccess} /> */}
            <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={() => setShowScanner(false)}>
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
          />
      </View>
      {userData?.isSeller && (
          <View className="mt-5">
              <Text className="text-xl font-bold mb-3">My Sales Orders</Text>
              <TouchableOpacity className="bg-blue-500 p-3 rounded-md mb-3" onPress={() => setShowScanner(true)}>
                  <Text className="text-white text-center font-bold">Scan QR</Text>
              </TouchableOpacity>
              <FlatList
                data={ordersSeller}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => <OrderCard order={item} isSeller />}
              />
          </View>
      )}
    </View>
  );
};
