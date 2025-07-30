
import React from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '@/context/UserContext';
// import * as ImagePicker from 'expo-image-picker';

export default function AccountTab() {
    const { userData, setUserData } = useUser();

    // const pickImage = async () => {
    //     // let result = await ImagePicker.launchImageLibraryAsync({
    //     //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     //     allowsEditing: true,
    //     //     aspect: [1, 1],
    //     //     quality: 1,
    //     // });

    //     if (!result.canceled) {
    //         setUserData(prev => ({ ...prev, avatar: result.assets[0].uri }));
    //     }
    // };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.avatarContainer}>
                {/* <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: userData.avatar || undefined }} style={styles.avatar} />
                </TouchableOpacity> */}
            </View>
            <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                placeholder="Full Name"
            />
            <TextInput
                style={styles.input}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder="Email Address"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                value={userData.location}
                onChangeText={(text) => setUserData(prev => ({ ...prev, location: text }))}
                placeholder="Location"
            />
            <TextInput
                style={styles.input}
                value={userData.bio}
                onChangeText={(text) => setUserData(prev => ({ ...prev, bio: text }))}
                placeholder="Bio"
                multiline
            />
            <Button title="Save Changes" onPress={() => { /* Logic to save changes */ }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});
