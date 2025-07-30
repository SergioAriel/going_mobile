
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>Delivery Simulation</Text>
            {location ? (
                <MapView
                    style={styles.map}
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
            <Button title="Update Location" onPress={updateLocation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: '70%',
    },
});

export default DeliveryScreen;
