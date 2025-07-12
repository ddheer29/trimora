import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colors, fontFamily, fontSizes} from '../utils/Theme';
import {moderateScale} from 'react-native-size-matters';
import AllGroups from '../screens/Groups/AllGroups';
import JoinedGroups from '../screens/Groups/JoinedGroups';
import YourGroups from '../screens/Groups/YourGroups';

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({title, count, isFocused}) => {
  return (
    <View style={styles.tabLabelContainer}>
      <Text
        style={[
          styles.tabLabelText,
          isFocused ? styles.focusedText : styles.unfocusedText,
        ]}>
        {title}
      </Text>
      <View style={styles.countContainer}>
        <Text
          style={[
            styles.countText,
            isFocused ? styles.focusedText : styles.unfocusedText,
          ]}>
          {count}
        </Text>
      </View>
    </View>
  );
};

const GroupsScreenTopBarNavigator = ({data, isLoading}) => {
  const allGroups = data.filter(item => item.type === 'all');
  const joinedGroups = data.filter(item => item.type === 'joined');
  const yourGroups = data.filter(item => item.type === 'your');
  return (
    <Tab.Navigator
      initialRouteName="AllGroups"
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
          paddingHorizontal: moderateScale(16),
          paddingVertical: moderateScale(8),
        },
        tabBarContentContainerStyle: {justifyContent: 'center'},
      }}>
      <Tab.Screen
        name="AllGroups"
        options={({navigation}) => ({
          tabBarLabel: ({focused}) => (
            <CustomTabLabel
              title="All Groups"
              count={allGroups?.length}
              isFocused={focused}
            />
          ),
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={() => <AllGroups data={allGroups} isLoading={isLoading} />}
      />
      <Tab.Screen
        name="JoinedGroups"
        options={({navigation}) => ({
          tabBarLabel: ({focused}) => (
            <CustomTabLabel
              title="Joined Groups"
              count={joinedGroups?.length}
              isFocused={focused}
            />
          ),
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={() => (
          <JoinedGroups data={joinedGroups} isLoading={isLoading} />
        )}
      />
      <Tab.Screen
        name="YourGroups"
        options={({navigation}) => ({
          tabBarLabel: ({focused}) => (
            <CustomTabLabel
              title="Your Groups"
              count={yourGroups?.length}
              isFocused={focused}
            />
          ),
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={() => <YourGroups data={yourGroups} isLoading={isLoading} />}
      />
    </Tab.Navigator>
  );
};

export default GroupsScreenTopBarNavigator;

const styles = StyleSheet.create({
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabLabelText: {
    fontSize: fontSizes.regular,
    fontFamily: fontFamily.medium,
    textTransform: 'none',
  },
  focusedText: {
    color: colors.primary1,
  },
  unfocusedText: {
    color: colors.grey7,
  },
  countContainer: {
    backgroundColor: colors.light,
    borderRadius: 10,
    marginLeft: 6,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  countText: {
    fontSize: fontSizes.small,
    fontFamily: fontFamily.medium,
  },
});
