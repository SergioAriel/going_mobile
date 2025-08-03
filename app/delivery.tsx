
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const DeliveryScreen = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const updateLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        // Here you would send the location to your backend
    };

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold mb-5">Delivery Simulation</Text>
            {location ? (
                <MapView
                    style={{ width: '100%', height: '70%' }}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title={"Your Location"}
                    />
                </MapView>
            ) : (
                <Text>{errorMsg || 'Getting location...'}</Text>
            )}
            <TouchableOpacity className="bg-blue-500 p-3 rounded-md mt-5" onPress={updateLocation}>
                <Text className="text-white text-center font-bold">Update Location</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DeliveryScreen;
