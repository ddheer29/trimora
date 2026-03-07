import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtil';
import theme from '../utils/Theme';
import { useUserStore } from '../store/userStore';
import { userService } from '../services/userService';

const SplashScreen = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
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
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, isReady]);

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
