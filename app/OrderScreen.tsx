
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Order } from '@/interfaces';
import { getOrder, updateOrder } from '@/lib/ServerActions/orders';
import MapView, { Marker } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'expo-camera';
import { useSocket } from '@/context/SocketContext';

const OrderScreen = () => {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
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
            const fetchedOrder = await getOrder({ _id: orderId });
            setOrder(fetchedOrder);
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

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
        return <View style={styles.container}><Text>Loading order details...</Text></View>;
    }

    if (!order) {
        return <View style={styles.container}><Text>Order not found.</Text></View>;
    }

    return (
        <View style={styles.container}>
            {showSellerQR && (
                <View style={styles.qrContainer}>
                    <QRCode value={order._id.toString()} size={256} />
                    <Button title="Close" onPress={() => setShowSellerQR(false)} />
                </View>
            )}
            {showScanner ? (
                <Camera
                    style={StyleSheet.absoluteFillObject}
                    onBarCodeScanned={handleScanSuccess}
                />
            ) : (
                <View>
                    <Text style={styles.title}>Order Details</Text>
                    <Text>Order ID: {order._id}</Text>
                    <Text>Status: {order.status}</Text>
                    {deliveryLocation && (
                        <MapView
                            style={styles.map}
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
                    <Button title="Generate Pickup QR" onPress={() => setShowSellerQR(true)} />
                    <Button title="Scan to Confirm Delivery" onPress={() => setShowScanner(true)} />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: 200,
        marginVertical: 20,
    },
});

export default OrderScreen;
