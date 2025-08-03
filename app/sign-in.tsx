import { router } from 'expo-router'
import { useLogin } from '@privy-io/expo/ui'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, View } from 'react-native'
import { Image } from 'expo-image'
import { usePrivy } from '@privy-io/expo'


export default function SignIn() {
  // Redirect to the home screen if the user is already logged in.
  // const { user } = usePrivy()
  // const { login } = useLogin()
  const { login } = useLogin()

  // if (user) {
  //   router.push('/HomeScreen')
  // }

  const handlerLogin = async () => {
    const result = await login({ loginMethods: ['google']})
    console.log('Login result:', result)
  }

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
            onPress={handlerLogin}
            color="#007AFF"
          />
        </View>
      </SafeAreaView>
    </AppView>
  )
}