import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';

// Country data with dial codes and flags
const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
];

const PhoneInput = ({
  // Value & handlers
  value = '',
  onChangeText,
  onCountryChange,

  // Styling props
  theme,
  containerStyle,
  countryCodeButtonStyle,
  inputStyle,
  modalStyle,
  countryItemStyle,

  // Text & content
  placeholder = 'Phone number',
  placeholderTextColor,

  // States
  defaultCountry = 'US',

  // Other props
  ...props
}) => {
  // Find default country
  const defaultCountryData =
    COUNTRIES.find(country => country.code === defaultCountry) || COUNTRIES[0];

  const [selectedCountry, setSelectedCountry] = useState(defaultCountryData);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    value.replace(selectedCountry.dialCode, ''),
  );
  const phoneInputRef = useRef(null);

  // Default theme fallback
  const currentTheme = theme || {
    colors: {
      primary: '#F9D9D9',
      primaryDark: '#B76E79',
      accent: '#E6E6FA',
      background: '#FFF9F9',
      card: '#FFF1F3',
      border: '#EAD7D7',
      textPrimary: '#333333',
      textSecondary: '#666666',
      textDisabled: '#AAAAAA',
      textOnPrimary: '#FFFFFF',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 8, md: 16, lg: 24, full: 999 },
    fonts: { body: 'System', heading: 'System' },
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22 },
    shadows: {
      soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    },
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
    setModalVisible(false);

    // Update the parent component with the full phone number
    const newFullNumber = country.dialCode + phoneNumber;
    onChangeText?.(newFullNumber);
    onCountryChange?.(country);
  };

  const handlePhoneNumberChange = text => {
    // Remove non-numeric characters except plus sign
    const cleanedText = text.replace(/[^\d]/g, '');
    setPhoneNumber(cleanedText);

    // Combine country code and phone number
    const fullNumber = selectedCountry.dialCode + cleanedText;
    onChangeText?.(fullNumber);
  };

  const openCountryPicker = () => {
    Keyboard.dismiss();
    setModalVisible(true);
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles(currentTheme).countryItem, countryItemStyle]}
      onPress={() => handleCountrySelect(item)}
    >
      <Text style={styles(currentTheme).flag}>{item.flag}</Text>
      <Text
        style={[
          styles(currentTheme).countryName,
          { fontFamily: currentTheme.fonts.body },
        ]}
      >
        {item.name}
      </Text>
      <Text
        style={[
          styles(currentTheme).dialCode,
          { fontFamily: currentTheme.fonts.body },
        ]}
      >
        {item.dialCode}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles(currentTheme).container, containerStyle]}>
      {/* Country Code Selector */}
      <TouchableOpacity
        style={[styles(currentTheme).countryCodeButton, countryCodeButtonStyle]}
        onPress={openCountryPicker}
      >
        <Text style={styles(currentTheme).flag}>{selectedCountry.flag}</Text>
        <Text
          style={[
            styles(currentTheme).dialCodeText,
            { fontFamily: currentTheme.fonts.body },
          ]}
        >
          {selectedCountry.dialCode}
        </Text>
        <Text style={styles(currentTheme).dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Phone Number Input */}
      <TextInput
        ref={phoneInputRef}
        style={[
          styles(currentTheme).phoneInput,
          { fontFamily: currentTheme.fonts.body },
          inputStyle,
        ]}
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor || currentTheme.colors.textDisabled
        }
        keyboardType="phone-pad"
        {...props}
      />

      {/* Country Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles(currentTheme).modalContainer, modalStyle]}>
          <View style={styles(currentTheme).modalContent}>
            <View style={styles(currentTheme).modalHeader}>
              <Text
                style={[
                  styles(currentTheme).modalTitle,
                  { fontFamily: currentTheme.fonts.heading },
                ]}
              >
                Select Country
              </Text>
              <TouchableOpacity
                style={styles(currentTheme).closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles(currentTheme).closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRIES}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
              showsVerticalScrollIndicator={true}
              style={styles(currentTheme).countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      height: 56,
      ...theme.shadows.soft,
    },
    countryCodeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: theme.spacing.md,
      marginRight: theme.spacing.md,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      minWidth: 80,
    },
    flag: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
    dialCodeText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    dropdownArrow: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    phoneInput: {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.textPrimary,
      padding: 0,
      ...Platform.select({
        ios: {
          height: 40,
        },
        android: {
          height: 50,
        },
      }),
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      maxHeight: '80%',
      ...theme.shadows.medium,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    closeButtonText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
      fontWeight: 'bold',
    },
    countryList: {
      paddingHorizontal: theme.spacing.lg,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    countryName: {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.textPrimary,
      marginLeft: theme.spacing.sm,
    },
    dialCode: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
  });

export default PhoneInput;
