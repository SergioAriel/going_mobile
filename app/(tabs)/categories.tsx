import React from 'react';
import { View, Text } from 'react-native';
import Header from '@/components/layout/Header';
import { AppPage } from '@/components/app-page';

export default function CategoriesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppPage className="flex-1 items-center justify-center">
        <Text className="text-lg">Categories Screen</Text>
      </AppPage>
    </View>
  );
}