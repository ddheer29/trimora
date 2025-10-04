import React from 'react';
import { View } from 'react-native';
import CommonContainer from '../../components/CommonContainer';
import theme from '../../utils/Theme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../../components/Home/Header';
import SearchBar from '../../components/Home/SearchBar';
import ForYouScreen from '../../components/Home/ForYouScreen.';
import NearbyScreen from '../../components/Home/NearbyScreen';
import BlogsScreen from '../../components/Home/BlogsScreen';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  return (
    <CommonContainer>
      <View style={{ flex: 1 }}>
        <Header />

        <SearchBar />

        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarActiveTintColor: theme.colors.primaryDark,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarLabelStyle: {
              fontFamily: theme.fonts.body,
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
          <Tab.Screen name="Blogs" component={BlogsScreen} />
        </Tab.Navigator>
      </View>
    </CommonContainer>
  );
};

export default HomeScreen;
