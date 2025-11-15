import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtil';
import theme from '../utils/Theme';
import { useUserStore } from '../store/userStore';

const SplashScreen = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        resetAndNavigate('MainTabs');
      } else {
        resetAndNavigate('AuthNavigator');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  useEffect(() => {
    const breatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    if (!isStop) {
      breatingAnimation.start();
    }
    return () => {
      breatingAnimation.stop();
    };
  }, [isStop]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.appName, { transform: [{ scale }] }]}>
        Trimora
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { transform: [{ scale }] }]}>
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
