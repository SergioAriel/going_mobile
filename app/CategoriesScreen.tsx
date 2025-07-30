
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      icon: "🖥️",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
      productCount: 156,
      slug: "electronics",
      subcategories: [
        { name: "Smartphones", slug: "smartphones", count: 45 },
        { name: "Laptops", slug: "laptops", count: 32 },
        { name: "Audio", slug: "audio", count: 28 },
        { name: "Accessories", slug: "electronic-accessories", count: 51 }
      ]
    },
    {
      id: 2,
      name: "Fashion",
      description: "Clothing, footwear, and accessories",
      icon: "👕",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
      productCount: 243,
      slug: "fashion",
      subcategories: [
        { name: "Men", slug: "men-fashion", count: 78 },
        { name: "Women", slug: "women-fashion", count: 98 },
        { name: "Kids", slug: "kids-fashion", count: 45 },
        { name: "Accessories", slug: "fashion-accessories", count: 22 }
      ]
    },
  ];

const CategoriesScreen = () => (
  <FlatList
    data={categories}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.name}>{item.icon} {item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    )}
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
    },
    name: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        color: '#fff',
        fontSize: 14,
    }
});

export default CategoriesScreen;
