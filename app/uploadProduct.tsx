
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { Product } from '@/interfaces';
import * as ImagePicker from 'expo-image-picker';

const UploadProductScreen = () => {
    const { user } = usePrivy();
    const [infoProduct, setInfoProduct] = useState<Partial<Omit<Product, "price">> & { price: string }>({
        seller: user?.id || "",
        name: "",
        description: "",
        category: "",
        price: "0",
        currency: "",
        stock: 0,
        location: "",
        condition: "",
        images: [],
        tags: [],
        isService: false,
        addressWallet: "",
    });

    const handleInputChange = (name: string, value: string) => {
        setInfoProduct(prev => ({ ...prev, [name]: value }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setInfoProduct(prev => ({ ...prev, images: [...(prev.images || []), result.assets[0].uri] }));
        }
    };

    const handleSubmit = () => {
        // Logic to send data to the server would go here
        console.log(infoProduct);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Publish a Product</Text>
            <TextInput style={styles.input} placeholder="Product Name" onChangeText={(value) => handleInputChange('name', value)} />
            <TextInput style={styles.input} placeholder="Description" multiline onChangeText={(value) => handleInputChange('description', value)} />
            <TextInput style={styles.input} placeholder="Category" onChangeText={(value) => handleInputChange('category', value)} />
            <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" onChangeText={(value) => handleInputChange('price', value)} />
            <TextInput style={styles.input} placeholder="Currency" onChangeText={(value) => handleInputChange('currency', value)} />
            <TextInput style={styles.input} placeholder="Stock" keyboardType="numeric" onChangeText={(value) => handleInputChange('stock', value)} />
            <TextInput style={styles.input} placeholder="Location" onChangeText={(value) => handleInputChange('location', value)} />
            <TextInput style={styles.input} placeholder="Condition" onChangeText={(value) => handleInputChange('condition', value)} />
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <View style={styles.imageContainer}>
                {(infoProduct.images || []).map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </View>
            <Button title="Publish Product" onPress={handleSubmit} />
        </ScrollView>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
});

export default UploadProductScreen;
