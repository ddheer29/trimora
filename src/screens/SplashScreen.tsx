import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtil';
import theme from '../utils/Theme';
import { useUserStore } from '../store/userStore';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (isLoggedIn) {
        resetAndNavigate('MainTabs');
      } else {
        resetAndNavigate('AuthNavigator');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        Trimora
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Your beauty, your time.
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.light,
    letterSpacing: 1.2,
  },
});
