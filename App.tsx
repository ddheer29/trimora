import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({
  webClientId:
    '274425122801-envu247hp57lh0867gqdhvi3eqv2fj1b.apps.googleusercontent.com',
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId:
    '274425122801-m3igrpiqufhqbl91fg46h4p460lqvp6r.apps.googleusercontent.com',
});

function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar
          translucent={Platform.OS === 'ios'}
          backgroundColor="transparent"
        />
        <Navigation />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
