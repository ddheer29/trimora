import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CommonContainer from '../../components/CommonContainer';
import theme from '../../utils/Theme';
import UpcomingScreen from '../AppointmentsTabScreens/UpcomingScreen';
import CompletedScreen from '../AppointmentsTabScreens/CompletedScreen';
import CancelledScreen from '../AppointmentsTabScreens/CancelledScreen';

const Tab = createMaterialTopTabNavigator();

const AppointmentsScreen = () => {
  return (
    <CommonContainer
      title="Appointments"
      hideHeader={false}
      headerStyle={styles.header}
      titleStyle={{
        color: theme.colors.primaryDark,
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.heading,
        marginLeft: theme.spacing.xl,
        ...styles.title,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: theme.fonts.subheading,
            fontSize: theme.fontSizes.sm,
            textTransform: 'capitalize',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primaryDark,
            height: 3,
            borderRadius: 10,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            borderBottomWidth: 1,
            borderColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primaryDark,
          tabBarInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Tab.Screen name="Upcoming" component={UpcomingScreen} />
        <Tab.Screen name="Completed" component={CompletedScreen} />
        <Tab.Screen name="Cancelled" component={CancelledScreen} />
      </Tab.Navigator>
    </CommonContainer>
  );
};

export default AppointmentsScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  header: {
    borderBottomWidth: 0,
  },
});
