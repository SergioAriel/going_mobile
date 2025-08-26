import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '@/interfaces';
import { router } from 'expo-router';

interface OrderCardProps {
    order: Order;
    isBuyer?: boolean;
    isSeller?: boolean;
    onShowQR?: (orderId: string) => void;
}

export const OrderCard = ({ order, isBuyer, isSeller, onShowQR }: OrderCardProps) => {
    const handleRetryPayment = () => {
        router.push(`/checkout?orderId=${order._id}`);
    };

    return (
        <View style={styles.container}>
            <Text>Order ID: {order._id}</Text>
            <Text>Status: {order.status}</Text>
            {isBuyer && order.status === 'payment_rejected' && (
                <TouchableOpacity onPress={handleRetryPayment} style={styles.button}>
                    <Text style={styles.buttonText}>Retry Payment</Text>
                </TouchableOpacity>
            )}
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
    button: {
        backgroundColor: '#14BFFB',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});
