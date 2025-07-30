import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "@/context/CartContext";
import { Product } from "@/interfaces";
import { useCurrencies } from "@/context/CurrenciesContext";
import { Link, useRouter } from "expo-router";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
  const [convertedPrice, setConvertedPrice] = useState<number>(0);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  useEffect(() => {
    setConvertedPrice(listCryptoCurrencies.find((crypto) => crypto.symbol === product.currency)?.price || 0)
  }, [listCryptoCurrencies, product.currency]);

  return (
    <Link href={`/products/${product?._id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.mainImage || "https://via.placeholder.com/300" }}
            style={styles.image}
          />
          {product.isOffer && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>Offer</Text>
            </View>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>¡Quedan pocos!</Text>
            </View>
          )}
          {product.stock === 0 && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Agotado</Text>
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <Text>{/* Implement rating stars here */}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.priceContainer}>
            <View>
              {userCurrency && (
                <View style={styles.convertedPriceContainer}>
                  <Text style={styles.convertedPrice}>
                    {userCurrency.currency} {((product?.price * (1 - ((product.offerPercentage || 0) / 100)) * convertedPrice) / (userCurrency?.price || 1)).toFixed(2)}
                  </Text>
                  {product.isOffer && (
                    <Text style={styles.offerPercentage}>(-{(product.offerPercentage || 0)}%)</Text>
                  )}
                </View>
              )}
              {product.offerPercentage ? (
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPrice}>
                    {product.currency} {(product.price * (1 - ((product.offerPercentage || 0) / 100))).toFixed(2)}
                  </Text>
                  <Text style={styles.offerPercentage}>(-{(product.offerPercentage || 0)}%)</Text>
                </View>
              ) : (
                <Text style={styles.price}>{product.currency} {product.price}</Text>
              )}
              {userCurrency && product.isOffer && (
                <View style={styles.originalPriceWithConversionContainer}>
                  <Text style={styles.strikethrough}>{userCurrency.currency} {product.price}</Text>
                  <Text style={styles.strikethrough}>{userCurrency.currency} {((product.price * (convertedPrice || 1)) / (userCurrency.price || 1)).toFixed(2)}</Text>
                </View>
              )}
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buyButton} onPress={() => router.push(`/checkout/${product._id}/${1}`)} disabled={product.stock <= 0}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={product.stock <= 0}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  offerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D300E5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  offerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  stockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailsContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  convertedPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  convertedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerPercentage: {
    fontSize: 12,
    marginLeft: 5,
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPriceWithConversionContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  buyButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
  },
  addToCartButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProductCard;
