import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import { useCartStore } from '@/store/cartStore';

const BookingForScreen: FC<any> = ({ navigation }) => {
  const {
    forSelf,
    guestName: storeGuestName,
    guestPhone: storeGuestPhone,
    serviceLocation,
    serviceAddress,
    setBookingFor,
    setServiceLocation,
  } = useCartStore();

  const [guestName, setGuestName] = useState(storeGuestName || '');
  const [guestPhone, setGuestPhone] = useState(storeGuestPhone || '');
  const [address, setAddress] = useState(serviceAddress?.address || '');

  const handleNext = () => {
    if (!forSelf && (!guestName || !guestPhone)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter guest details',
        topOffset: 60,
      });
      return;
    }
    if (serviceLocation === 'home' && !address) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter service address',
        topOffset: 60,
      });
      return;
    }

    setBookingFor(forSelf, guestName, guestPhone);
    if (serviceLocation === 'home') {
      setServiceLocation('home', {
        address,
        latitude: 0, // In a real app, these would come from a map picker
        longitude: 0,
      });
    } else {
      setServiceLocation('salon');
    }

    navigation.navigate('PaymentScreen');
  };

  return (
    <CommonContainer
      showBackButton
      title="Booking For"
      hideHeader={false}
      noPadding
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Who is booking for? */}
          <Text style={styles.sectionTitle}>Who are you booking for?</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.choiceButton, forSelf && styles.selectedChoice]}
              onPress={() => setBookingFor(true)}
            >
              <Text
                style={[
                  styles.choiceText,
                  forSelf && styles.selectedChoiceText,
                ]}
              >
                Self
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choiceButton, !forSelf && styles.selectedChoice]}
              onPress={() => setBookingFor(false)}
            >
              <Text
                style={[
                  styles.choiceText,
                  !forSelf && styles.selectedChoiceText,
                ]}
              >
                Someone Else
              </Text>
            </TouchableOpacity>
          </View>

          {!forSelf && (
            <View style={styles.form}>
              <Text style={styles.label}>Guest Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest name"
                value={guestName}
                onChangeText={setGuestName}
              />
              <Text style={styles.label}>Guest Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest phone number"
                keyboardType="phone-pad"
                maxLength={10}
                value={guestPhone}
                onChangeText={setGuestPhone}
              />
            </View>
          )}

          {/* Service Location */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Service Location
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                serviceLocation === 'salon' && styles.selectedChoice,
              ]}
              onPress={() => setServiceLocation('salon')}
            >
              <Text
                style={[
                  styles.choiceText,
                  serviceLocation === 'salon' && styles.selectedChoiceText,
                ]}
              >
                At Salon
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                serviceLocation === 'home' && styles.selectedChoice,
              ]}
              onPress={() => setServiceLocation('home')}
            >
              <Text
                style={[
                  styles.choiceText,
                  serviceLocation === 'home' && styles.selectedChoiceText,
                ]}
              >
                At Home
              </Text>
            </TouchableOpacity>
          </View>

          {serviceLocation === 'home' && (
            <View style={styles.form}>
              <Text style={styles.label}>Service Address</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Enter your full address"
                multiline
                value={address}
                onChangeText={setAddress}
              />
              <Text style={styles.hint}>
                Note: Latitude and longitude will be calculated automatically.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </CommonContainer>
  );
};

export default BookingForScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
  },
  selectedChoice: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryDark + '10',
  },
  choiceText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  selectedChoiceText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.subheading,
  },
  form: {
    marginTop: 20,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: 15,
    color: theme.colors.textPrimary,
  },
  hint: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  nextButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  nextButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
});
