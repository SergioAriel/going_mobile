import { router } from 'expo-router'
import { useLogin } from '@privy-io/expo/ui'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, View } from 'react-native'
import { Image } from 'expo-image'


export default function SignIn() {
  const { login, isLoading } = useLogin({
    onSuccess: () => {  
      router.push('/(profile)/AccountTab')
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
    },
  })
  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        {/* Dummy view to push the next view to the center. */}
        <View />
        <View style={{ alignItems: 'center', gap: 16 }}>
          <AppText type="title">{AppConfig.name}</AppText>
          <Image source={require('../assets/images/icon.png')} style={{ width: 128, height: 128 }} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Button
            title="Connect"
            onPress={login}
            color="#007AFF"
          />
        </View>
      </SafeAreaView>
    </AppView>
  )
}