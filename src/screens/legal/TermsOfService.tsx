import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CommonContainer from '@components/CommonContainer';
import WebView from 'react-native-webview';

const TermsOfService = () => {
  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      title="Terms of Service"
      noPadding
    >
      <WebView
        source={{
          uri: 'https://www.freeprivacypolicy.com/live/b39d5635-e0bc-4188-801c-832b0f3b1e81',
        }}
        style={{ flex: 1 }}
      />
    </CommonContainer>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({});
