import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import Icon from '@react-native-vector-icons/ionicons';

const BookingSuccessScreen: FC<any> = ({ navigation }) => {
  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <CommonContainer hideHeader>
      <View style={styles.container}>
        <View style={styles.successIconContainer}>
          <Icon name="checkmark-circle" size={100} color={theme.colors.success || '#4CAF50'} />
        </View>
        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.message}>
          Your appointment has been confirmed. You can view your booking details in the 'Bookings' tab.
        </Text>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </CommonContainer>
  );
};

export default BookingSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: 40,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.medium,
  },
  homeButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
});
