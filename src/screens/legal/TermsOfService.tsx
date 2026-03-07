import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CommonContainer from '@components/CommonContainer';

const TermsOfService = () => {
  return (
    <CommonContainer showBackButton hideHeader={false} title="Terms of Service">
      <Text>TermsOfService</Text>
    </CommonContainer>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({});
