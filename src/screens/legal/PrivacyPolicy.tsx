import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CommonContainer from '@components/CommonContainer';
import { WebView } from 'react-native-webview';

const PrivacyPolicy = () => {
  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      title="Privacy Policy"
      noPadding
    >
      <WebView
        source={{
          uri: 'https://www.freeprivacypolicy.com/live/2a3a6d47-8d09-4b0b-8943-0c5de31a54e3',
        }}
        style={{ flex: 1 }}
      />
    </CommonContainer>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({});
