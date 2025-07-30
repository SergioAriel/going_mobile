
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { AddressForm } from '@/interfaces';
import { uploadOrder, updateOrder } from '../lib/ServerActions/orders';
import { usePrivy, useSolanaWallets } from '@privy-io/expo';
import { Connection, Transaction, SystemProgram, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const CheckoutScreen = () => {
    const { items, clearCart } = useCart();
    const { user } = usePrivy();
    const { wallets } = useSolanaWallets();

    const [step, setStep] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [address, setAddress] = useState<AddressForm>({
        fullName: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
    });

    const handleAddressChange = (name: string, value: string) => {
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitAddress = () => {
        if (Object.values(address).some(value => value.trim() === "")) {
            alert("Please fill all fields");
            return;
        }
        setStep(2);
    };

    const handleSubmitPayment = async () => {
        if (!selectedPayment) {
            alert("Please select a payment method");
            return;
        }

        const wallet = wallets.find((wallet) => wallet.address === selectedPayment);
        if (!wallet) {
            alert("Wallet not found");
            return;
        }

        try {
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
            const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();

            const transaction = new Transaction();
            // This is a simplified example. In a real app, you would calculate the total amount based on the items in the cart.
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(wallet.address),
                    toPubkey: new PublicKey("RECIPIENT_ADDRESS"), // Replace with the recipient's address
                    lamports: 0.1 * LAMPORTS_PER_SOL, // Example amount
                })
            );
            transaction.recentBlockhash = recentBlockhash;
            transaction.feePayer = new PublicKey(wallet.address);

            const signedTransaction = await wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            const orderId = await uploadOrder({
                date: new Date(),
                buyer: {
                    walletAddress: wallet.address,
                    _id: user?.id
                },
                decryptedAddress: address,
                status: "processing",
                sellers: [...(new Set(items.map((item) => item.seller)))],
                items: items,
                _id: 'temp-id',
                signature: 'temp-sig'
            })

            await updateOrder({ _id: orderId, signature });

            clearCart();
            setStep(3);
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Error processing payment");
        }
    };

    if (step === 3) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Order Completed!</Text>
                <Text>Thank you for your purchase.</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {step === 1 && (
                <View>
                    <Text style={styles.title}>Shipping Address</Text>
                    <TextInput style={styles.input} placeholder="Full Name" onChangeText={(value) => handleAddressChange('fullName', value)} />
                    <TextInput style={styles.input} placeholder="Address" onChangeText={(value) => handleAddressChange('street', value)} />
                    <TextInput style={styles.input} placeholder="City" onChangeText={(value) => handleAddressChange('city', value)} />
                    <TextInput style={styles.input} placeholder="State/Province" onChangeText={(value) => handleAddressChange('state', value)} />
                    <TextInput style={styles.input} placeholder="Zip Code" onChangeText={(value) => handleAddressChange('zipCode', value)} />
                    <TextInput style={styles.input} placeholder="Country" onChangeText={(value) => handleAddressChange('country', value)} />
                    <TextInput style={styles.input} placeholder="Contact Phone" onChangeText={(value) => handleAddressChange('phone', value)} />
                    <TextInput style={styles.input} placeholder="Contact Email" onChangeText={(value) => handleAddressChange('email', value)} />
                    <Button title="Continue to Payment" onPress={handleSubmitAddress} />
                </View>
            )}
            {step === 2 && (
                <View>
                    <Text style={styles.title}>Payment Method</Text>
                    {wallets.map((wallet) => (
                        <TouchableOpacity key={wallet.address} onPress={() => setSelectedPayment(wallet.address)} style={[styles.wallet, selectedPayment === wallet.address && styles.selectedWallet]}>
                            <Text>{wallet.address}</Text>
                        </TouchableOpacity>
                    ))}
                    <Button title="Proceed to Payment" onPress={handleSubmitPayment} />
                </View>
            )}
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
    wallet: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    selectedWallet: {
        borderColor: 'blue',
    }
});

export default CheckoutScreen;
