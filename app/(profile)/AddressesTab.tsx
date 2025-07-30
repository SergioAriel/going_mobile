
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { useUser } from '@/context/UserContext';
import { Addresses } from '@/interfaces';

export default function AddressesTab() {
    const { userData, setUserData } = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Addresses | null>(null);

    const handleSaveAddress = (address: Addresses) => {
        if (selectedAddress) {
            const newAddresses = userData.addresses.map(a => a.name === selectedAddress.name ? address : a);
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
        <View style={styles.container}>
            <Button title="+ Add Address" onPress={() => setModalVisible(true)} />
            <FlatList
                data={userData.addresses}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressName}>{item.name}</Text>
                        <Text>{item.street}, {item.city}, {item.state}</Text>
                        <Text>{item.zipCode}, {item.country}</Text>
                        <Text>Tel: {item.phone}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Edit" onPress={() => { setSelectedAddress(item); setModalVisible(true); }} />
                            <Button title="Delete" onPress={() => handleDeleteAddress(item.name)} />
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
    const [formState, setFormState] = useState<Addresses | null>(address);

    useEffect(() => {
        setFormState(address);
    }, [address]);

    const handleInputChange = (name: string, value: string) => {
        setFormState(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <TextInput style={styles.input} placeholder="Address Name" value={formState?.name || ''} onChangeText={(text) => handleInputChange('name', text)} />
                <TextInput style={styles.input} placeholder="Street" value={formState?.street || ''} onChangeText={(text) => handleInputChange('street', text)} />
                <TextInput style={styles.input} placeholder="City" value={formState?.city || ''} onChangeText={(text) => handleInputChange('city', text)} />
                <TextInput style={styles.input} placeholder="State" value={formState?.state || ''} onChangeText={(text) => handleInputChange('state', text)} />
                <TextInput style={styles.input} placeholder="Zip Code" value={formState?.zipCode || ''} onChangeText={(text) => handleInputChange('zipCode', text)} />
                <TextInput style={styles.input} placeholder="Country" value={formState?.country || ''} onChangeText={(text) => handleInputChange('country', text)} />
                <TextInput style={styles.input} placeholder="Phone" value={formState?.phone || ''} onChangeText={(text) => handleInputChange('phone', text)} />
                <Button title="Save" onPress={() => onSave(formState)} />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    addressContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    addressName: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});
