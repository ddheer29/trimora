import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} />
      <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
