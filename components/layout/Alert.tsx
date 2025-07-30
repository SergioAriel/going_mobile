
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useAlert } from '@/context/AlertContext';

const Alert = () => {
    const { status, message, isError } = useAlert();

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={status}
        >
            <View style={styles.container}>
                <View style={[styles.alert, isError ? styles.error : styles.success]}>
                    <Text>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    alert: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    error: {
        backgroundColor: 'red',
    },
    success: {
        backgroundColor: 'green',
    },
});

export default Alert;
