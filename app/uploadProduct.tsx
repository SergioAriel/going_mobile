import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePrivy } from '@privy-io/expo';
import { Product, ShippingType, Address } from '@/interfaces';
import * as ImagePicker from 'expo-image-picker';
import { useUser, useAlert } from '@/context';
import { Picker } from '@react-native-picker/picker';
import { uploadProduct } from '@/lib/ServerActions/products';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/app-text';
import { AppPage } from '@/components/app-page';
import { Section } from '@/components/ui/Section';
import { CustomTextInput } from '@/components/ui/CustomTextInput';
import { PickerContainer } from '@/components/ui/PickerContainer';
import { ChoiceGroup } from '@/components/ui/ChoiceGroup';
import { ChoiceButton } from '@/components/ui/ChoiceButton';

const UploadProductScreen = () => {
    const { user } = usePrivy();
    const { userData } = useUser();
    const { handleAlert } = useAlert();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoProduct, setInfoProduct] = useState<Partial<Omit<Product, "price" | "stock" | "estimatedDeliveryDays" | "publishStatus" | "pickupAddress">> & { price: string, stock: string, shippingType: ShippingType, estimatedDeliveryDays: string, publishStatus: "published" | "unpublished", pickupAddress: Address | null }> ({
        seller: user?.id || "",
        name: "",
        description: "",
        category: "",
        price: "0",
        currency: "USDT",
        stock: "0",
        location: "",
        condition: "",
        images: [],
        tags: [],
        isService: false,
        addressWallet: "",
        shippingType: 'going_network',
        weight_kg: "0",
        width_cm: "0",
        height_cm: "0",
        depth_cm: "0",
        isFragile: false,
        estimatedDeliveryDays: "0",
        publishStatus: "published",
        pickupAddress: null,
    });

    const handleInputChange = (name: string, value: any) => {
        setInfoProduct(prev => ({ ...prev, [name]: value }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            setInfoProduct(prev => ({ ...prev, images: [...(prev.images || []), ...uris] }));
        }
    };

    const handleSubmit = async () => {
        if (!infoProduct.pickupAddress) {
            handleAlert({isError: true, message: 'Please select a pickup address.'});
            return;
        }
        if (!infoProduct.addressWallet) {
            handleAlert({isError: true, message: 'Please select a wallet address.'});
            return;
        }
        setLoading(true);

        const formData = new FormData();
        Object.entries(infoProduct).forEach(([key, value]) => {
            if (key === 'images' && Array.isArray(value)) {
                value.forEach(uri => {
                    const uriParts = uri.split('.');
                    const fileType = uriParts[uriParts.length - 1];
                    formData.append('images', { uri, name: `photo.${fileType}`, type: `image/${fileType}` } as any);
                });
            } else if (key === 'pickupAddress' && value) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        });

        try {
            await uploadProduct(formData);
            handleAlert({isError: false, message: 'Product published successfully!'});
            router.push('/(tabs)/profile');
        } catch (error) {
            console.error('Failed to publish product:', error);
            handleAlert({isError: true, message: 'Failed to publish product. Please try again.'});
        } finally {
            setLoading(false);
        }
    };

    const walletAccounts = user?.linked_accounts.filter(acc => acc.type === 'wallet');

    return (
        <AppPage>
            <ScrollView className="flex-1 p-4 bg-gray-50">
                <AppText type="title" className="text-2xl font-bold mb-6 text-gray-800">Publish a Product</AppText>
                
                <Section title="Product Details">
                    <CustomTextInput placeholder="Product Name" onChangeText={(value) => handleInputChange('name', value)} />
                    <CustomTextInput placeholder="Description" multiline onChangeText={(value) => handleInputChange('description', value)} />
                    <CustomTextInput placeholder="Category" onChangeText={(value) => handleInputChange('category', value)} />
                </Section>

                <Section title="Shipping Method">
                    <ChoiceGroup>
                        <ChoiceButton title="GOING Logistics" selected={infoProduct.shippingType === 'going_network'} onPress={() => handleInputChange('shippingType', 'going_network')} />
                        <ChoiceButton title="Self-Delivery" selected={infoProduct.shippingType === 'self_delivery'} onPress={() => handleInputChange('shippingType', 'self_delivery')} />
                    </ChoiceGroup>
                    {infoProduct.shippingType === 'self_delivery' && (
                        <CustomTextInput placeholder="Estimated Delivery Days" keyboardType="numeric" onChangeText={(value) => handleInputChange('estimatedDeliveryDays', value)} />
                    )}
                </Section>

                <Section title="Pickup Address">
                    <PickerContainer>
                        <Picker selectedValue={infoProduct.pickupAddress} onValueChange={(itemValue, itemIndex) => itemIndex > 0 && handleInputChange('pickupAddress', userData?.addresses[itemIndex - 1])}>
                            <Picker.Item label="Select a pickup address..." value={null} />
                            {userData?.addresses.map((address, index) => (
                                <Picker.Item key={index} label={address.name} value={address} />
                            ))}
                        </Picker>
                    </PickerContainer>
                </Section>

                <Section title="Price and Payment">
                    <PickerContainer>
                        <Picker selectedValue={infoProduct.addressWallet} onValueChange={(itemValue) => handleInputChange('addressWallet', itemValue)}>
                            <Picker.Item label="Select a wallet..." value="" />
                            {walletAccounts?.map((account) => (
                                <Picker.Item key={account.address} label={`${account.address.slice(0, 6)}...${account.address.slice(-4)}`} value={account.address} />
                            ))}
                        </Picker>
                    </PickerContainer>
                    <CustomTextInput placeholder="Price" keyboardType="numeric" onChangeText={(value) => handleInputChange('price', value)} />
                    <PickerContainer>
                        <Picker selectedValue={infoProduct.currency} onValueChange={(itemValue) => handleInputChange('currency', itemValue)}>
                            <Picker.Item label="USDT" value="USDT" />
                            <Picker.Item label="SOL" value="SOL" />
                        </Picker>
                    </PickerContainer>
                    <CustomTextInput placeholder="Stock" keyboardType="numeric" onChangeText={(value) => handleInputChange('stock', value)} />
                </Section>

                <Section title="Images">
                    <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded-lg items-center mb-4">
                        <AppText className="text-white font-bold">Pick Images</AppText>
                    </TouchableOpacity>
                    <View className="flex-row flex-wrap">
                        {(infoProduct.images || []).map((uri, index) => (
                            <Image key={index} source={{ uri: uri as string }} className="w-24 h-24 rounded-lg m-1" />
                        ))}
                    </View>
                </Section>

                <Section title="Publish Status">
                    <ChoiceGroup>
                        <ChoiceButton title="Published" selected={infoProduct.publishStatus === 'published'} onPress={() => handleInputChange('publishStatus', 'published')} />
                        <ChoiceButton title="Unpublished" selected={infoProduct.publishStatus === 'unpublished'} onPress={() => handleInputChange('publishStatus', 'unpublished')} />
                    </ChoiceGroup>
                </Section>

                <View className="mt-8 mb-20">
                    {loading ? (
                        <ActivityIndicator size="large" color="#14BFFB" />
                    ) : (
                        <TouchableOpacity onPress={handleSubmit} className="bg-primary p-4 rounded-lg items-center">
                            <AppText className="text-white text-lg font-bold">Publish Product</AppText>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </AppPage>
    );
};

export default UploadProductScreen;