import React, { useState, useRef, useEffect } from 'react';
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
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

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
  // Add more countries as needed
];

interface PhoneInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onCountryChange?: (country: any) => void;
  theme?: any;
  containerStyle?: any;
  countryCodeButtonStyle?: any;
  inputStyle?: any;
  modalStyle?: any;
  countryItemStyle?: any;
  placeholder?: string;
  placeholderTextColor?: string;
  defaultCountry?: string;
  enableLocationDetection?: boolean;
  askForPermission?: boolean;
  [key: string]: any;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
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
  enableLocationDetection = true,
  askForPermission = true,

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
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [sortedCountries, setSortedCountries] = useState(COUNTRIES);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const phoneInputRef = useRef(null);

  // Default theme fallback
  const currentTheme = theme || {
    colors: {
      primary: '#F9D9D9',
      primaryDark: '#B76E79',
      accent: '#E6E6FA',
      background: '#5a4646ff',
      card: '#FFF1F3',
      border: '#EAD7D7',
      textPrimary: '#333333',
      textSecondary: '#666666',
      textDisabled: '#AAAAAA',
      textOnPrimary: '#FFFFFF',
      success: '#B4E1C6',
      warning: '#FFF5BA',
      error: '#FFCCCC',
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

  // Check location permission status
  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        setLocationPermissionGranted(result);
        return result;
      } catch (error) {
        console.warn('Error checking location permission:', error);
        return false;
      }
    } else {
      // iOS - Geolocation API doesn't have a direct permission check method
      // We'll rely on the error handling in getCurrentPosition
      return new Promise(resolve => {
        Geolocation.getCurrentPosition(
          () => {
            setLocationPermissionGranted(true);
            resolve(true);
          },
          error => {
            setLocationPermissionGranted(false);
            resolve(false);
          },
          { enableHighAccuracy: false, timeout: 1000, maximumAge: 10000 },
        );
      });
    }
  };

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to detect your country code.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setLocationPermissionGranted(isGranted);
        return isGranted;
      } catch (err) {
        console.warn('Location permission error:', err);
        setLocationPermissionGranted(false);
        return false;
      }
    } else {
      // iOS - Permission is handled automatically by getCurrentPosition
      // We'll show an alert explaining why we need location
      return new Promise(resolve => {
        Alert.alert(
          'Location Access Needed',
          'To detect your country code, please allow location access when prompted.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setLocationPermissionGranted(false);
                resolve(false);
              },
            },
            {
              text: 'Continue',
              onPress: () => {
                // iOS will show native permission dialog when getCurrentPosition is called
                resolve(true);
              },
            },
          ],
        );
      });
    }
  };

  // Get country from coordinates using reverse geocoding
  const getCountryFromCoordinates = (latitude: number, longitude: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.countryCode) {
            resolve(data.countryCode);
          } else {
            reject(new Error('Could not determine country from location'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // Handle location-based country detection
  const getLocationBasedCountry = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position: any) => {
          try {
            const { latitude, longitude } = position.coords;
            const countryCode = await getCountryFromCoordinates(
              latitude,
              longitude,
            );
            resolve(countryCode);
          } catch (error) {
            reject(error);
          }
        },
        (error: any) => {
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    });
  };

  // Detect user's location and set country
  const detectUserCountry = async () => {
    if (!enableLocationDetection) return;

    setIsDetectingLocation(true);

    try {
      // Check if we already have permission
      const hasPermission = await checkLocationPermission();

      // Request permission if needed
      if (!hasPermission && askForPermission) {
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          throw new Error('Location permission denied');
        }
      }

      // Get location and country
      const countryCode = (await getLocationBasedCountry()) as string;

      const detectedCountry = COUNTRIES.find(
        country => country.code === countryCode.toUpperCase(),
      );

      if (detectedCountry) {
        setSelectedCountry(detectedCountry);
        onCountryChange?.(detectedCountry);

        // Update phone number with new country code
        const newFullNumber = detectedCountry.dialCode + phoneNumber;
        onChangeText?.(newFullNumber);

        // Sort countries with detected country first
        const sorted = [...COUNTRIES].sort((a, b) => {
          if (a.code === countryCode.toUpperCase()) return -1;
          if (b.code === countryCode.toUpperCase()) return 1;
          return a.name.localeCompare(b.name);
        });
        setSortedCountries(sorted);
      }
    } catch (error: any) {
      console.warn('Location-based detection failed:', error);

      // Show appropriate error message
      if (error?.code === 1 || error?.code === 2 || error?.code === 3) {
        // Permission denied or location unavailable
        Alert.alert(
          'Location Unavailable',
          'Unable to access your location. Using IP-based detection instead.',
          [{ text: 'OK' }],
        );
      }

      // Fallback to IP-based country detection
      await fallbackCountryDetection();
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Fallback country detection using IP (HTTPS)
  const fallbackCountryDetection = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data && data.country_code) {
        const detectedCountry = COUNTRIES.find(
          country => country.code === data.country_code,
        );

        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
          onCountryChange?.(detectedCountry);

          // Sort countries with detected country first
          const sorted = [...COUNTRIES].sort((a, b) => {
            if (a.code === data.country_code) return -1;
            if (b.code === data.country_code) return 1;
            return a.name.localeCompare(b.name);
          });
          setSortedCountries(sorted);

          Alert.alert(
            'Country Detected',
            `Based on your IP, we've set your country to ${detectedCountry.name}`,
            [{ text: 'OK' }],
          );
        }
      }
    } catch (error) {
      console.warn('IP-based country detection failed:', error);
      // Keep default sorting
      setSortedCountries(COUNTRIES);
    }
  };

  // Auto-detect country on component mount
  useEffect(() => {
    if (enableLocationDetection) {
      detectUserCountry();
    }
  }, [enableLocationDetection]);

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setModalVisible(false);

    // Update the parent component with the full phone number
    const newFullNumber = country.dialCode + phoneNumber;
    onChangeText?.(newFullNumber);
    onCountryChange?.(country);
  };

  const handlePhoneNumberChange = (text: string) => {
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

  const manuallyDetectLocation = () => {
    if (isDetectingLocation) return;

    Alert.alert(
      'Detect Your Country',
      'This will use your device location to detect your country. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Detect',
          onPress: detectUserCountry,
        },
      ],
    );
  };

  const renderCountryItem = ({ item }: { item: any }) => (
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
      {item.code === selectedCountry.code && (
        <Text style={styles(currentTheme).selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles(currentTheme).container, containerStyle]}>
      {/* Country Code Selector */}
      <TouchableOpacity
        style={[styles(currentTheme).countryCodeButton, countryCodeButtonStyle]}
        onPress={openCountryPicker}
        onLongPress={manuallyDetectLocation}
      >
        {isDetectingLocation ? (
          <Text style={styles(currentTheme).detectingText}>⌛</Text>
        ) : (
          <Text style={styles(currentTheme).flag}>{selectedCountry.flag}</Text>
        )}
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

      {/* Location Detection Indicator */}
      {enableLocationDetection && (
        <TouchableOpacity
          style={styles(currentTheme).locationButton}
          onPress={manuallyDetectLocation}
          disabled={isDetectingLocation}
        >
          <Text
            style={[
              styles(currentTheme).locationIcon,
              isDetectingLocation && styles(currentTheme).locationIconDisabled,
            ]}
          >
            {isDetectingLocation ? '⌛' : '📍'}
          </Text>
        </TouchableOpacity>
      )}

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
              <View style={styles(currentTheme).modalHeaderActions}>
                <TouchableOpacity
                  style={[
                    styles(currentTheme).detectButton,
                    isDetectingLocation &&
                    styles(currentTheme).detectButtonDisabled,
                  ]}
                  onPress={manuallyDetectLocation}
                  disabled={isDetectingLocation}
                >
                  <Text style={styles(currentTheme).detectButtonText}>
                    {isDetectingLocation ? 'Detecting...' : '📍 Detect'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles(currentTheme).closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles(currentTheme).closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={sortedCountries}
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

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
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
      minWidth: 60,
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
    locationButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    locationIcon: {
      fontSize: 16,
      color: theme.colors.primaryDark,
    },
    locationIconDisabled: {
      color: theme.colors.textDisabled,
    },
    detectingText: {
      fontSize: 16,
      marginRight: theme.spacing.sm,
      color: theme.colors.textDisabled,
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
    modalHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    detectButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    detectButtonDisabled: {
      backgroundColor: theme.colors.textDisabled,
    },
    detectButtonText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textOnPrimary,
      fontFamily: theme.fonts.body,
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
      marginRight: theme.spacing.sm,
    },
    selectedIndicator: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primaryDark,
      fontWeight: 'bold',
    },
  });

export default PhoneInput;
