import { Alert, StyleSheet, Text, View } from 'react-native';
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
  const [loginAs, setLoginAs] = useState('partner');

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
            India's Leading Beauty & Wellness App
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              value={formatPhoneNumber(phoneNumber)}
              enableLocationDetection={true}
              askForPermission={true}
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
          <View>
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
            <View style={styles.agreementTextContainer}>
              <Text style={styles.agreementText}>
                By continuing, you agree to our
              </Text>
            </View>
            <View style={styles.linksContainer}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            {/* Toggle Button */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleWrapper}>
                <Text
                  onPress={() => setLoginAs('customer')}
                  style={[
                    styles.toggleText,
                    loginAs === 'customer' && styles.activeToggleText,
                  ]}
                >
                  Customer
                </Text>

                <Text
                  onPress={() => setLoginAs('partner')}
                  style={[
                    styles.toggleText,
                    loginAs === 'partner' && styles.activeToggleText,
                  ]}
                >
                  Partner
                </Text>
              </View>
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
    paddingTop: theme.spacing.lg * 4,
  },
  contentContainer: {
    marginTop: theme.spacing.lg,
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
    marginBottom: theme.spacing.md,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg * 2,
  },
  phoneInputContainer: {
    marginVertical: theme.spacing.lg,
  },
  phoneInputContainerStyle: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primaryDark,
  },
  countryCodeButtonStyle: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
  },
  phoneInputStyle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
  },
  agreementTextContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  agreementText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },

  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 30,
    padding: 4,
  },

  toggleText: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },

  activeToggleText: {
    backgroundColor: theme.colors.primaryDark,
    color: theme.colors.textOnPrimary,
  },
});
