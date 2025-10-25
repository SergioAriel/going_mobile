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
  const [selectedImage, setSelectedImage] = useState(0);

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
      handleAlert({ message: `Added to cart: ${product.name}`, isError: false });
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
        {/* Image Gallery */}
        <View>
          <Image source={{ uri: product.images[selectedImage] as string }} className="w-full h-72" />
          {product.images && product.images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
              {product.images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(index)} className="mx-1">
                  <Image 
                    source={{ uri: image as string }} 
                    className={`w-16 h-16 rounded-lg border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity onPress={toggleWishlist} className="absolute top-2 right-2 z-10 bg-white/70 rounded-full p-2">
          <AntDesign name={userData.wishlist.includes(product._id.toString()) ? "heart" : "hearto"} size={24} color="#D300E5" />
        </TouchableOpacity>
        
        <View className="p-5">
          <Text className="text-2xl font-bold text-gray-800">{product.name}</Text>

          {/* Rating */}
          <View className="flex-row items-center my-2">
            <View className="flex-row">
              {[...Array(5)].map((_, i) => {
                const rating = product.rating || 0;
                if (i < Math.floor(rating)) {
                  return <AntDesign key={i} name="star" size={20} color="#FFC107" />;
                } else if (i < rating) {
                  return <AntDesign key={i} name="star" size={20} color="#FFC107" />; // Fallback for half-star
                } else {
                  return <AntDesign key={i} name="staro" size={20} color="gray" />;
                }
              })}
            </View>
            <Text className="ml-2 text-sm text-gray-600">
              {product.rating?.toFixed(1)} ({product.reviews?.length || 0} reviews)
            </Text>
          </View>

          <Text className="text-base text-gray-600 my-2">{product.description}</Text>
          <Text className="text-xl font-bold text-green-600 mb-2">${product.price.toFixed(2)}</Text>

          {product.stock <= 5 && (
            <Text className="text-sm text-red-600 font-medium mb-4">
              Only {product.stock} left in stock!
            </Text>
          )}

          <View className="flex-row items-center my-5">
            <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} className="p-3 bg-gray-200 rounded-md">
              <Text className="text-lg">-</Text>
            </TouchableOpacity>
            <TextInput
              className="mx-4 p-3 border border-gray-300 rounded-md text-center w-16"
              value={String(quantity)}
              onChangeText={(text) => handleQuantityChange(Number(text))}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock} className="p-3 bg-gray-200 rounded-md">
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg items-center mt-3"
            onPress={handleBuy}
          >
            <Text className="text-white text-lg font-bold">Buy!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-4 rounded-lg items-center mt-3 ${isAdded ? 'bg-green-500' : 'bg-blue-500'}`}
            onPress={handleAddToCart}
            disabled={isAdded}
          >
            <Text className="text-white text-lg font-bold">{isAdded ? 'Added!' : 'Add to Cart'}</Text>
          </TouchableOpacity>

          {seller && (
            <View className="mt-5 p-3 border border-gray-200 rounded-lg">
              <Text className="text-lg font-bold mb-1">Seller Information</Text>
              <Text className="text-base">{seller.name}</Text>
              <Text className="text-sm text-gray-500">{seller.bio}</Text>
            </View>
          )}

          {relatedProducts.length > 0 && (
            <View className="mt-5">
              <Text className="text-lg font-bold mb-2">Related Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((relatedProduct) => (
                  <View key={relatedProduct._id.toString()} className="mr-4">
                    <ProductCard product={relatedProduct} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </AppPage>
  );
};

export default ProductDetail;
