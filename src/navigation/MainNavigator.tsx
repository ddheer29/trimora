import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TabNavigation from './TabNavigation';
import SalonDetailsScreen from '../screens/SalonDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import BookingCalendarScreen from '../screens/Calendar/BookingCalendarScreen';
import AuthNavigator from './AuthNavigator';
import PartnerBottomTab from './PartnerBottomTab';
import CreateSalonScreen from '@screens/CreateSalonScreen';
import SalonSetupWelcomeScreen from '@screens/PartnerSide/SalonSetupWelcomeScreen';
import SalonSetupFormScreen from '@screens/PartnerSide/SalonSetupFormScreen';
import ManageStylistsScreen from '@screens/PartnerSide/ManageStylistsScreen';
import AddEditStylistScreen from '@screens/PartnerSide/AddEditStylistScreen';
import ManageServicesScreen from '@screens/PartnerSide/ManageServicesScreen';
import AddEditServiceScreen from '@screens/PartnerSide/AddEditServiceScreen';
import SalonsScreen from '@screens/SalonsScreen';
import StylistAndTimeSlotScreen from '../screens/StylistAndTimeSlotScreen';
import BookingForScreen from '../screens/BookingForScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import BookingDetailsScreen from '../screens/PartnerSide/BookingDetailsScreen';
import TermsOfService from '@screens/legal/TermsOfService';
import PrivacyPolicy from '@screens/legal/PrivacyPolicy';

export type RootStackParamList = {
  SplashScreen: undefined;
  MainApp: undefined;
  NotificationsScreen: undefined;
  PartnerBottomTab: undefined;
  MainTabs: undefined;
  StylistAndTimeSlotScreen: undefined;
  BookingForScreen: undefined;
  PaymentScreen: undefined;
  BookingSuccessScreen: undefined;
  BookingDetailsScreen: { bookingId: string };
};

const Stack = createNativeStackNavigator();

const MainNavigator: FC = () => {
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
        name="PartnerBottomTab"
        component={PartnerBottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthNavigator"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="SalonDetailsScreen"
        component={SalonDetailsScreen as any}
      />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen
        name="BookingCalendarScreen"
        component={BookingCalendarScreen}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ animation: 'slide_from_bottom' }}
      />

      <Stack.Screen name="CreateSalonScreen" component={CreateSalonScreen} />
      <Stack.Screen
        name="SalonSetupWelcomeScreen"
        component={SalonSetupWelcomeScreen}
      />
      <Stack.Screen
        name="SalonSetupFormScreen"
        component={SalonSetupFormScreen}
      />
      <Stack.Screen
        name="ManageStylistsScreen"
        component={ManageStylistsScreen}
      />
      <Stack.Screen
        name="AddEditStylistScreen"
        component={AddEditStylistScreen}
      />
      <Stack.Screen
        name="ManageServicesScreen"
        component={ManageServicesScreen}
      />
      <Stack.Screen
        name="AddEditServiceScreen"
        component={AddEditServiceScreen}
      />
      <Stack.Screen name="SalonsScreen" component={SalonsScreen} />
      <Stack.Screen
        name="StylistAndTimeSlotScreen"
        component={StylistAndTimeSlotScreen}
      />
      <Stack.Screen name="BookingForScreen" component={BookingForScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen
        name="BookingSuccessScreen"
        component={BookingSuccessScreen}
      />
      <Stack.Screen
        name="BookingDetailsScreen"
        component={BookingDetailsScreen}
      />

      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
