import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CommonContainer from '../../components/CommonContainer';
import theme from '../../utils/Theme';
import { useRoute } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
import { goBack, resetAndNavigate } from '../../utils/NavigationUtil';
import { STRINGS } from '@screens/auth/string';

const VerifyOtpScreen = () => {
  const route = useRoute();

  return (
    <CommonContainer
      showBackButton={true}
      title="OTP Verification"
      titleStyle={styles.headerTitle}
      headerStyle={styles.header}
      isTitleCentered={false}
      hideHeader={false}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>{STRINGS.WE_HAVE_SENT_OTP}</Text>
            <Text style={styles.phoneNumber}>
              {(route as any)?.params?.phoneNumber}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              autoFocus={false}
              hideStick={true}
              placeholder="******"
              blurOnFilled={true}
              type="numeric"
              secureTextEntry={false}
              focusStickBlinkingDuration={500}
              onFocus={() => console.log('Focused')}
              onBlur={() => console.log('Blurred')}
              onTextChange={text => console.log(text)}
              onFilled={text => {
                console.log(`OTP is ${text}`);
                resetAndNavigate('MainTabs');
              }}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
              }}
              textProps={{
                accessibilityRole: 'text',
                accessibilityLabel: 'OTP digit',
                allowFontScaling: false,
              }}
              theme={{
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                marginTop: theme.spacing.lg,
                textAlign: 'center',
                color: theme.colors.textPrimary,
                fontSize: theme.fontSizes.sm,
                fontFamily: theme.fonts.body,
              }}
            >
              {STRINGS.DID_NOT_GET_OTP}{' '}
              <Text
                style={{
                  marginTop: theme.spacing.lg,
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                  fontFamily: theme.fonts.body,
                }}
              >
                Resend SMS in 16s
              </Text>
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.goBackText} onPress={() => goBack()}>
            {STRINGS.GO_BACK_TO_LOGIN}
          </Text>
        </View>
      </View>
    </CommonContainer>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: '600',
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primaryDark,
  },
  header: {
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg * 2,
  },
  textContainer: {
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.italic,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
  },
  phoneNumber: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
  },
  otpContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.card,
    width: 50,
    height: 50,
    marginHorizontal: theme.spacing.sm / 2,
  },
  pinCodeText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
  focusStick: {
    backgroundColor: theme.colors.highlight,
    height: 2,
  },
  activePinCodeContainer: {
    borderColor: theme.colors.primaryDark,
  },
  placeholderText: {
    color: theme.colors.textDisabled,
  },
  filledPinCodeContainer: {
    backgroundColor: theme.colors.primary,
  },
  disabledPinCodeContainer: {
    backgroundColor: theme.colors.border,
  },
  goBackText: {
    color: theme.colors.highlight,
    fontFamily: theme.fonts.italic,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
  },
});
