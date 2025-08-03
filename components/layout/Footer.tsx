
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Footer = () => {
  const router = useRouter();

  return (
    <View style={{ backgroundColor: '#f9fafb', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Navigation</Text>
          <TouchableOpacity onPress={() => router.push('/')}><Text>Home</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/products')}><Text>Products</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/categories')}><Text>Categories</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/offers')}><Text>Offers</Text></TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Help & Support</Text>
          <TouchableOpacity onPress={() => router.push('/help')}><Text>Help Center</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/contact')}><Text>Contact</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/faq')}><Text>FAQ</Text></TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Legal</Text>
          <TouchableOpacity onPress={() => router.push('/terms')}><Text>Terms of Service</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/privacy')}><Text>Privacy Policy</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={{ textAlign: 'center', color: '#666' }}>© {new Date().getFullYear()} GOING. All rights reserved.</Text>
    </View>
  );
};

export default Footer;
