import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AppText } from '@/components/app-text';

export const ChoiceButton = ({ title, selected, onPress }: { title: string, selected: boolean, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className={`py-3 px-5 rounded-full border-2 ${selected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
        <AppText className={`${selected ? 'text-white' : 'text-gray-700'} font-bold`}>{title}</AppText>
    </TouchableOpacity>
);
