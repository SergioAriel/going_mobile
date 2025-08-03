
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
import { getProducts } from '@/lib/ServerActions/products';
import { Product } from '@/interfaces';
import ProductCard from '@/components/products/ProductCard';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View style={{ padding: 10, flexDirection: 'row', backgroundColor: 'white' }}>
            <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 }}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={{ backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, marginLeft: 10, justifyContent: 'center' }} onPress={() => setModalVisible(true)}>
                <Text style={{ color: 'white' }}>Filters</Text>
            </TouchableOpacity>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                    <Text style={{ marginBottom: 15, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Categories</Text>
                    {categories.map(({ name, value }) => (
                        <TouchableOpacity key={value} onPress={() => setSelectedCategory(value)} style={{ padding: 10 }}>
                            <Text style={{ color: selectedCategory === value ? '#3b82f6' : 'black', fontWeight: selectedCategory === value ? 'bold' : 'normal' }}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={{ marginTop: 20, marginBottom: 15, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Sort by</Text>
                    {sortOptions.map(({ name, value }) => (
                        <TouchableOpacity key={value} onPress={() => setSortBy(value)} style={{ padding: 10 }}>
                            <Text style={{ color: sortBy === value ? '#3b82f6' : 'black', fontWeight: sortBy === value ? 'bold' : 'normal' }}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={{ backgroundColor: '#3b82f6', borderRadius: 20, padding: 10, elevation: 2, marginTop: 20 }} onPress={() => setModalVisible(false)}>
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <FlatList
            data={products}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
                <View style={{ flex: 1, margin: 5 }}>
                    <ProductCard product={item} />
                </View>
            )}
            numColumns={2}
            contentContainerStyle={{ padding: 5 }}
        />
    </View>
  );
};

export default ProductsScreen;
