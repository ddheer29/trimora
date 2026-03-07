import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import theme from '../../utils/Theme';
import { useRoute } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
import { STRINGS } from '@screens/auth/string';
import { authService } from '../../services/authService';
import { useUserStore } from '../../store/userStore';
import { goBack, resetAndNavigate } from '@utils/NavigationUtil';
import CommonContainer from '@components/CommonContainer';
import Toast from 'react-native-toast-message';

const VerifyOtpScreen = () => {
  const route = useRoute();
  const { phoneNumber } = (route as any)?.params || {};
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const { login } = useUserStore();

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpFilled = async (otp: string) => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpError('');

    try {
      const params = route.params as { loginAs?: string } | undefined;
      const response = await authService.verifyOtp(
        phoneNumber,
        otp,
        params?.loginAs,
      );
      console.log('🚀 -> handleOtpFilled -> response:', response);

      if (
        response.accessToken &&
        response.refreshToken &&
        response.data?.user
      ) {
        login(response.data.user, {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login Successfull!',
          swipeable: true,
        });
        const actualUser = response.data.user;
        if (actualUser.role === 'partner') {
          if (actualUser.isProfileCompleted) {
            resetAndNavigate('PartnerBottomTab');
          } else {
            resetAndNavigate('SalonSetupWelcomeScreen');
          }
        } else {
          if (actualUser.isProfileCompleted) {
            resetAndNavigate('MainTabs');
          } else {
            resetAndNavigate('EditProfileScreen');
          }
        }
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.log('OTP Verify Error:', error.response?.data);
      const errorMessage =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResendLoading) return;

    setIsResendLoading(true);

    try {
      const response = await authService.sendOtp(phoneNumber);

      if (response.status === 'success') {
        Alert.alert('Success', 'OTP sent successfully');
        setResendCountdown(30); // Reset countdown
        setOtpError('');
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      console.log('Resend OTP Error:', error.response?.data);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to resend OTP. Please try again.',
      );
    } finally {
      setIsResendLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
  };

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
              {formatPhoneNumber(phoneNumber)}
            </Text>
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
          </View>

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              autoFocus={true}
              hideStick={true}
              placeholder="000000"
              blurOnFilled={false}
              type="numeric"
              secureTextEntry={false}
              focusStickBlinkingDuration={500}
              onTextChange={() => setOtpError('')}
              onFilled={handleOtpFilled}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
              }}
              theme={{
                pinCodeContainerStyle: [
                  styles.pinCodeContainer,
                  otpError ? styles.pinCodeContainerError : {},
                ] as any,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
              }}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {STRINGS.DID_NOT_GET_OTP}{' '}
              {resendCountdown > 0 ? (
                <Text style={styles.countdownText}>
                  Resend SMS in {resendCountdown}s
                </Text>
              ) : (
                <Text
                  style={[
                    styles.resendButtonText,
                    isResendLoading && styles.resendButtonDisabled,
                  ]}
                  onPress={handleResendOtp}
                >
                  {isResendLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              )}
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
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
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
  pinCodeContainerError: {
    borderColor: theme.colors.error,
  },
  pinCodeText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
  focusStick: {
    backgroundColor: theme.colors.primaryDark,
    height: 2,
  },
  activePinCodeContainer: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryLight,
  },
  placeholderText: {
    color: theme.colors.textDisabled,
  },
  filledPinCodeContainer: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryLight,
  },
  disabledPinCodeContainer: {
    backgroundColor: theme.colors.border,
  },
  resendContainer: {
    marginTop: theme.spacing.lg,
  },
  resendText: {
    textAlign: 'center',
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
  },
  countdownText: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  resendButtonText: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: theme.colors.textDisabled,
  },
  goBackText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.italic,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
    textDecorationLine: 'underline',
  },
});
