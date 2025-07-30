
import React from 'react';
import { View, Button } from 'react-native';
import { useLogin, useLogout, usePrivy } from '@privy-io/expo';

export default function SettingsTab() {
    const { authenticated } = usePrivy();
    const { login } = useLogin();
    const { logout } = useLogout();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {authenticated ? (
                <Button title="Logout" onPress={() => logout()} />
            ) : (
                <Button title="Login" onPress={() => login()} />
            )}
        </View>
    );
};
