import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Product, User } from '@/interfaces';
import { useCart, useUser, useAlert } from '@/context';
import { AppPage } from '@/components/app-page';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getProducts } from '@/lib/ServerActions/products';
import { updateUser } from '@/lib/ServerActions/users';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  seller?: User | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, seller }) => {
  const { addToCart } = useCart();
  const { userData, setUserData } = useUser();
  const { handleAlert } = useAlert();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const productNameWords = product.name
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2);
        const resRelatedProducts = await getProducts({
          find: {
            _id: { $ne: product._id },
            $or: [
              { tags: { $in: product.tags } },
              { name: { $regex: productNameWords.join('|'), $options: 'i' } }
            ]
          }
        })
        setRelatedProducts(resRelatedProducts.filter((p) => p._id !== product._id))
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    })();
  }, [])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuy = () => {
    if (product) {
      router.push(`/checkout?productId=${product._id}&quantity=${quantity}`);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

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

  return (
    <AppPage>
      <ScrollView>
        <Image source={{ uri: product.images[0] }} style={{ width: '100%', height: 300, borderRadius: 10 }} />
        <TouchableOpacity onPress={toggleWishlist} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
          <AntDesign name={userData.wishlist.includes(product._id.toString()) ? "heart" : "hearto"} size={24} color="#D300E5" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>{product.name}</Text>
        <Text style={{ fontSize: 18, color: '#666', marginVertical: 10 }}>{product.description}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>${product.price.toFixed(2)}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>-</Text>
          </TouchableOpacity>
          <TextInput
            style={{ marginHorizontal: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, textAlign: 'center' }}
            value={String(quantity)}
            onChangeText={(text) => handleQuantityChange(Number(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#14BFFB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
          onPress={handleBuy}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Buy!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: isAdded ? '#10b981' : '#14BFFB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
          onPress={handleAddToCart}
          disabled={isAdded}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{isAdded ? 'Added!' : 'Add to Cart'}</Text>
        </TouchableOpacity>

        {seller && (
          <View style={{ marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Seller Information</Text>
            <Text>{seller.name}</Text>
            <Text>{seller.bio}</Text>
          </View>
        )}

        {relatedProducts.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Related Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id.toString()} product={relatedProduct} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </AppPage>
  );
};

export default ProductDetail;