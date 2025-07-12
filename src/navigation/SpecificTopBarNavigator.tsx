import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colors, fontFamily, fontSizes, sizes} from '../utils/Theme';
import {moderateScale} from 'react-native-size-matters';
import SpecificGroupTestsScreen from '../screens/Groups/SpecificGroupTestsScreen';
import SpecificGroupMembersScreen from '../screens/Groups/SpecificGroupMembersScreen';
import SpecificGroupLeaderboardScreen from '../screens/ResultScreens/SpecificGroupLeaderboardScreen';

const Tab = createMaterialTopTabNavigator();

const SpecificTopBarNavigator = ({groupType}) => {
  return (
    <Tab.Navigator
      initialRouteName="SpecificGroupTestsScreen"
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          borderColor: colors.primary1,
          height: 2,
        },
        tabBarStyle: {
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.21,
          shadowRadius: 7.68,
          elevation: 10,
        },
        tabBarItemStyle: {
          width: 'auto',
          paddingHorizontal: moderateScale(30),
          paddingVertical: moderateScale(8),
        },
        tabBarContentContainerStyle: {justifyContent: 'center'},
      }}>
      <Tab.Screen
        name="SpecificGroupTestsScreen"
        initialParams={groupType}
        options={({navigation}) => ({
          title: 'Tests',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={SpecificGroupTestsScreen}
      />
      <Tab.Screen
        name="SpecificGroupMembersScreen"
        options={({navigation}) => ({
          title: 'Members',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={SpecificGroupMembersScreen}
      />
      <Tab.Screen
        name="SpecificGroupLeaderboardScreen"
        options={({navigation}) => ({
          title: 'Leaderboard',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={SpecificGroupLeaderboardScreen}
      />
    </Tab.Navigator>
  );
};

export default SpecificTopBarNavigator;

const styles = StyleSheet.create({});
