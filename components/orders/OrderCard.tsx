import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Order } from '@/interfaces';
import { router } from 'expo-router';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

interface OrderCardProps {
    order: Order;
    isBuyer?: boolean;
    isSeller?: boolean;
    onShowQR?: (orderId: string) => void;
}

export const OrderCard = ({ order, isBuyer, isSeller, onShowQR }: OrderCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmedDeliveryDays, setConfirmedDeliveryDays] = useState('0');

    const handleProcessOrder = async () => {
        const selfDeliveryItems = order.items.filter(item => item.shippingType === 'self_delivery');
        const goingNetworkItems = order.items.filter(item => item.shippingType === 'going_network');

        if (selfDeliveryItems.length > 0) {
            const longestEstimate = Math.max(...selfDeliveryItems.map(item => item.estimatedDeliveryDays || 0));
            setConfirmedDeliveryDays(longestEstimate.toString());
            setIsModalOpen(true);
        } else if (goingNetworkItems.length > 0) {
            // TODO: Replace with actual API call from mobile
            alert('Processing GOING Network items');
        }
    };

    const handleModalSubmit = async () => {
        // TODO: Replace with actual API call from mobile
        console.log({
            status: 'shipped',
            confirmedDeliveryDays: parseInt(confirmedDeliveryDays),
        });
        alert('Self-delivery items marked as shipped (Simulated)');
        setIsModalOpen(false);
    };

    const handleRetryPayment = () => {
        router.push(`/checkout?orderId=${order._id}`);
    };

    return (
        <>
            <StyledView className="p-2.5 border border-gray-300 rounded-lg mb-2.5">
                <StyledText>Order ID: {order._id}</StyledText>
                <StyledText>Status: {order.status}</StyledText>
                {isBuyer && order.status === 'payment_rejected' && (
                    <StyledTouchableOpacity onPress={handleRetryPayment} className="bg-blue-500 p-2.5 rounded-lg mt-2.5">
                        <StyledText className="text-white text-center">Retry Payment</StyledText>
                    </StyledTouchableOpacity>
                )}
                {isSeller && order.status === 'payment_confirmed' && (
                    <StyledTouchableOpacity onPress={handleProcessOrder} className="bg-blue-500 p-2.5 rounded-lg mt-2.5">
                        <StyledText className="text-white text-center">Process Order</StyledText>
                    </StyledTouchableOpacity>
                )}
            </StyledView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(!isModalOpen);
                }}
            >
                <StyledView className="flex-1 justify-center items-center mt-5">
                    <StyledView className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg">
                        <StyledText className="mb-4 text-center font-bold">Confirm Self-Delivery</StyledText>
                        <StyledText>Please confirm or adjust the estimated delivery days for your package.</StyledText>
                        <StyledTextInput
                            className="h-10 m-3 border w-4/5 p-2.5"
                            keyboardType="numeric"
                            onChangeText={setConfirmedDeliveryDays}
                            value={confirmedDeliveryDays}
                        />
                        <Button title="Confirm Shipment" onPress={handleModalSubmit} />
                        <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
                    </StyledView>
                </StyledView>
            </Modal>
        </>
    );
};