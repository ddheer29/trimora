import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtil';
import theme from '../utils/Theme';
import { useUserStore } from '../store/userStore';
import { userService } from '../services/userService';

const SplashScreen = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { isLoggedIn, user, updateUser } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isLoggedIn) {
        try {
          const response = await userService.getProfile();
          console.log('🚀 -> checkUserStatus -> response:', response);
          if (response.data?.user) {
            updateUser(response.data.user);
          }
        } catch (error) {
          console.log('Error refreshing profile in splash:', error);
        }
      }
      setIsReady(true);
    };

    checkUserStatus();
  }, [isLoggedIn, updateUser]);

  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (!user?.isProfileCompleted) {
          if (user?.role === 'partner') {
            resetAndNavigate('SalonSetupWelcomeScreen');
          } else {
            resetAndNavigate('EditProfileScreen');
          }
          return;
        }

        if (user?.role === 'partner') {
          resetAndNavigate('PartnerBottomTab');
        } else {
          resetAndNavigate('MainTabs');
        }
      } else {
        resetAndNavigate('AuthNavigator');
      }
    }, 3000); // Increased slightly for better feel

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, isReady]);

  useEffect(() => {
    // Entrance Fade In
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Breathing Animation
    const breatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
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
      <StatusBar
        translucent={Platform.OS === 'ios'}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Animated.View
        style={{ opacity, transform: [{ scale }], alignItems: 'center' }}
      >
        <Text style={styles.appName}>Trimora</Text>
        <Text style={styles.tagline}>Your style, your time.</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    marginBottom: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: theme.fonts.light,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
