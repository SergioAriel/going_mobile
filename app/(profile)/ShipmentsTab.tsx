import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useUser } from '@/context/UserContext';
import { useAlert } from '@/context/AlertContext';
import { getShipments, requestPickupForShipments } from '@/lib/ServerActions/shipments';
import { Shipment } from '@/interfaces';
import { AppPage } from '@/components/app-page';
import { MaterialIcons } from '@expo/vector-icons';

const CheckBox = ({ isChecked, onChange }: { isChecked: boolean, onChange: () => void }) => (
  <TouchableOpacity onPress={onChange} className="p-1">
    <MaterialIcons 
      name={isChecked ? 'check-box' : 'check-box-outline-blank'} 
      size={28} 
      color={isChecked ? '#3b82f6' : '#9CA3AF'} // blue-500 and gray-400
    />
  </TouchableOpacity>
);

const ShipmentItem = ({ item, onCheckboxChange, isSelected, onToggleExpand, isExpanded }: any) => {
  return (
    <View className="bg-white rounded-lg mb-3 border border-gray-200">
      <TouchableOpacity onPress={onToggleExpand} activeOpacity={0.7}>
        <View className="flex-row items-center p-4">
          <CheckBox 
            isChecked={isSelected}
            onChange={onCheckboxChange}
          />
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-gray-800">Order ID: ...{item.orderId.slice(-6)}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {item.items.length} item(s) to {item.deliveryAddress.city}
            </Text>
          </View>
          <MaterialIcons name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={28} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 border-t border-gray-200">
          <Text className="text-sm font-medium text-gray-700 mt-3 mb-2 ml-12">Products in this shipment:</Text>
          <View className="space-y-3 ml-12">
            {item.items.map((productItem: any) => (
              <View key={productItem._id.toString()} className="flex-row items-center">
                <Image 
                  source={{ uri: productItem.mainImage || 'https://placehold.co/400' }}
                  className="w-10 h-10 rounded-md bg-gray-200"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-semibold text-gray-800">{productItem.name}</Text>
                  <Text className="text-xs text-gray-500">Quantity: {productItem.quantity}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const ShipmentsTab = () => {
  const { userData } = useUser();
  const { handleAlert } = useAlert();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

  const fetchPendingShipments = useCallback(async () => {
    if (!userData?._id) return;
    setLoading(true);
    try {
      const pendingShipments = await getShipments({
        sellerId: userData._id.toString(),
        status: 'pending',
        shippingType: 'going_network'
      });
      setShipments(pendingShipments);
    } catch (error) {
      console.error("Failed to fetch pending shipments:", error);
      handleAlert({ message: "Failed to load shipments.", isError: true });
    } finally {
      setLoading(false);
    }
  }, [userData?._id, handleAlert]);

  useEffect(() => {
    fetchPendingShipments();
  }, [fetchPendingShipments]);

  const handleCheckboxChange = (shipmentId: string) => {
    setSelectedShipments(prev =>
      prev.includes(shipmentId)
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const handleToggleExpand = (shipmentId: string) => {
    setExpandedShipmentId(prev => prev === shipmentId ? null : shipmentId);
  };

  const handleRequestPickup = async () => {
    if (selectedShipments.length === 0) {
      handleAlert({ message: "Please select at least one shipment.", isError: true });
      return;
    }
    setSubmitting(true);
    try {
      const result = await requestPickupForShipments(selectedShipments);
      if (result.status) {
        handleAlert({ message: `${result.modifiedCount} shipments are now ready for pickup!`, isError: false });
        setSelectedShipments([]);
        fetchPendingShipments(); // Refresh the list
      } else {
        throw new Error(result.message || "Failed to request pickup.");
      }
    } catch (error: any) {
      console.error("Error requesting pickup:", error);
      handleAlert({ message: error.message || "An error occurred.", isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AppPage className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#3b82f6" /></AppPage>;
  }

  return (
    <AppPage>
      <View className="flex-1 p-4">
        <Text className="text-3xl font-bold text-gray-800 mb-4">Pending Shipments</Text>
        {shipments.length === 0 ? (
          <View className="flex-1 justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <MaterialIcons name="local-shipping" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold mt-4 text-gray-700">No pending shipments</Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">New sales will appear here once you receive them.</Text>
          </View>
        ) : (
          <FlatList
            data={shipments}
            renderItem={({ item }) => (
              <ShipmentItem 
                item={item} 
                isSelected={selectedShipments.includes(item._id.toString())}
                isExpanded={expandedShipmentId === item._id.toString()}
                onCheckboxChange={() => handleCheckboxChange(item._id.toString())}
                onToggleExpand={() => handleToggleExpand(item._id.toString())}
              />
            )}
            keyExtractor={item => item._id.toString()}
            className="flex-1"
          />
        )}
        {shipments.length > 0 && (
          <TouchableOpacity 
            className="bg-blue-500 py-4 rounded-lg items-center mt-4 disabled:opacity-50"
            onPress={handleRequestPickup}
            disabled={selectedShipments.length === 0 || submitting}
          >
            <Text className="text-white text-base font-bold">
              {submitting ? "Submitting..." : `Request Pickup (${selectedShipments.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </AppPage>
  );
};

export default ShipmentsTab;