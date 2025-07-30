
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from '@/context/CartContext';

const Header = () => {
    const { getTotalItems } = useCart();
    const itemCount = getTotalItems();

    return (
        <View style={styles.container}>
            <View style={styles.actions}>
                <Link href="/cart" asChild>
                    <TouchableOpacity>
                        <Text>Cart ({itemCount})</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/profile" asChild>
                    <TouchableOpacity>
                        <Text>Profile</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    actions: {
        flexDirection: 'row',
    },
});

export default Header;
