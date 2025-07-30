
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
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
            <View style={styles.container}>
                <Text>To become a seller, please add an address.</Text>
                <Button title="Add Address" onPress={() => navigation.push('/ProfileScreen')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Link href="/UploadProductScreen" asChild><Button title="+ Add New Product" /></Link>
            <FlatList
                data={userProducts}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text>${item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    productContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productName: {
        fontWeight: 'bold',
    },
});
