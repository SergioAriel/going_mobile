import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getOrder } from '@/lib/ServerActions/orders';
import { getShipments } from '@/lib/ServerActions/shipments';
import { Order, Shipment } from '@/interfaces';
import { ShipmentCard } from '@/components/shipments/ShipmentCard';
import { AppPage } from '@/components/app-page';
import { useUser } from '@/context/UserContext';

const statusOrder: Record<string, number> = {
    'pending': 1, 'ready_to_ship': 2, 'in_transit': 3, 'shipped_by_seller': 4, 
    'shipped': 5, 'delivered': 6, 'completed': 7, 'cancelled': 8,
};

const OrderDetailScreen = () => {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const { userData } = useUser();
    const [order, setOrder] = useState<Order | null>(null);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetails = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        setError(null);
        try {
            const orderData = await getOrder(orderId);
            setOrder(orderData);

            if (orderData) {
                const shipmentData = await getShipments({ orderId: orderId });
                shipmentData.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
                setShipments(shipmentData);
            }
        } catch (e) {
            setError("Failed to load order details.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (loading) {
        return <AppPage className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></AppPage>;
    }

    if (error) {
        return (
            <AppPage className="flex-1 justify-center items-center p-5">
                <Text className="text-red-500 mb-5">{error}</Text>
                <TouchableOpacity onPress={fetchOrderDetails} className="bg-primary p-3 rounded-lg">
                    <Text className="text-white font-bold">Retry</Text>
                </TouchableOpacity>
            </AppPage>
        );
    }

    if (!order) {
        return <AppPage className="flex-1 justify-center items-center"><Text>Order not found.</Text></AppPage>;
    }

    const isUserSellerOfOrder = order.sellers.includes(userData?._id.toString() || '');

    return (
        <ScrollView>
            <AppPage>
                <View className="p-5 bg-white dark:bg-gray-800 shadow-md mb-4">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</Text>
                    <Text className="text-gray-500 dark:text-gray-400">Order ID: {order._id.toString()}</Text>
                    <Text className="text-gray-500 dark:text-gray-400">Date: {new Date(order.date).toLocaleDateString()}</Text>
                    <Text className="text-gray-500 dark:text-gray-400">Status: <Text className="font-medium text-primary capitalize">{order.status}</Text></Text>
                </View>

                <View className="p-5">
                    <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipments for this Order</Text>
                    {shipments.length > 0 ? (
                        shipments.map(shipment => (
                           <ShipmentCard 
                                key={shipment._id.toString()} 
                                shipment={shipment} 
                                isSeller={isUserSellerOfOrder} 
                            />
                        ))
                    ) : (
                        <Text>No shipments found for this order.</Text>
                    )}
                </View>
            </AppPage>
        </ScrollView>
    );
};

export default OrderDetailScreen;