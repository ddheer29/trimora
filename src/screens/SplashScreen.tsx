import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { resetAndNavigate } from '../utils/NavigationUtil';
import theme from '../utils/Theme';

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndNavigate('MainTabs');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Trimora</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
