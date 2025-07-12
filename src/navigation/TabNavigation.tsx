import React from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/BottomTabScreen/HomeScreen';
import SettingScreen from '../screens/BottomTabScreen/SettingScreen';
import AppointmentsScreen from '../screens/BottomTabScreen/AppointmentsScreen';
import TrendsScreen from '../screens/BottomTabScreen/TrendsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../utils/Theme';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
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
        tabBarButton: props => (
          <Pressable
            android_ripple={{ color: '#EAD7D7' }}
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
          } else if (route.name === 'Trends') {
            iconName = focused ? 'image-multiple' : 'image-multiple-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar-check' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={26} color={color} />
          );
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
