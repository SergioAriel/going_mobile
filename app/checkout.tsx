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
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCart, useAlert, useCurrencies } from '@/context';
import { AddressForm, CartItem, Order } from '@/interfaces';
import { getOneProduct } from '@/lib/ServerActions/products';
import { uploadOrder, updateOrder, getOrder } from '@/lib/ServerActions/orders';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { usePrivy, useEmbeddedSolanaWallet } from '@privy-io/expo';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Connection, PublicKey, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL, TransactionMessage, VersionedTransaction, TransactionInstruction } from '@solana/web3.js';
import { AppText } from '@/components/app-text';
import { toByteArray } from 'react-native-quick-base64';
import bs58 from 'bs58';

// Componente principal que carga los datos del checkout
const CheckoutScreen = () => {
  const { items, clearCart } = useCart();
  const { productId, quantity, orderId } = useLocalSearchParams<{ productId: string, quantity: string, orderId: string }>();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isCartPurchase, setIsCartPurchase] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      if (orderId) {
        setIsCartPurchase(false);
        try {
          const order = await getOrder({ _id: orderId });
          if (order) {
            setCheckoutItems(order.items);
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      } else if (productId && quantity) {
        setIsCartPurchase(false);
        try {
          const response = await getOneProduct({ _id: productId });
          if (response && response.product) {
            setCheckoutItems([{ ...response.product, quantity: Number(quantity) }]);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      } else {
        setIsCartPurchase(true);
        setCheckoutItems(items);
      }
      setLoading(false);
    };
    loadItems();
  }, [orderId, productId, quantity, items]);

  if (loading) {
    return (
      <AppPage className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#14BFFB" />
      </AppPage>
    );
  }

  return <CheckoutUI items={checkoutItems} clearCart={clearCart} step={step} setStep={setStep} isCartPurchase={isCartPurchase} />;
};

// Componente de UI para el proceso de checkout
const CheckoutUI = ({ items, clearCart, step, setStep, isCartPurchase }: { items: CartItem[], clearCart?: () => void, step: number, setStep: (step: number) => void, isCartPurchase: boolean }) => {
  const { user, getAccessToken } = usePrivy();
  const { wallets: privyWallets } = useEmbeddedSolanaWallet();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
  const { handleAlert } = useAlert();

  const [address, setAddress] = useState<AddressForm>({ fullName: "", street: "", city: "", state: "", zipCode: "", country: "", phone: "", email: "" });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isPrivyConfirmationModalVisible, setIsPrivyConfirmationModalVisible] = useState(false);
  const [privyWalletBalance, setPrivyWalletBalance] = useState<number | null>(null);

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAddress = () => setStep(2);

  const completeCheckout = (orderId: string, token: string) => {
    updateOrder({ _id: orderId, status: "payment_confirmed" }, token)
    setOrderNumber(orderId);
    if (isCartPurchase && clearCart) {
      clearCart();
    }
    setOrderCompleted(true);
    setStep(3);
    setLoading(false);
  };

  const handlePayWithPrivyWallet = async () => {
    if (!privyWallets || privyWallets?.length === 0) {
      handleAlert({ isError: true, message: "No Privy wallets available." });
      return;
    }
    try {
      setLoading(true);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const balance = await connection.getBalance(new PublicKey(privyWallets[0].address));
      setPrivyWalletBalance(balance / LAMPORTS_PER_SOL);
      setIsPrivyConfirmationModalVisible(true);
    } catch (error) {
      console.error("Error fetching Privy wallet balance:", error);
      handleAlert({ isError: true, message: "Could not fetch wallet balance." });
    } finally {
      setLoading(false);
    }
  };

  const confirmPayWithPrivyWallet = async () => {
    setIsPrivyConfirmationModalVisible(false);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Failed to get access token.");
      if (!privyWallets || privyWallets?.length === 0) {
        throw new Error("No Privy wallets available.");
      }
      const selectedWallet = privyWallets[0];

      const provider = await selectedWallet.getProvider();
      if (!provider) {
        throw new Error("No Privy wallet provider available.");
      }

      const orderId = await uploadOrder({
        date: new Date(),
        buyer: { walletAddress: selectedWallet.address, _id: user?.id },
        decryptedAddress: address,
        status: "payment_pending",
        items: items,
        sellers: [...new Set(items.map((item) => item.seller))],
      }, token);

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const {
        value: latestBlockhash
      } = await connection.getLatestBlockhashAndContext();
      
      const solPrice = listCryptoCurrencies.find(c => c.symbol === "SOL")?.price || 1;
      const objectPayments = items
        .filter(item => item.addressWallet)
        .reduce((acc, item) => {
          const priceInDollars = (listCryptoCurrencies.find(c => c.symbol === item.currency)?.price || 1) * item.price;
          const totalAmount = priceInDollars * (1 - (item.offerPercentage || 0) / 100) * item.quantity;
          const recipient = item.addressWallet;
          acc[recipient] = (acc[recipient] || 0) + totalAmount;
          return acc;
        }, {} as { [key: string]: number });

      if (Object.keys(objectPayments).length === 0) {
        throw new Error("Transaction has no instructions. Check if items have seller wallets.");
      }

      const instructions: TransactionInstruction[] = Object.entries(objectPayments).map(([recipient, amount]) => {
        const lamports = Math.round((amount / solPrice) * LAMPORTS_PER_SOL);
        return SystemProgram.transfer({
          fromPubkey: new PublicKey(selectedWallet.address),
          toPubkey: new PublicKey(recipient),
          lamports,
        });
      });

      const txMessage = new TransactionMessage({
        payerKey: new PublicKey(selectedWallet.address),
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToV0Message();

      const transferTx = new VersionedTransaction(txMessage);

      const { signature: txSignature } = await provider.request({
        method: 'signAndSendTransaction',
        params: {
          transaction: transferTx,
          connection,
        },
      });

      const confirmTransaction = await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txSignature,
      });

      if (!confirmTransaction.value.err) {
        completeCheckout(txSignature, token);
      } else {
        await updateOrder({ _id: orderId, status: "payment_failed" }, token)
        throw new Error("Transaction confirmation failed.");
      }

      return txSignature;
    } catch (error) {
      console.error("Privy Wallet Error:", error);
      handleAlert({ isError: true, message: "Failed to pay with Privy Wallet. Please try again." });
    } finally {
      setLoading(false);
    }
  }


  const payWithSolanaMobileWallet = async () => {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to get access token.");
    let orderId: string | null = null; // Declare orderId here
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const {
        context: { slot: minContextSlot },
        value: latestBlockhash
      } = await connection.getLatestBlockhashAndContext();

      orderId = await uploadOrder({
        date: new Date(),
        decryptedAddress: address,
        status: "payment_pending",
        items: items,
        sellers: [...new Set(items.map((item) => item.seller))],
      }, token);

      const txSignature = await transact(async (wallet) => {
        // 1. Authorize first
        const authorizationResult = await wallet.authorize({
          chain: 'solana:devnet',
          identity: { name: 'Going', uri: 'https://going.website/', icon: 'favicon.ico' },
        });

        const authorizedPubkey = new PublicKey(
          toByteArray(authorizationResult.accounts[0].address)
        );

        // Update the order with the buyer's wallet address
        await updateOrder({
          _id: orderId,
          buyer: { walletAddress: bs58.encode(Buffer.from(authorizationResult.accounts[0].address, 'base64')), _id: user?.id },
        } as Order, token);

        // 3. Build the transaction
        const solPrice = listCryptoCurrencies.find(c => c.symbol === "SOL")?.price || 1;
        const objectPayments = items
          .filter(item => item.addressWallet)
          .reduce((acc, item) => {
            const priceInDollars = (listCryptoCurrencies.find(c => c.symbol === item.currency)?.price || 1) * item.price;
            const totalAmount = priceInDollars * (1 - (item.offerPercentage || 0) / 100) * item.quantity;
            const recipient = item.addressWallet;
            acc[recipient] = (acc[recipient] || 0) + totalAmount;
            return acc;
          }, {} as { [key: string]: number });

        if (Object.keys(objectPayments).length === 0) {
          throw new Error("Transaction has no instructions. Check if items have seller wallets.");
        }

        const instructions: TransactionInstruction[] = Object.entries(objectPayments).map(([recipient, amount]) => {
          const lamports = Math.round((amount / solPrice) * LAMPORTS_PER_SOL);
          return SystemProgram.transfer({
            fromPubkey: authorizedPubkey,
            toPubkey: new PublicKey(recipient),
            lamports,
          });
        });


        const txMessage = new TransactionMessage({
          payerKey: authorizedPubkey, // Use the correctly decoded PublicKey
          recentBlockhash: latestBlockhash.blockhash,
          instructions,
        }).compileToV0Message();

        const transferTx = new VersionedTransaction(txMessage);

        // 4. Sign and send
        const transactionSignatures = await wallet.signAndSendTransactions({
          transactions: [transferTx],
          minContextSlot
        });

        return transactionSignatures[0];
      });

      // 5. Confirm the transaction

      const confirmTransaction = await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txSignature,
      });
      if (!confirmTransaction.value.err) {
        completeCheckout(txSignature, token);
      } else {
        if (orderId) {
          await updateOrder({ _id: orderId, status: "payment_failed" }, token)
        }
        throw new Error("Transaction confirmation failed.");
      }
    } catch (error) {
      console.error("Solana Mobile Wallet Error:", error);
      if (orderId) {
        await updateOrder({ _id: orderId, status: "payment_failed" }, token)
      }
      throw new Error("Failed to pay with Solana Mobile Wallet. Please try again.");
    }
  }



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
        <AppText>Thank you for your purchase. Your order {orderNumber} has been successfully processed.</AppText>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <ScrollView className="p-5">
        {/* Progress Indicator */}
        <View className="flex-row justify-around items-center mb-5">
          <AppText className={step === 1 ? 'font-bold' : 'font-normal'}>1. Address</AppText>
          <AppText className={step === 2 ? 'font-bold' : 'font-normal'}>2. Payment</AppText>
          <AppText className={step === 3 ? 'font-bold' : 'font-normal'}>3. Confirmation</AppText>
        </View>

        {step === 1 && (
          <View>
            <AppText type="subtitle" className="mb-5">Shipping Address</AppText>
            <TextInput placeholder="Full Name" onChangeText={(text) => handleAddressChange('fullName', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Street" onChangeText={(text) => handleAddressChange('street', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="City" onChangeText={(text) => handleAddressChange('city', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="State" onChangeText={(text) => handleAddressChange('state', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Zip Code" onChangeText={(text) => handleAddressChange('zipCode', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Country" onChangeText={(text) => handleAddressChange('country', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Phone" onChangeText={(text) => handleAddressChange('phone', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TextInput placeholder="Email" onChangeText={(text) => handleAddressChange('email', text)} className="border border-gray-300 p-3 rounded-md mb-3" />
            <TouchableOpacity onPress={handleSubmitAddress} className="bg-primary p-4 rounded-lg items-center mt-5">
              <AppText className="text-white text-lg font-bold">Continue to Payment</AppText>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <AppText type="subtitle" className="mb-5">Payment Method</AppText>

            <AppText type="defaultSemiBold" className="my-2.5">Privy Wallets</AppText>
            {/* {privyWallets?.map((wallet) => (
              <TouchableOpacity key={wallet.address} onPress={() => payWithPrivyWallet()} className={`border border-gray-300 p-3 rounded-md mb-3 ${selectedWalletInfo?.address === wallet.address ? 'border-primary border-2' : ''}`}>
                <AppText>Privy Wallet: {wallet.address.slice(0, 6)}...</AppText>
              </TouchableOpacity>
            ))} */}

            <AppText type="defaultSemiBold" className="my-2.5">Solana Mobile Wallets</AppText>
            {/* {accounts.length > 0 ? (
              accounts.map((account) => (
                <TouchableOpacity key={account.address} onPress={() => setSelectedWalletInfo({ address: account.address, type: 'mwa' })} className={`border border-gray-300 p-3 rounded-md mb-3 ${selectedWalletInfo?.address === account.address ? 'border-primary border-2' : ''}`}>
                  <AppText>Solana Wallet: {account.address.slice(0, 6)}...</AppText>
                </TouchableOpacity>
              ))
            ) : 
            ( */}
            <TouchableOpacity onPress={handlePayWithPrivyWallet} className="bg-primary p-4 rounded-lg items-center mt-5">
              <AppText className="text-white text-lg font-bold">Pay with Privy Mobile Wallet</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => payWithSolanaMobileWallet()} className="bg-primary p-4 rounded-lg items-center mt-5">
              <AppText className="text-white text-lg font-bold">Pay with Solana Mobile Wallet {totalPrice.toFixed(2)} {userCurrency.currency}</AppText>
            </TouchableOpacity>
            {/* )} */}

            {/* <TouchableOpacity onPress={handleSubmitPayment} disabled={loading || !selectedWalletInfo} className="bg-primary p-4 rounded-lg items-center mt-5">
              {loading ? <ActivityIndicator color="white" /> : <AppText className="text-white text-lg font-bold">Pay {totalPrice.toFixed(2)} {userCurrency.currency}</AppText>}
            </TouchableOpacity> */}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPrivyConfirmationModalVisible}
        onRequestClose={() => {
          setIsPrivyConfirmationModalVisible(!isPrivyConfirmationModalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-11/12 items-center">
            <AppText type="subtitle" className="mb-4">Confirm Payment</AppText>
            <AppText className="mb-2">You are about to pay with your Privy wallet.</AppText>
            {privyWalletBalance !== null ? (
              <AppText className="mb-4">Your balance: {privyWalletBalance.toFixed(4)} SOL</AppText>
            ) : <ActivityIndicator className="my-2" />}
            <AppText className="mb-4 font-bold">Total: {totalPrice.toFixed(2)} {userCurrency.currency}</AppText>
            <View className="flex-row justify-around w-full mt-4">
              <TouchableOpacity
                onPress={() => setIsPrivyConfirmationModalVisible(false)}
                className="bg-red-500 p-3 rounded-lg"
              >
                <AppText className="text-white font-bold">Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmPayWithPrivyWallet}
                className="bg-green-500 p-3 rounded-lg"
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : <AppText className="text-white font-bold">Confirm and Pay</AppText>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppPage>
  );
};

export default CheckoutScreen;