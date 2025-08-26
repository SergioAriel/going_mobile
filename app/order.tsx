
import { useSocket } from '@/context/SocketContext';
import { Order } from '@/interfaces';
import { getOrder, getOrders, updateOrder } from '@/lib/ServerActions/orders';
import { usePrivy } from '@privy-io/expo';
import { CameraView } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';

const OrderScreen = () => {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const { getAccessToken } = usePrivy();
    const socket = useSocket();
    const [order, setOrder] = useState<Order | null>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);
    const [showSellerQR, setShowSellerQR] = useState(false);

    useEffect(() => {
        if (socket && orderId) {
            socket.emit('join_order_room', orderId);
            socket.on('location_updated', (location: { lat: number, lng: number }) => {
                setDeliveryLocation(location);
            });
            return () => {
                socket.off('location_updated');
            };
        }
    }, [socket, orderId]);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            const token = await getAccessToken();
            const fetchedOrder = await getOrders({ _id: orderId }, token || undefined);
            setOrder(fetchedOrder[0]);
            setLoading(false);
        };
        fetchOrder();
    }, [orderId, getAccessToken]);

    const handleScanSuccess = async ({ data }: { data: string }) => {
        setShowScanner(false);
        if (data !== order?._id.toString()) {
            alert("Error: The scanned QR code does not match this order.");
            return;
        }
        if (order) {
            await updateOrder({ _id: order._id as string, status: 'delivered' });
            const updatedOrder = await getOrder({ _id: order._id as string });
            setOrder(updatedOrder);
            alert('Order reception confirmed successfully!');
        }
    };

    if (loading) {
        return <View className="flex-1 justify-center items-center"><Text>Loading order details...</Text></View>;
    }

    if (!order) {
        return <View className="flex-1 justify-center items-center"><Text>Order not found.</Text></View>;
    }

    return (
        <View className="flex-1 p-5 bg-gray-100">
            {showSellerQR && (
                <View className="flex-1 items-center justify-center">
                    <QRCode value={order._id.toString()} size={256} />
                    <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={() => setShowSellerQR(false)}>
                        <Text className="text-white text-center font-bold">Close</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showScanner ? (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    onBarcodeScanned={handleScanSuccess}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />
            ) : (
                <View>
                    <Text className="text-2xl font-bold mb-5">Order Details</Text>
                    <Text>Order ID: {order._id}</Text>
                    <Text>Status: {order.status}</Text>
                    {deliveryLocation && (
                        <MapView
                            style={{ width: '100%', height: 200, marginVertical: 20 }}
                            initialRegion={{
                                latitude: deliveryLocation.lat,
                                longitude: deliveryLocation.lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: deliveryLocation.lat,
                                    longitude: deliveryLocation.lng,
                                }}
                                title={"Delivery Location"}
                            />
                        </MapView>
                    )}
                    <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={() => setShowSellerQR(true)}>
                        <Text className="text-white text-center font-bold">Generate Pickup QR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={() => setShowScanner(true)}>
                        <Text className="text-white text-center font-bold">Scan to Confirm Delivery</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default OrderScreen;
