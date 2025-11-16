import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CommonContainer from '@components/CommonContainer';

const NotificationsScreen = () => {
  return (
    <CommonContainer showBackButton={true} hideHeader={false}>
      <Text>NotificationsScreen</Text>
    </CommonContainer>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
