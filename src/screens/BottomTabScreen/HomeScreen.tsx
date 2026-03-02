import React from 'react';
import { View, Text } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ForYouScreen from '@components/Home/ForYouScreen';
import NearbyScreen from '@components/Home/NearbyScreen';
import CommonContainer from '@components/CommonContainer';
import SearchBar from '@components/Home/SearchBar';
import theme from '@utils/Theme';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  return (
    <CommonContainer>
      <View style={{ flex: 1 }}>
        <SearchBar />

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primaryDark,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarLabelStyle: {
              fontFamily: theme.fonts.subheading,
              fontSize: theme.fontSizes.md,
              textTransform: 'capitalize',
            },
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
              borderBottomWidth: 0.5,
              borderColor: theme.colors.border,
            },
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.primaryDark,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab.Screen name="For You" component={ForYouScreen} />
          <Tab.Screen name="Nearby" component={NearbyScreen} />
        </Tab.Navigator>
      </View>
    </CommonContainer>
  );
};

export default HomeScreen;
