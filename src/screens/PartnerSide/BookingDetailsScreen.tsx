import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from 'react';
import CommonContainer from '@components/CommonContainer';
import theme from '../../utils/Theme';
import { salonService } from '@/services/salonService';
import dayjs from 'dayjs';
import Icon from '@react-native-vector-icons/ionicons';
import { Booking } from '@/types';

const BookingDetailsScreen = ({ route }: any) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await salonService.getBookingDetail(bookingId);
      console.log('🚀 -> fetchDetail -> res:', res);
      if (res.status === 'success') {
        setBooking(res.data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking detail:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch booking details',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [bookingId]);

  const handleUpdateStatus = async (
    status: 'confirmed' | 'cancelled' | 'completed',
  ) => {
    try {
      setUpdating(true);
      const res = await salonService.updateBookingStatus(bookingId, status);
      if (res.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Booking ${status} successfully`,
        });
        fetchDetail();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update booking status',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <CommonContainer showBackButton title="Booking Details">
        <ActivityIndicator
          size="large"
          color={theme.colors.primaryDark}
          style={styles.loader}
        />
      </CommonContainer>
    );
  }

  if (!booking) {
    return (
      <CommonContainer showBackButton title="Booking Details">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found.</Text>
        </View>
      </CommonContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success || '#4CAF50';
      case 'cancelled':
        return theme.colors.error || '#F44336';
      case 'completed':
        return theme.colors.primaryDark;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <CommonContainer showBackButton hideHeader={false} title="Booking Details">
      <ScrollView contentContainerStyle={styles.container}>
        {/* Status Header */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {booking.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.bookingId}>ID: {booking._id.slice(-8)}</Text>
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.detailRow}>
            <Icon
              name="person-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.detailText}>
              {booking.guestName || booking.customerId?.name || 'N/A'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() =>
              Linking.openURL(
                `tel:${booking.guestPhone || booking.customerId?.phone}`,
              )
            }
          >
            <Icon
              name="call-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={[styles.detailText, styles.linkText]}>
              {booking.guestPhone || booking.customerId?.phone || 'N/A'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Service Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <Icon
              name="cut-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.detailText}>{booking.serviceId?.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon
              name="time-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.detailText}>
              {dayjs(booking.bookingDate).format('DD MMM YYYY')},{' '}
              {booking.startTime}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon
              name="cash-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.detailText}>
              ₹{booking.serviceId?.price} ({booking.paymentMethod.toUpperCase()}
              )
            </Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Location</Text>
          <View style={styles.detailRow}>
            <Icon
              name="location-outline"
              size={20}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.detailText}>
              {booking.serviceLocation === 'home'
                ? "At Customer's Home"
                : 'At Salon'}
            </Text>
          </View>
          {booking.serviceLocation === 'home' && booking.serviceAddress && (
            <Text style={styles.addressText}>
              {booking.serviceAddress.address}
            </Text>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.actionContainer}>
          {updating ? (
            <ActivityIndicator color={theme.colors.primaryDark} />
          ) : (
            <>
              {booking.status === 'pending' && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => handleUpdateStatus('confirmed')}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleUpdateStatus('cancelled')}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
              {booking.status === 'confirmed' && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => handleUpdateStatus('completed')}
                  >
                    <Text style={styles.buttonText}>Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleUpdateStatus('cancelled')}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </CommonContainer>
  );
};

export default BookingDetailsScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing.lg,
    gap: 20,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.subheading,
  },
  bookingId: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  section: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.soft,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  detailText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  linkText: {
    color: theme.colors.primaryDark,
    textDecorationLine: 'underline',
  },
  addressText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: 32,
    fontFamily: theme.fonts.body,
  },
  actionContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  confirmButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  cancelButton: {
    backgroundColor: theme.colors.error || '#F44336',
  },
  buttonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
});
