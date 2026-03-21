import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import theme from '@utils/Theme';
import CustomButton from '@components/Buttons/CustomButton';
import PhoneInput from '@components/Input/PhoneInput';
import { navigate } from '@utils/NavigationUtil';
import { authService } from '@/services/authService';
import Toast from 'react-native-toast-message';

const PhoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('customer');

  const handleLogin = async () => {
    const numericPhone = phoneNumber.replace(/\D/g, '');
    if (!numericPhone || numericPhone.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number',
        swipeable: true,
      });
      return;
    }
    setLoginLoading(true);
    try {
      const response = await authService.sendOtp(phoneNumber, loginAs);
      console.log('🚀 -> handleLogin -> response:', response);

      if (response.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `OTP sent successfully to ${phoneNumber}`,
          swipeable: true,
        });
        navigate('VerifyOtpScreen', {
          phoneNumber: phoneNumber,
          loginAs: loginAs,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to send OTP',
          swipeable: true,
        });
      }
    } catch (error: any) {
      console.log('OTP Send Error:', error.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error.response?.data?.message ||
          'Failed to send OTP. Please try again.',
        swipeable: true,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/[^\d+]/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');
    // If it's a long number (including country code), just show it
    if (cleaned.length > 10) {
      return value.startsWith('+') ? value : '+' + value;
    }
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      return (
        match[1] +
        (match[2] ? ' ' + match[2] : '') +
        (match[3] ? ' ' + match[3] : '')
      );
    }

    return value;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Welcome Back
          </Text>
          <Text style={styles.subtitle}>
            Enter your phone number to continue.
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <View>
            <View style={styles.phoneInputContainer}>
              <PhoneInput
                value={formatPhoneNumber(phoneNumber)}
                enableLocationDetection={false}
                askForPermission={false}
                defaultCountry="IN"
                onChangeText={handlePhoneNumberChange}
                onCountryChange={setSelectedCountry}
                theme={theme}
                containerStyle={styles.phoneInputContainerStyle}
                countryCodeButtonStyle={styles.countryCodeButtonStyle}
                inputStyle={styles.phoneInputStyle}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.textDisabled}
                autoFocus={true}
                keyboardType="phone-pad"
              />
            </View>

            <CustomButton
              title="Login"
              loading={loginLoading}
              onPress={handleLogin}
              backgroundColor={theme.colors.primaryDark}
              loadingColor={theme.colors.textOnPrimary}
              disabledBackgroundColor={theme.colors.border}
              disabled={
                !phoneNumber || phoneNumber.replace(/\D/g, '').length < 10
              }
            />

            {/* Divider or Space */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Toggle Button / Switch Roles */}
            <View style={styles.toggleContainer}>
              <Text style={styles.rolePromptText}>
                {loginAs === 'customer'
                  ? 'Are you a Salon Partner?'
                  : 'Looking to book a service?'}
              </Text>
              <Text
                style={styles.switchRoleText}
                onPress={() => setLoginAs(loginAs === 'customer' ? 'partner' : 'customer')}
              >
                {loginAs === 'customer' ? 'Login as Partner' : 'Login as Customer'}
              </Text>
            </View>
          </View>

          {/* Footer with Agreements at absolute bottom */}
          <View style={styles.footerContainer}>
            <View style={styles.agreementTextContainer}>
              <Text style={styles.agreementText}>
                By continuing, you agree to our
              </Text>
            </View>
            <View style={styles.linksContainer}>
              <Text
                style={styles.linkText}
                onPress={() => navigate('TermsOfService')}
              >
                Terms of Service
              </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigate('PrivacyPolicy')}
              >
                Privacy Policy
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PhoneNumberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.spacing.xl * 3,
  },
  contentContainer: {
    flex: 1,
    width: '90%',
    maxWidth: 400,
  },
  titleContainer: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  title: {
    fontSize: 28,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between', // Push footer to bottom
    paddingBottom: theme.spacing.xl,
  },
  phoneInputContainer: {
    marginBottom: theme.spacing.xl,
  },
  phoneInputContainerStyle: {
    backgroundColor: theme.colors.card, // Overrides any default
    borderWidth: 1,
    borderColor: theme.colors.border, // Subtle border
    borderRadius: theme.borderRadius.md,
    height: 60, // Taller, premium input
  },
  countryCodeButtonStyle: {
    paddingRight: theme.spacing.sm,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  phoneInputStyle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
    paddingLeft: theme.spacing.sm,
  },
  footerContainer: {
    marginTop: 'auto',
    marginBottom: theme.spacing.lg,
  },
  agreementTextContainer: {
    alignItems: 'center',
  },
  agreementText: {
    color: theme.colors.textDisabled,
    textAlign: 'center',
    fontSize: theme.fontSizes.xs,
  },
  linksContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm / 2,
    textDecorationLine: 'underline',
    fontSize: theme.fontSizes.xs,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  rolePromptText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  switchRoleText: {
    color: theme.colors.accent,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.textDisabled,
    fontSize: theme.fontSizes.sm,
  },
});
