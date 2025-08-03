
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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

const CategoriesScreen = () => {
    const router = useRouter();

    return (
        <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push(`/products?category=${item.slug}`)} className="m-2 rounded-lg overflow-hidden shadow-lg bg-white">
                    <Image source={{ uri: item.image }} className="w-full h-48" />
                    <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                        <Text className="text-white text-xl font-bold">{item.icon} {item.name}</Text>
                        <Text className="text-white text-sm">{item.description}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
}

export default CategoriesScreen;
