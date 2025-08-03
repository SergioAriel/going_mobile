import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/UserContext';
import { AddressForm } from '@/interfaces';

export default function AddressesTab() {
    const { userData, setUserData } = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressForm | null>(null);

    const handleSaveAddress = (address: AddressForm) => {
        if (selectedAddress) {
            const newAddresses = userData.addresses.map(a => a.name === selectedAddress?.name ? address : a);
            setUserData(prev => ({ ...prev, addresses: newAddresses }));
        } else {
            setUserData(prev => ({ ...prev, addresses: [...prev.addresses, address] }));
        }
        setSelectedAddress(null);
        setModalVisible(false);
    };

    const handleDeleteAddress = (addressName: string) => {
        const newAddresses = userData.addresses.filter(a => a.name !== addressName);
        setUserData(prev => ({ ...prev, addresses: newAddresses }));
    };

    return (
        <View className="flex-1 p-5 bg-gray-100">
            <TouchableOpacity className="bg-blue-500 p-3 rounded-md mb-5" onPress={() => setModalVisible(true)}>
                <Text className="text-white text-center font-bold">+ Add Address</Text>
            </TouchableOpacity>
            <FlatList
                data={userData.addresses}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View className="p-4 bg-white rounded-lg shadow-md mb-3">
                        <Text className="font-bold text-lg">{item.name}</Text>
                        <Text>{item.street}, {item.city}, {item.state}</Text>
                        <Text>{item.zipCode}, {item.country}</Text>
                        <Text>Tel: {item.phone}</Text>
                        <View className="flex-row justify-end mt-3">
                            <TouchableOpacity className="bg-yellow-500 p-2 rounded-md mr-2" onPress={() => { setSelectedAddress(item); setModalVisible(true); }}>
                                <Text className="text-white">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-red-500 p-2 rounded-md" onPress={() => handleDeleteAddress(item.name)}>
                                <Text className="text-white">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <AddressModal
                visible={modalVisible}
                onClose={() => { setSelectedAddress(null); setModalVisible(false); }}
                onSave={handleSaveAddress}
                address={selectedAddress}
            />
        </View>
    );
};

const AddressModal = ({ visible, onClose, onSave, address }) => {
    const [formState, setFormState] = useState<AddressForm | null>(address);

    useEffect(() => {
        setFormState(address);
    }, [address]);

    const handleInputChange = (name: string, value: string) => {
        setFormState(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-5 rounded-lg w-11/12">
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="Address Name" value={formState?.name || ''} onChangeText={(text) => handleInputChange('name', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="Street" value={formState?.street || ''} onChangeText={(text) => handleInputChange('street', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="City" value={formState?.city || ''} onChangeText={(text) => handleInputChange('city', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="State" value={formState?.state || ''} onChangeText={(text) => handleInputChange('state', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="Zip Code" value={formState?.zipCode || ''} onChangeText={(text) => handleInputChange('zipCode', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="Country" value={formState?.country || ''} onChangeText={(text) => handleInputChange('country', text)} />
                    <TextInput className="border border-gray-300 rounded-md p-3 mb-3" placeholder="Phone" value={formState?.phone || ''} onChangeText={(text) => handleInputChange('phone', text)} />
                    <View className="flex-row justify-around">
                        <TouchableOpacity className="bg-blue-500 p-3 rounded-md flex-1 mr-2" onPress={() => onSave(formState)}>
                            <Text className="text-white text-center font-bold">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-500 p-3 rounded-md flex-1 ml-2" onPress={onClose}>
                            <Text className="text-white text-center font-bold">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
