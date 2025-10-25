import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/app-text';

export const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View className="mb-6">
        <AppText type="subtitle" className="text-xl font-semibold mb-4 text-gray-700">{title}</AppText>
        {children}
    </View>
);
