import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

interface CategoryProps {
  category: {
    id: number;
    name: string;
    image: any;
    slug: string;
  };
}

const CategoryCard = ({ category }: CategoryProps) => {
  return (
    <Link href={{ pathname: "/category/[slug]", params: { slug: category.slug } }} asChild>
      <TouchableOpacity style={styles.container}>
        <ImageBackground source={category.image} style={styles.image}>
          <View style={styles.overlay} />
          <Text style={styles.text}>{category.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
});

export default CategoryCard; 