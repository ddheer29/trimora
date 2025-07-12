import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TabNavigation from './TabNavigation';

export type RootStackParamList = {
  SplashScreen: undefined;
  MainApp: undefined;
  NotificationsScreen: undefined;
};

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
