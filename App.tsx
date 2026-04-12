import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import notificationService from '@/services/notificationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';

// Wire up React Native's AppState so React Query refetches on app foreground
focusManager.setEventListener(handleFocus => {
  const subscription = AppState.addEventListener('change', state => {
    handleFocus(state === 'active');
  });
  return () => subscription.remove();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data is fresh for 1 minute
      gcTime: 5 * 60_000, // unused cache kept for 5 minutes
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: true,
    },
  },
});

GoogleSignin.configure({
  webClientId:
    '274425122801-envu247hp57lh0867gqdhvi3eqv2fj1b.apps.googleusercontent.com',
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId:
    '274425122801-m3igrpiqufhqbl91fg46h4p460lqvp6r.apps.googleusercontent.com',
});

function App() {
  // useEffect(() => {
  //   notificationService.requestUserPermission();
  //   notificationService.setupNotificationHandlers();
  //   const unsubscribe = notificationService.setupForegroundListener();
  //   notificationService.onTokenRefresh();

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <Navigation />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
