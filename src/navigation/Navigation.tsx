import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import { navigationRef } from '../utils/NavigationUtil';

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
