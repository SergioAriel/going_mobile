
import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const offers = [
  { id: '1', title: '20% Off All Electronics', image: 'https://via.placeholder.com/300x150.png?text=Offer+1' },
  { id: '2', title: 'Free Shipping on Orders Over $50', image: 'https://via.placeholder.com/300x150.png?text=Offer+2' },
  { id: '3', title: 'Buy One Get One Free on T-Shirts', image: 'https://via.placeholder.com/300x150.png?text=Offer+3' },
];

const OffersCarousel = () => {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-3 px-4">Special Offers</Text>
      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <View className="w-[80vw] h-36 bg-gray-200 rounded-xl overflow-hidden mx-2 shadow-md">
            <Image source={{ uri: item.image }} className="w-full h-full absolute" />
            <Text className="absolute bottom-3 left-3 right-3 text-base font-bold text-white bg-black bg-opacity-50 p-2 rounded-lg overflow-hidden">
              {item.title}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={width * 0.8 + 16} // Card width + margin
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default OffersCarousel;
