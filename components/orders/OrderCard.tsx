import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '@/interfaces';

interface OrderCardProps {
    order: Order;
    isBuyer?: boolean;
    isSeller?: boolean;
    onShowQR?: (orderId: string) => void;
}

export const OrderCard = ({ order, isBuyer, isSeller, onShowQR }: OrderCardProps) => {
    return (
        <View style={styles.container}>
            <Text>Order ID: {order._id}</Text>
            <Text>Status: {order.status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
});