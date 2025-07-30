import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

interface MapDisplayProps {
    lat: number;
    lng: number;
}

const MapDisplay = ({ lat, lng }: MapDisplayProps) => {
    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker coordinate={{ latitude: lat, longitude: lng }} />
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapDisplay;
