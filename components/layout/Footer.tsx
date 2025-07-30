
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const Footer = () => {

  return (
    <View style={styles.footerContainer}>
      <View style={styles.container}>
        <View style={styles.gridContainer}>
          {/* About Section */}
          <View style={styles.gridItem}>
            <Text style={styles.heading}>GOING</Text>
            <Text style={styles.text}>
              Buy and sell products using Solana and other payment methods.
              Online marketplace with cryptocurrency support.
            </Text>
          </View>

          {/* Quick Links */}
          <View style={styles.gridItem}>
            <Text style={styles.heading}>Navigation</Text>
            <Link href="/" asChild><TouchableOpacity><Text style={styles.link}>Home</Text></TouchableOpacity></Link>
            <Link href="/products" asChild><TouchableOpacity><Text style={styles.link}>Products</Text></TouchableOpacity></Link>
            <Link href="/categories" asChild><TouchableOpacity><Text style={styles.link}>Categories</Text></TouchableOpacity></Link>
            <Link href="/offers" asChild><TouchableOpacity><Text style={styles.link}>Offers</Text></TouchableOpacity></Link>
            <Link href="/sell" asChild><TouchableOpacity><Text style={styles.link}>Sell</Text></TouchableOpacity></Link>
          </View>

          {/* Help & Support */}
          <View style={styles.gridItem}>
            <Text style={styles.heading}>Help & Support</Text>
            <Link href="/help" asChild><TouchableOpacity><Text style={styles.link}>Help Center</Text></TouchableOpacity></Link>
            <Link href="/contact" asChild><TouchableOpacity><Text style={styles.link}>Contact</Text></TouchableOpacity></Link>
            <Link href="/faq" asChild><TouchableOpacity><Text style={styles.link}>FAQ</Text></TouchableOpacity></Link>
            <Link href="/claims" asChild><TouchableOpacity><Text style={styles.link}>Claims</Text></TouchableOpacity></Link>
            <Link href="/returns" asChild><TouchableOpacity><Text style={styles.link}>Return Policy</Text></TouchableOpacity></Link>
          </View>

          {/* Legal */}
          <View style={styles.gridItem}>
            <Text style={styles.heading}>Legal</Text>
            <Link href="/terms" asChild><TouchableOpacity><Text style={styles.link}>Terms of Service</Text></TouchableOpacity></Link>
            <Link href="/privacy" asChild><TouchableOpacity><Text style={styles.link}>Privacy Policy</Text></TouchableOpacity></Link>
            <Link href="/cookies" asChild><TouchableOpacity><Text style={styles.link}>Cookie Policy</Text></TouchableOpacity></Link>
            <Link href="/solana-terms" asChild><TouchableOpacity><Text style={styles.link}>Solana Terms</Text></TouchableOpacity></Link>
          </View>
        </View>

        {/* Bottom Footer */}
        <View style={styles.bottomFooter}>
          <Text style={styles.bottomText}>
            &copy; {new Date().getFullYear()} GOING. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#f8fafc',
    paddingTop: 40,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  container: {
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
  },
  text: {
    color: '#4b5563',
    marginBottom: 16,
  },
  link: {
    color: '#4b5563',
    marginBottom: 8,
  },
  bottomFooter: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bottomText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Footer;
