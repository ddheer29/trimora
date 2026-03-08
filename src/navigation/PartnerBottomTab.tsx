import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../utils/Theme';
import DashboardScreen from '@screens/PartnerSide/DashboardScreen';
import BookingScreen from '@screens/PartnerSide/BookingScreen';
import SettingScreen from '@screens/PartnerSide/SettingScreen';
import SchedulesScreen from '@screens/PartnerSide/SchedulesScreen';

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
        tabBarIcon: ({ focused, color }) => {
          let iconName: any = 'help-circle';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedules') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Booking') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="Schedules"
        component={SchedulesScreen}
        options={{ tabBarLabel: 'Schedules' }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{ tabBarLabel: 'Booking' }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{ tabBarLabel: 'Setting' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
