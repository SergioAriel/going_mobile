import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useUser } from "@/context/UserContext";
import { Product } from "@/interfaces";
import { getProducts } from "@/lib/ServerActions/products";
import { Link, useRouter, } from 'expo-router';

export default function SellingTab() {
    const { userData } = useUser();
    const [userProducts, setUserProducts] = useState<Product[] | null>();
    const navigation = useRouter();

    useEffect(() => {
        if (userData.isSeller) {
            (async () => {
                const products = await getProducts({ seller: userData._id });
                if (products.length) {
                    setUserProducts(products);
                }
            })();
        }
    }, [userData]);

    if (!userData.isSeller) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-center mb-4">To become a seller, please add an address.</Text>
                <TouchableOpacity className="bg-blue-500 p-3 rounded-md" onPress={() => navigation.push('/profile')}>
                    <Text className="text-white font-bold">Add Address</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5 bg-gray-100">
            <Link href="/uploadProduct" asChild>
                <TouchableOpacity className="bg-blue-500 p-3 rounded-md mb-5">
                    <Text className="text-white text-center font-bold">+ Add New Product</Text>
                </TouchableOpacity>
            </Link>
            <FlatList
                data={userProducts}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <View className="p-4 bg-white rounded-lg shadow-md mb-3 flex-row justify-between">
                        <Text className="font-bold">{item.name}</Text>
                        <Text>${item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
};
