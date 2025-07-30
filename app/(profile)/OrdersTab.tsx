
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, FlatList } from 'react-native';
import { Order } from "@/interfaces";
import { getOrders, updateOrder } from "@/lib/ServerActions/orders";
import { useUser } from "@/context/UserContext";
import { useSolanaWallets } from "@privy-io/expo";
import { OrderCard } from "@/components/orders/OrderCard";
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'expo-camera';

export default function OrdersTab() {
  const { userData } = useUser();
  const [ordersBuyer, setOrderBuyer] = useState<Order[]>([]);
  const [ordersSeller, setOrderSeller] = useState<Order[]>([]);
  const { wallets } = useSolanaWallets();
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (userData?._id) {
        const resOrdersBuyer = await getOrders({ sellers: userData._id.toString() });
        setOrderSeller(resOrdersBuyer);
      }

      const connectedWallets = wallets.map(wallet => wallet?.address.toString());
      if (connectedWallets.length > 0 || userData?._id) {
        const query = {
          $or: [
            { 'buyer.walletAddress': { $in: connectedWallets } },
            { 'buyer._id': userData?._id.toString() }
          ]
        };
        const resOrdersSeller = await getOrders(query as any);
        setOrderBuyer(resOrdersSeller);
      }
    })();
  }, [userData, wallets]);

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
    <View style={styles.container}>
      {showQR && (
        <Modal visible={true} onRequestClose={() => setShowQR(null)}>
            <View style={styles.qrContainer}>
                <QRCode value={showQR} size={256} />
                <Button title="Close" onPress={() => setShowQR(null)} />
            </View>
        </Modal>
      )}
      {showScanner && (
        <Modal visible={true} onRequestClose={() => setShowScanner(false)}>
            <Camera style={StyleSheet.absoluteFillObject} onBarCodeScanned={handleScanSuccess} />
            <Button title="Close" onPress={() => setShowScanner(false)} />
        </Modal>
      )}
      <View>
          <Text style={styles.title}>My Purchase Orders</Text>
          <FlatList
            data={ordersBuyer}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <OrderCard order={item} isBuyer onShowQR={handleShowQR} />}
          />
      </View>
      {userData?.isSeller && (
          <View>
              <Text style={styles.title}>My Sales Orders</Text>
              <Button title="Scan QR" onPress={() => setShowScanner(true)} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    qrContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
