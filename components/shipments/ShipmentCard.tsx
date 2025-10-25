import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Shipment, SelfDeliveryShipment } from '@/interfaces';
import { updateShipment } from '@/lib/ServerActions/shipments';

interface ShipmentCardProps {
  shipment: Shipment;
  isSeller?: boolean;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, isSeller }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedDeliveryDays, setConfirmedDeliveryDays] = useState(0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleProcessShipment = async () => {
    if (shipment.shippingType === 'self_delivery') {
      const longestEstimate = Math.max(...shipment.items.map(item => item.estimatedDeliveryDays || 0));
      setConfirmedDeliveryDays(longestEstimate);
      setIsModalOpen(true);
    } else if (shipment.shippingType === 'going_network') {
      await updateShipment(shipment._id.toString(), { status: 'ready_to_ship' });
      // TODO: Add alert/toast notification for success/failure
    }
  };

  const handleModalSubmit = async () => {
    if (shipment.shippingType === 'self_delivery') {
        await updateShipment(shipment._id.toString(), {
            status: 'completed',
            deliveryDetails: {
                ...(shipment as SelfDeliveryShipment).deliveryDetails,
                status: 'delivered',
                confirmedDeliveryDays: confirmedDeliveryDays,
            }
        });
        // TODO: Add alert/toast notification for success/failure
        setIsModalOpen(false);
    }
  };

  return (
    <>
      <View className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
        <View className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
            <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 dark:text-white font-medium">Shipment #{shipment._id.toString().slice(-6)}</Text>
                <Text className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(shipment.status)}`}>
                    {shipment.status}
                </Text>
            </View>
        </View>
        <View className="p-4">
          <View className="space-y-3">
            {shipment?.items?.map((item, index) => (
              <View key={index} className="flex-row justify-between items-center text-sm">
                <Text className="text-gray-700 dark:text-gray-300"><Text className="font-medium">{item.quantity}x</Text> {item.name}</Text>
                <Text className="text-gray-600 dark:text-gray-400">{item.currency} {item.price}</Text>
              </View>
            ))}
          </View>
        </View>
        {isSeller && shipment.status === 'pending' && (
            <View className="p-4 border-t border-gray-200">
                <TouchableOpacity
                    onPress={handleProcessShipment}
                    className="bg-primary py-2 px-4 rounded-lg items-center"
                >
                    <Text className="text-white font-bold">Process Shipment</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>

      <Modal
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
            <View className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full">
                <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Self-Delivery</Text>
                <Text className="text-gray-600 dark:text-gray-400 mb-4">Confirm or adjust the estimated delivery days.</Text>
                <TextInput
                    value={confirmedDeliveryDays.toString()}
                    onChangeText={(text) => setConfirmedDeliveryDays(parseInt(text) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-6"
                    keyboardType="numeric"
                />
                <View className="flex-row justify-end">
                    <TouchableOpacity onPress={() => setIsModalOpen(false)} className="px-4 py-2">
                        <Text className="text-gray-700 dark:text-gray-300">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleModalSubmit} className="px-4 py-2 bg-primary rounded-lg ml-4">
                        <Text className="text-white">Confirm Shipment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </>
  );
};
