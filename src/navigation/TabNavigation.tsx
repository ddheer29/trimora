import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/BottomTabScreen/HomeScreen';
import SettingScreen from '../screens/BottomTabScreen/SettingScreen';
import AppointmentsScreen from '../screens/BottomTabScreen/AppointmentsScreen';
import TrendsScreen from '../screens/BottomTabScreen/TrendsScreen';
import { Feather } from '@react-native-vector-icons/feather';
import theme from '../utils/Theme';
import { requestMissingPermissions } from '@utils/PermissionHandler';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  useEffect(() => {
    // Temporarily disabled for debugging crash
    // requestMissingPermissions();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primaryDark,
        tabBarInactiveTintColor: theme.colors.textDisabled,

        tabBarStyle: {
          backgroundColor: theme.colors.background,
          height: 78,
          paddingTop: 8,
          paddingBottom: 14,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.sm,
          fontFamily: theme.fonts.body,
          marginBottom: 4,
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarButton: props => (
          <Pressable
            android_ripple={{ color: '#EAD7D7' }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={props.onPress}
          >
            {props.children}
          </Pressable>
        ),
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => {
          let iconName: any = 'help-circle';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Trends') {
            iconName = 'trending-up';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Feather name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Trends"
        component={TrendsScreen}
        options={{ tabBarLabel: 'Trends' }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
