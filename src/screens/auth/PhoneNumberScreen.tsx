import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import theme from '@utils/Theme';
import CustomButton from '@components/Buttons/CustomButton';
import PhoneInput from '@components/Input/PhoneInput';
import { navigate } from '@utils/NavigationUtil';
import { authService } from '@/services/authService';

const PhoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (!cleanedPhoneNumber || cleanedPhoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setLoginLoading(true);
    try {
      const response = await authService.sendOtp(phoneNumber);

      if (response.message === 'OTP sent successfully') {
        Alert.alert('Success', 'OTP sent successfully to ' + phoneNumber);
        navigate('VerifyOtpScreen', { phoneNumber: phoneNumber });
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.log('OTP Send Error:', error.response?.data);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to send OTP. Please try again.',
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');
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
});
