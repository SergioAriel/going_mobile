
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart, useUser, useAlert, useCurrencies } from '@/context';
import { Product, AddressForm, CartItem, Order } from '@/interfaces';
import { getOneProduct } from '@/lib/ServerActions/products';
import { uploadOrder, updateOrder, deleteOrder } from '@/lib/ServerActions/orders';
import { AppPage } from '@/components/app-page';
import { AntDesign } from '@expo/vector-icons';
import { usePrivy, useEmbeddedSolanaWallet } from '@privy-io/expo';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useSolana } from '@/context/SolanaContext';

const CheckoutScreen = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const { productId, quantity } = useLocalSearchParams<{ productId: string, quantity: string }>();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId && quantity) {
      const fetchProduct = async () => {
        try {
          const product = await getOneProduct({ _id: productId });
          if (product) {
            setCheckoutItems([{ ...product, quantity: Number(quantity) }]);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
        setLoading(false);
      };
      fetchProduct();
    } else {
      setCheckoutItems(items);
      setLoading(false);
    }
  }, [productId, quantity, items]);

  if (loading) {
    return (
      <AppPage style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </AppPage>
    );
  }

  return <CheckoutPage items={checkoutItems} clearCart={clearCart} />;
};

const CheckoutPage = ({ items, clearCart }: { items: CartItem[], clearCart?: () => void }) => {
  const { user } = usePrivy();
  const { wallets } = useEmbeddedSolanaWallet()
  const { accounts, authorizeSession, deauthorizeSession } = useSolana();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
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
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { handleAlert } = useAlert();
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handleAddressChange = (name: string, value: string) => {
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = () => {
    // if (Object.values(address).some(value => value.trim() === "")) {
    //   handleAlert({
    //     message: "Please fill all fields",
    //     isError: true
    //   });
    //   return;
    // }
    setStep(2);
  };

  const completeCheckout = async (signature: string, orderId: string) => {
    setLoading(true);
    try {
      await updateOrder({
        _id: orderId,
        signature
      });
      setOrderNumber(orderId);
      if (clearCart) clearCart();
      setOrderCompleted(true);
      setStep(3);
    } catch (error) {
      console.error("Error completing purchase:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    if (!selectedPayment) {
      handleAlert({
        message: "Wallet not selected",
        isError: true
      });
      setLoading(false);
      return;
    }

    // Payment logic here

    setLoading(false);
  };

  useEffect(() => {
    const total = items.reduce((total, product) => {
      const priceProductToDollar = listCryptoCurrencies.find(currency => currency.symbol === product.currency);
      const convertedPrice = ((priceProductToDollar?.price || 0) * (product?.price || 1)) / (userCurrency.price || 1);
      return total + (convertedPrice * product.quantity);
    }, 0);
    setTotalPrice(total);
  }, [items, listCryptoCurrencies, userCurrency]);

  console.log(accounts)

  if (orderCompleted) {
    return (
      <AppPage style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <AntDesign name="checkcircleo" size={50} color="green" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 20 }}>Order Completed!</Text>
        <Text>Thank you for your purchase. Your order {orderNumber} has been successfully processed.</Text>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <ScrollView style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontWeight: step === 1 ? 'bold' : 'normal' }}>1. Address</Text>
          <Text style={{ fontWeight: step === 2 ? 'bold' : 'normal' }}>2. Payment</Text>
          <Text style={{ fontWeight: step === 3 ? 'bold' : 'normal' }}>3. Confirmation</Text>
        </View>

        {step === 1 && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Shipping Address</Text>
            <TextInput placeholder="Full Name" onChangeText={(text) => handleAddressChange('fullName', text)} style={styles.input} />
            <TextInput placeholder="Street" onChangeText={(text) => handleAddressChange('street', text)} style={styles.input} />
            <TextInput placeholder="City" onChangeText={(text) => handleAddressChange('city', text)} style={styles.input} />
            <TextInput placeholder="State" onChangeText={(text) => handleAddressChange('state', text)} style={styles.input} />
            <TextInput placeholder="Zip Code" onChangeText={(text) => handleAddressChange('zipCode', text)} style={styles.input} />
            <TextInput placeholder="Country" onChangeText={(text) => handleAddressChange('country', text)} style={styles.input} />
            <TextInput placeholder="Phone" onChangeText={(text) => handleAddressChange('phone', text)} style={styles.input} />
            <TextInput placeholder="Email" onChangeText={(text) => handleAddressChange('email', text)} style={styles.input} />
            <TouchableOpacity onPress={handleSubmitAddress} style={styles.button}>
              <Text style={styles.buttonText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Payment Method</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Privy Wallets</Text>
            {wallets?.map((wallet) => (
              <TouchableOpacity key={wallet.address} onPress={() => setSelectedPayment(wallet.address)} style={[styles.wallet, selectedPayment === wallet.address && styles.selectedWallet]}>
                <Text>{wallet.address}</Text>
              </TouchableOpacity>
            ))}
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>Solana Mobile Wallets</Text>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TouchableOpacity key={account.address} onPress={() => setSelectedPayment(account.address)} style={[styles.wallet, selectedPayment === account.address && styles.selectedWallet]}>
                  <Text>{account.address}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity onPress={authorizeSession} style={styles.button}>
                <Text style={styles.buttonText}>Connect Solana Wallet</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleSubmitPayment} disabled={loading} style={styles.button}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Proceed to Payment</Text>}
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Confirmation</Text>
            {/* Confirmation UI here */}
          </View>
        )}
      </ScrollView>
    </AppPage>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#14BFFB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wallet: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedWallet: {
    borderColor: '#14BFFB',
    borderWidth: 2,
  },
});

export default CheckoutScreen;
