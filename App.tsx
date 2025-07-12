import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';
import theme from './src/utils/Theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaView}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Navigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default App;
