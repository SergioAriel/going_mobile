
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const offerProducts = [
    {
      id: 1,
      name: "Smartwatch Deportivo",
      description: "Reloj inteligente con GPS y monitoreo cardíaco",
      originalPrice: 249.99,
      offerPrice: 199.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
      category: "Electrónica",
      rating: 4.2,
      reviews: 95,
      slug: "smartwatch-deportivo",
      stock: 8,
      expiresIn: "23:59:41" // tiempo restante de la oferta
    },
    {
      id: 2,
      name: "Laptop Ultradelgada",
      description: "Potente laptop con procesador de última generación",
      originalPrice: 999.99,
      offerPrice: 849.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
      category: "Electrónica",
      rating: 4.7,
      reviews: 203,
      slug: "laptop-ultradelgada",
      stock: 3,
      expiresIn: "23:59:41"
    },
  ];

const OfferProductCard = ({ product }: { product: typeof offerProducts[0] }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                    <Text style={styles.offerPrice}>${product.offerPrice.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.discountContainer}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
        </View>
    );
  };

const OffersScreen = () => (
  <FlatList
    data={offerProducts}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <OfferProductCard product={item} />}
  />
);

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: 200,
    },
    overlay: {
        padding: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#999',
        marginRight: 10
    },
    offerPrice: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16
    },
    discountContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});

export default OffersScreen;
