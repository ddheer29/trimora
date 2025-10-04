import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useState } from 'react';
import theme from '../../utils/Theme';
import PhoneInput from '../../components/Input/PhoneInput';

const PhoneNumberScreen = () => {
  const { width } = useWindowDimensions();
  const logoSize = width * 0.5;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon/appLogo.png')}
        style={{ width: logoSize, height: logoSize }}
        resizeMode="contain"
      />
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text style={styles.title}>India's Leading Beauty & Wellness App</Text>
        <View>
          <PhoneInput
            value={phoneNumber}
            enableLocationDetection={true}
            askForPermission={true}
            defaultCountry="US"
            onChangeText={setPhoneNumber}
            onCountryChange={setSelectedCountry}
            theme={theme}
            containerStyle={{
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primaryDark,
            }}
            countryCodeButtonStyle={{
              backgroundColor: theme.colors.accent,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
            }}
            inputStyle={{
              color: theme.colors.textPrimary,
              fontSize: theme.fontSizes.lg,
            }}
            // Content
            placeholder="Enter your phone number"
            placeholderTextColor={theme.colors.textDisabled}
            // Other props
            defaultCountry="IN"
            autoFocus={true}
          />
        </View>
      </View>
    </View>
  );
};

export default PhoneNumberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingTop: theme.spacing.lg * 4,
  },
  title: {
    fontSize: 24,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});
