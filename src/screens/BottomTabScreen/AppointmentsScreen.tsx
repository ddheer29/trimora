import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CommonContainer from '../../components/CommonContainer';
import theme from '../../utils/Theme';
import UpcomingScreen from '../AppointmentsTabScreens/UpcomingScreen';
import CompletedScreen from '../AppointmentsTabScreens/CompletedScreen';
import CancelledScreen from '../AppointmentsTabScreens/CancelledScreen';

const { width } = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();

const AppointmentsScreen = () => {
  return (
    <CommonContainer
      title="Appointments"
      hideHeader={false}
      noPadding
      backgroundColor="#FFFFFF"
      statusBarBackgroundColor="#FFFFFF"
      statusBarColor="dark-content"
      headerStyle={styles.header}
      titleStyle={styles.headerTitle}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: theme.fonts.subheading,
            fontSize: 16,
            textTransform: 'capitalize',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#000000',
            height: 4,
            width: 100, // Slightly wider for better visual balance
            borderRadius: 2,
            marginLeft: (width / 3 - 100) / 2, // Centering logic
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F1F5F9',
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarPressColor: 'transparent',
          tabBarIndicatorContainerStyle: {
            backgroundColor: '#FFFFFF',
          },
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
  header: {
    height: 70,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: '#000000',
  },
});
