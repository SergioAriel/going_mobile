import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '@/interfaces';
import { useCart, useUser, useAlert, useCurrencies } from '@/context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { updateUser } from '@/lib/ServerActions/users';

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { userData, setUserData } = useUser();
  const { handleAlert } = useAlert();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
  const [convertedPrice, setConvertedPrice] = useState<number>(0);

  useEffect(() => {
    setConvertedPrice(listCryptoCurrencies.find((crypto) => crypto.symbol === product.currency)?.price || 0)
  }, [listCryptoCurrencies, product.currency]);

  const toggleWishlist = async () => {
    if (userData._id === "") return handleAlert({
      isError: true,
      message: "Please log in to add products to your wishlist."
    });
    if (!userData.wishlist.includes(product._id.toString())) {
      const updateWishList = await updateUser({
        _id: userData._id,
        wishlist: [...userData.wishlist, product._id.toString()],
      })
      if (updateWishList.status) {
        setUserData((prevData) => ({
          ...prevData,
          wishlist: [...prevData.wishlist, product._id.toString()],
        }));
      } else {
        console.error("Error updating wishlist:", updateWishList.error);
      }
    } else {
      const updateWishList = await updateUser({
        _id: userData._id,
        wishlist: removeFromWishlist(product),
      })
      if (updateWishList.status) {
        setUserData((prevData) => ({
          ...prevData,
          wishlist: removeFromWishlist(product),
        }));
      }
    }
  };

  const removeFromWishlist = (product: Product) => {
    return userData.wishlist.filter(item => item !== product._id.toString());
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleToBuy = () => {
    router.push(`/checkout?productId=${product._id}&quantity=1`);
  }

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/products/[id]", params: { id: product._id } })} style={{ backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, margin: 10 }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: product?.mainImage || "https://via.placeholder.com/300" }}
          style={{ width: '100%', height: 150 }}
        />
        <TouchableOpacity onPress={toggleWishlist} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 50, padding: 5 }}>
          <AntDesign name={userData.wishlist.includes(product._id.toString()) ? "heart" : "hearto"} size={20} color="#D300E5" />
        </TouchableOpacity>
        {product.isOffer && (
          <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#D300E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50 }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Offer</Text>
          </View>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <View style={{ position: 'absolute', top: 40, right: 10, backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50 }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>¡Quedan pocos!</Text>
          </View>
        )}
        {product.stock === 0 && (
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Agotado</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{product.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          {/* Implement rating stars here */}
          <Text style={{ fontSize: 12, color: '#666', marginLeft: 5 }}>({product.reviews ? product.reviews.length : 0})</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#666' }} numberOfLines={1}>{product.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
          <View>
            {userCurrency && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {userCurrency.currency} {((product?.price * (1 - ((product.offerPercentage || 0) / 100)) * convertedPrice) / (userCurrency?.price || 1)).toFixed(2)}
                </Text>
                {product.isOffer && (
                  <Text style={{ fontSize: 12, marginLeft: 5 }}>(-{(product.offerPercentage || 0)}%)</Text>
                )}
              </View>
            )}
            {product.offerPercentage ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {product.currency} {(product.price * (1 - ((product.offerPercentage || 0) / 100))).toFixed(2)}
                </Text>
                <Text style={{ fontSize: 12, marginLeft: 5 }}>(-{(product.offerPercentage || 0)}%)</Text>
              </View>
            ) : (
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{product.currency} {product.price}</Text>
            )}
            {userCurrency && product.isOffer && (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={{ textDecorationLine: 'line-through', color: '#999' }}>{userCurrency.currency} {product.price}</Text>
                <Text style={{ textDecorationLine: 'line-through', color: '#999' }}>{userCurrency.currency} {((product.price * (convertedPrice || 1)) / (userCurrency.price || 1)).toFixed(2)}</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'column', gap: 5 }}>
            <TouchableOpacity onPress={handleToBuy} disabled={product.stock <= 0} style={{ backgroundColor: '#14BFFB', padding: 8, borderRadius: 50 }}>
              <AntDesign name="tago" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddToCart} disabled={product.stock <= 0} style={{ borderWidth: 2, borderColor: '#14BFFB', padding: 8, borderRadius: 50 }}>
              <AntDesign name="plus" size={20} color="#14BFFB" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
