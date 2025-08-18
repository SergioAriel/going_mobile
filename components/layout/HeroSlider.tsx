import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: "welcome",
    title: 'Welcome to Going',
    subtitle: 'Your marketplace with cryptocurrency payments',
    buttons: [
      { text: 'Explore Products', href: '/products', style: 'primary' },
      { text: 'Browse Categories', href: '/categories', style: 'secondary' },
    ],
  },
  {
    id: "shoppingExperience",
    title: 'Buy and sell easily',
    subtitle: 'With the security of the Solana blockchain',
  },
  {
    id: "cryptoPayments",
    title: 'Instant payments',
    subtitle: 'Directly to the seller\'s wallet',
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startSlideShow();
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  const startSlideShow = () => {
    slideInterval.current = setInterval(() => {
      changeSlide(1);
    }, 5000);
  };

  const changeSlide = (direction: number) => {
    opacity.value = withTiming(0, { duration: 500, easing: Easing.ease });
    scale.value = withTiming(1.05, { duration: 500, easing: Easing.ease });

    setTimeout(() => {
      setCurrentSlide(prev => (prev + direction + slides.length) % slides.length);
      opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
      scale.value = withTiming(1, { duration: 500, easing: Easing.ease });
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    changeSlide(index - currentSlide);
    startSlideShow();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(20, 191, 251, 0.7)', 'rgba(211, 0, 229, 0.7)']}
        style={styles.gradient}
      />
      <Animated.View style={[styles.slide, animatedStyle]}>
        <Text style={styles.title}>
          <Text style={styles.titleBrand}>GOING</Text> Marketplace
        </Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        {slide.buttons && (
          <View style={styles.buttonContainer}>
            {slide.buttons.map((button, index) => (
              <TouchableOpacity key={index} style={[styles.button, button.style === 'primary' ? styles.btnPrimary : styles.btnSecondary]}>
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>

      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <View style={[styles.dot, currentSlide === index && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleBrand: {
    // This is a trick to simulate gradient text, not perfect
    color: '#D300E5', 
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnPrimary: {
    backgroundColor: '#14BFFB',
  },
  btnSecondary: {
    backgroundColor: '#D300E5',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: 'white',
    width: 24,
  },
});

export default HeroSlider;