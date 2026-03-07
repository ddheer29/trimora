import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CommonContainer from '@components/CommonContainer';

const PrivacyPolicy = () => {
  return (
    <CommonContainer showBackButton hideHeader={false} title="Privacy Policy">
      <Text>PrivacyPolicy</Text>
    </CommonContainer>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({});
