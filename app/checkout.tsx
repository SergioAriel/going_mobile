'use client';

import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart, useAlert, useCurrencies, useUser } from '@/context';
import { Address, CartItem, NewOrderPayload, Product } from '@/interfaces';
import { getProducts } from '@/lib/ServerActions/products';
import { createPendingOrder, getOrder } from '@/lib/ServerActions/orders';
import { CheckoutComplete } from '@/lib/ServerActions/checkout';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { useEmbeddedSolanaWallet, usePrivy } from '@privy-io/expo';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Connection, PublicKey, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL, TransactionMessage, VersionedTransaction, TransactionInstruction } from '@solana/web3.js';
import { AppText } from '@/components/app-text';
import { toByteArray } from 'react-native-quick-base64';
import { Picker } from '@react-native-picker/picker';
import { updateUser } from '@/lib/ServerActions/users';

const CheckoutScreen = () => {
  const { items, clearCart } = useCart();
  const { getAccessToken } = usePrivy();
  const { productId, quantity, orderId } = useLocalSearchParams<{ productId: string, quantity: string, orderId: string }>();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      if (orderId) {
        const token = await getAccessToken();
        if (!token) { 
            setLoading(false); 
            return; 
        }
        const order = await getOrder(orderId, token);
        if (order) {
          const productIds = order.items.map((item: CartItem) => item._id);
          const products = await getProducts({find:{_id: { $in: productIds } }});
          const updatedItems = order.items.map((item: CartItem) => {
            const product = products.find((p: Product) => p._id === item._id);
            return product && product.publishStatus === "published"
              ? { ...product, quantity: item.quantity }
              : { ...item, name: `${item.name} (Not Available)`, price: 0, quantity: 0 };
          });
          setCheckoutItems(updatedItems.filter(item => item.quantity > 0));
        }
      } else if (productId && quantity) {
        const products = await getProducts({find: { _id: productId }});
        if (products && products.length > 0) {
          setCheckoutItems([{ ...products[0], quantity: Number(quantity) }]);
        }
      } else {
        setCheckoutItems(items);
      }
      setLoading(false);
    };
    loadItems();
  }, [orderId, productId, quantity, items, getAccessToken]);

  if (loading) {
    return <AppPage className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#14BFFB" /></AppPage>;
  }

  return <CheckoutUI items={checkoutItems} clearCart={clearCart} />;
};

const CheckoutUI = ({ items, clearCart }: { items: CartItem[], clearCart?: () => void }) => {
  const { user, getAccessToken } = usePrivy();
  const { wallets: privyWallets } = useEmbeddedSolanaWallet();
  const { userData, setUserData } = useUser();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
  const { handleAlert } = useAlert();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({ name: "", street: "", city: "", state: "", zipCode: "", country: "", phone: "", email: user?.email || "" });
  const [saveAddress, setSaveAddress] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAddress = async () => {
    const { name, street, city, state, zipCode, country, phone, email } = address;
    if (!name || !street || !city || !state || !zipCode || !country || !phone || !email) {
        handleAlert({ isError: true, message: "Please fill all address fields." });
        return;
    }

    if (saveAddress) {
        const isNewAddress = !userData.addresses.some(a => a.name === address.name);
        if (isNewAddress) {
            try {
                const updatedUser = await updateUser({ addresses: [...userData.addresses, address] }, userData._id?.toString() || "", await getAccessToken() || "");
                setUserData(updatedUser); // Update user context
            } catch (error) {
                console.error("Failed to save new address:", error);
                handleAlert({ isError: true, message: "Could not save new address. Please try again." });
                return; // Stop if saving address fails
            }
        }
    }
    setStep(2);
  }

  const buildTransactionInstructions = (payer: PublicKey): TransactionInstruction[] => {
    const solPrice = listCryptoCurrencies.find(c => c.symbol === "SOL")?.price || 1;
    const objectPayments = items.reduce((acc, item) => {
        const priceInDollars = (listCryptoCurrencies.find(c => c.symbol === item.currency)?.price || 1) * item.price;
        const totalAmount = priceInDollars * (1 - (item.offerPercentage || 0) / 100) * item.quantity;
        acc[item.addressWallet] = (acc[item.addressWallet] || 0) + totalAmount;
        return acc;
    }, {} as { [key: string]: number });

    return Object.entries(objectPayments).map(([recipient, amount]) => {
        const lamports = Math.round((amount / solPrice) * LAMPORTS_PER_SOL);
        return SystemProgram.transfer({ fromPubkey: payer, toPubkey: new PublicKey(recipient), lamports });
    });
  }

  const handlePayWithPrivy = async () => {
    setLoading(true);
    const privyWallet = wallets.find(w => w.walletClientType === 'privy');
    if (!privyWallet) {
        handleAlert({ isError: true, message: "Privy wallet not found." });
        setLoading(false);
        return;
    }

    try {
        const token = await getAccessToken();
        if (!token) throw new Error("Authentication failed.");

        const orderPayload: NewOrderPayload = {
            buyer: { walletAddress: privyWallet.address, _id: user?.id, address },
            status: "payment_pending", date: new Date(),
            sellers: [...new Set(items.map(item => item.seller))],
            items: items
        };
        const orderId = await createPendingOrder(orderPayload, token);
        if (!orderId) throw new Error("Failed to create pending order.");

        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const { value: latestBlockhash } = await connection.getLatestBlockhashAndContext();
        const instructions = buildTransactionInstructions(new PublicKey(privyWallet.address));
        const txMessage = new TransactionMessage({ payerKey: new PublicKey(privyWallet.address), recentBlockhash: latestBlockhash.blockhash, instructions }).compileToV0Message();
        const transaction = new VersionedTransaction(txMessage);
        
        const provider = await privyWallet.getProvider();
        const { signature } = await provider.request({
            method: 'signAndSendTransaction',
            params: { transaction, connection },
        });

        await CheckoutComplete({ orderId, signature, items, buyer: orderPayload.buyer }, token);

        setOrderNumber(orderId);
        if (clearCart) clearCart();
        setOrderCompleted(true);
        setStep(3);

    } catch (error) {
        console.error("Privy Payment Error:", error);
        handleAlert({ isError: true, message: "Payment failed. Please try again." });
    } finally {
        setLoading(false);
    }
  };

  const handlePayWithMWA = async () => {
    setLoading(true);
    try {
        const token = await getAccessToken();
        if (!token) throw new Error("Authentication failed.");

        const orderPayload: NewOrderPayload = {
            buyer: { walletAddress: '*', _id: user?.id, address },
            status: "payment_pending", date: new Date(),
            sellers: [...new Set(items.map(item => item.seller))],
            items: items
        };
        const orderId = await createPendingOrder(orderPayload, token);

        const { signature, walletAddress } = await transact(async (wallet) => {
            const authResult = await wallet.authorize({ chain: 'solana:devnet', identity: { name: 'Going' } });
            const payer = new PublicKey(toByteArray(authResult.accounts[0].address));
            
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
            const { value: latestBlockhash } = await connection.getLatestBlockhashAndContext();
            const instructions = buildTransactionInstructions(payer);
            const txMessage = new TransactionMessage({ payerKey: payer, recentBlockhash: latestBlockhash.blockhash, instructions }).compileToV0Message();
            const transaction = new VersionedTransaction(txMessage);

            const signedTransactions = await wallet.signAndSendTransactions({ transactions: [transaction] });

            return { signature: signedTransactions[0], walletAddress: payer.toBase58() };
        });

        const finalBuyerPayload = { ...orderPayload.buyer, walletAddress };

        await CheckoutComplete({ orderId, signature, items, buyer: finalBuyerPayload }, token);

        setOrderNumber(orderId);
        if (clearCart) clearCart();
        setOrderCompleted(true);
        setStep(3);

    } catch (error) {
        console.error("MWA Payment Error:", error);
        handleAlert({ isError: true, message: "Payment failed. Please try again." });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const priceInDollars = (listCryptoCurrencies.find(c => c.symbol === item.currency)?.price || 1) * item.price;
      return sum + (priceInDollars * item.quantity);
    }, 0);
    setTotalPrice(total / (userCurrency.price || 1));
  }, [items, listCryptoCurrencies, userCurrency]);

  if (orderCompleted) {
    return (
      <AppPage className="flex-1 justify-center items-center p-5">
        <AntDesign name="checkcircleo" size={50} color="green" />
        <AppText type="title" className="my-5">Order Completed!</AppText>
        <AppText>Thank you for your purchase. Your order {orderNumber.slice(-6)} has been successfully processed.</AppText>
        <TouchableOpacity onPress={() => router.push('/')} className="bg-primary p-3 rounded-lg mt-5"><AppText className="text-white font-bold">Back to Home</AppText></TouchableOpacity>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View className="flex-row justify-around mb-5">
          <AppText className={step === 1 ? 'font-bold text-primary' : 'text-gray-400'}>1. Address</AppText>
          <AppText className={step === 2 ? 'font-bold text-primary' : 'text-gray-400'}>2. Payment</AppText>
          <AppText className={step === 3 ? 'font-bold text-primary' : 'text-gray-400'}>3. Confirmation</AppText>
        </View>

        {step === 1 && (
          <View>
            <AppText type="subtitle" className="mb-4">Shipping Address</AppText>

            {userData && userData.addresses && userData.addresses.length > 0 && (
              <View className="border border-gray-300 rounded-md mb-4">
                <Picker
                  selectedValue={address}
                  onValueChange={(itemValue) => itemValue && setAddress(itemValue)}
                >
                  <Picker.Item label="Select a saved address..." value={null} />
                  {userData.addresses.map((addr, index) => (
                    <Picker.Item key={index} label={addr.name} value={addr} />
                  ))}
                </Picker>
              </View>
            )}

            <TextInput placeholder="Address Name (e.g. Home)" value={address.name} onChangeText={(text) => handleAddressChange('name', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Street" value={address.street} onChangeText={(text) => handleAddressChange('street', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="City" value={address.city} onChangeText={(text) => handleAddressChange('city', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="State" value={address.state} onChangeText={(text) => handleAddressChange('state', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Zip Code" value={address.zipCode} onChangeText={(text) => handleAddressChange('zipCode', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Country" value={address.country} onChangeText={(text) => handleAddressChange('country', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Phone" value={address.phone} onChangeText={(text) => handleAddressChange('phone', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Email" value={address.email} onChangeText={(text) => handleAddressChange('email', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            
            <View className="flex-row items-center justify-between my-4">
                <AppText>Save this address for future use?</AppText>
                <Switch value={saveAddress} onValueChange={setSaveAddress} />
            </View>

            <AppText className="text-xs text-gray-500 text-center mb-4">For your security, this delivery address will be removed from the shipment record upon completion.</AppText>

            <TouchableOpacity onPress={handleSubmitAddress} className="bg-primary p-4 rounded-lg items-center mt-4">
              <AppText className="text-white text-lg font-bold">Continue to Payment</AppText>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <AppText type="subtitle" className="mb-4">Payment</AppText>
            <View className="p-4 border border-gray-200 rounded-lg mb-5">
                <AppText type="defaultSemiBold" className="mb-2">Order Summary</AppText>
                {items.map(item => (
                    <View key={item._id} className="flex-row justify-between py-1">
                        <AppText className="text-gray-600">{item.name} x {item.quantity}</AppText>
                        <AppText className="text-gray-800">{item.price.toFixed(2)} {item.currency}</AppText>
                    </View>
                ))}
                <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200">
                    <AppText type="defaultSemiBold">Total</AppText>
                    <AppText type="defaultSemiBold">{totalPrice.toFixed(2)} {userCurrency.currency}</AppText>
                </View>
            </View>
            
            <TouchableOpacity onPress={handlePayWithPrivy} disabled={loading} className={`bg-blue-500 p-4 rounded-lg items-center mb-3 ${loading && 'opacity-50'}`}>
              {loading ? <ActivityIndicator color="white" /> : <AppText className="text-white font-bold">Pay with Privy Wallet</AppText>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePayWithMWA} disabled={loading} className={`bg-purple-600 p-4 rounded-lg items-center ${loading && 'opacity-50'}`}>
              {loading ? <ActivityIndicator color="white" /> : <AppText className="text-white font-bold">Pay with External Wallet</AppText>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)} disabled={loading} className={`bg-gray-500 p-4 rounded-lg items-center mt-5 ${loading && 'opacity-50'}`}>
              <AppText className="text-white font-bold">Back to Address</AppText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppPage>
  );
};

export default CheckoutScreen;
