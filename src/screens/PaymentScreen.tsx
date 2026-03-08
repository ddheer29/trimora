import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import { useCartStore } from '@/store/cartStore';
import { salonService } from '@/services/salonService';

const PaymentScreen: FC<any> = ({ navigation }) => {
  const {
    salonId,
    services,
    stylist,
    bookingDate,
    startTime,
    serviceLocation,
    serviceAddress,
    forSelf,
    guestName,
    guestPhone,
    paymentMethod,
    setPaymentMethod,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
    try {
      setLoading(true);

      const bookingData = {
        salonId,
        stylistId: stylist?._id,
        // Sending the first serviceId for now as per API spec
        serviceId: services[0]?._id,
        bookingDate,
        startTime,
        serviceLocation,
        serviceAddress: serviceLocation === 'home' ? serviceAddress : undefined,
        paymentMethod,
        forSelf,
        guestName: !forSelf ? guestName : undefined,
        guestPhone: !forSelf ? guestPhone : undefined,
      };

      if (paymentMethod === 'online') {
        // Mock Razorpay Payment
        Alert.alert(
          'Online Payment',
          `Procceding to Pay ₹${totalPrice} via Razorpay...`,
          [
            {
              text: 'Simulate Success',
              onPress: async () => {
                const res = await salonService.bookService(bookingData);
                if (res.status === 'success') {
                  clearCart();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'BookingSuccessScreen' }],
                  });
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Booking Failed',
                      text2: res.message || 'Something went wrong',
                    });
                  }
              },
            },
            {
              text: 'Cancel',
              onPress: () => setLoading(false),
              style: 'cancel',
            },
          ]
        );
      } else {
        // Cash payment - direct booking
        const res = await salonService.bookService(bookingData);
        if (res.status === 'success') {
          clearCart();
          navigation.reset({
            index: 0,
            routes: [{ name: 'BookingSuccessScreen' }],
          });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Booking Failed',
              text2: res.message || 'Something went wrong',
            });
          }
      }
    } catch (error) {
      console.error('Booking error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while booking',
      });
    } finally {
      if (paymentMethod === 'cash') setLoading(false);
    }
  };

  return (
    <CommonContainer showBackButton title="Payment Options">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Services:</Text>
            <Text style={styles.summaryValue}>{services.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryTotal}>₹{totalPrice}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time:</Text>
            <Text style={styles.summaryValue}>
              {bookingDate}, {startTime}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'online' && styles.selectedMethod,
          ]}
          onPress={() => setPaymentMethod('online')}
        >
          <View style={styles.radioContainer}>
            <View style={[styles.radio, paymentMethod === 'online' && styles.radioActive]} />
          </View>
          <View>
            <Text style={styles.methodTitle}>Online Payment</Text>
            <Text style={styles.methodDesc}>Pay via Razorpay (UPI, Cards, Wallets)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'cash' && styles.selectedMethod,
          ]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.radioContainer}>
            <View style={[styles.radio, paymentMethod === 'cash' && styles.radioActive]} />
          </View>
          <View>
            <Text style={styles.methodTitle}>Pay at Salon (Cash)</Text>
            <Text style={styles.methodDesc}>Pay directly after service</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.bookButton, loading && styles.disabledButton]}
        disabled={loading}
        onPress={handleBooking}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textOnPrimary} />
        ) : (
          <Text style={styles.bookButtonText}>
            {paymentMethod === 'online' ? 'Pay & Book' : 'Confirm Booking'}
          </Text>
        )}
      </TouchableOpacity>
    </CommonContainer>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 30,
    ...theme.shadows.medium,
  },
  summaryTitle: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    color: theme.colors.textOnPrimary + 'AA',
    fontSize: theme.fontSizes.sm,
  },
  summaryValue: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.subheading,
  },
  summaryTotal: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  methodButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedMethod: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryDark + '08',
  },
  radioContainer: {
    marginRight: 15,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  radioActive: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryDark,
  },
  methodTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  methodDesc: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  bookButton: {
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
  disabledButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  bookButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
});
