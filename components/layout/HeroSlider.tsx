import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';

const slides = [
  {
    id: "welcome",
    image: require('../../assets/images/adaptive-icon.png'), // Corrected path
    title: 'Welcome to Going',
    subtitle: 'Your marketplace with cryptocurrency payments'
  },
  {
    id: "shoppingExperience",
    image: require('../../assets/images/adaptive-icon.png'), // Corrected path
    title: 'Buy and sell easily',
    subtitle: 'With the security of the Solana blockchain'
  },
  {
    id: "cryptoPayments",
    image: require('../../assets/images/adaptive-icon.png'), // Corrected path
    title: 'Instant payments',
    subtitle: "Directly to the seller's wallet"
  }
];

const { width: screenWidth } = Dimensions.get('window');

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            scrollViewRef.current?.scrollTo({ x: nextSlide * screenWidth, animated: true });
            setCurrentSlide(nextSlide);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const onScroll = (event: any) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        if (slide !== currentSlide) {
            setCurrentSlide(slide);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {slides.map((slide, index) => (
                    <ImageBackground key={index} source={slide.image} style={styles.slide}>
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.subtitle}>{slide.subtitle}</Text>
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <View key={index} style={[styles.dot, currentSlide === index ? styles.activeDot : {}]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 200,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#fff',
    },
});

export default HeroSlider;