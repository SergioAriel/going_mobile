
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { getProducts } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';
import { Link } from 'expo-router';

const categories = [
    { name: "All", value: "all" },
    { name: "Electronics", value: "electronics" },
    { name: "Clothing and Accessories", value: "clothing" },
    { name: "Home and Garden", value: "home" },
    { name: "Sports", value: "sports" },
    { name: "Toys", value: "toys" },
    { name: "Health and Beauty", value: "health" },
    { name: "Food", value: "food" },
    { name: "Services", value: "services" },
    { name: "Other", value: "other" },
];

const sortOptions = [
    { name: "Price: Low to High", value: "price-asc", sort: { price: 1 } },
    { name: "Price: High to Low", value: "price-desc", sort: { price: -1 } },
    { name: "Best Rated", value: "rating", sort: { rating: 1 } },
    { name: "Newest", value: "newest", sort: { date: 1 } },
];

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const find = {
          ...(selectedCategory !== "all" && { category: selectedCategory }),
          ...(searchQuery && { name: { $regex: searchQuery, $options: 'i' } })
        }
        const sort = sortOptions.find(({ value }) => value === sortBy)?.sort || {};
        const allProducts = await getProducts(find, sort as any);
        setProducts(allProducts);
      } catch {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, setProducts, setLoading, setError]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
        <View style={{ padding: 10, flexDirection: 'row' }}>
            <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 }}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Button title="Filters" onPress={() => setModalVisible(true)} />
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Categories</Text>
                    {categories.map(({ name, value }) => (
                        <TouchableOpacity key={value} onPress={() => setSelectedCategory(value)}>
                            <Text style={selectedCategory === value ? styles.selected : {}}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={styles.modalText}>Sort by</Text>
                    {sortOptions.map(({ name, value }) => (
                        <TouchableOpacity key={value} onPress={() => setSortBy(value)}>
                            <Text style={sortBy === value ? styles.selected : {}}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
        <FlatList
            data={products}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
                <Link href={{ pathname: "/ProductDetailScreen", params: { productId: item._id.toString() } }} asChild>
                    <TouchableOpacity>
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text>{item.name}</Text>
                            <Text>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            )}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold'
    },
    selected: {
        fontWeight: 'bold',
        color: 'blue'
    }
});

export default ProductsScreen;
