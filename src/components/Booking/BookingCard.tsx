import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import theme from '../../utils/Theme';
import { CustomerBooking } from '@/types';
import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

interface BookingCardProps {
  booking: CustomerBooking;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (booking: CustomerBooking) => void;
  onRate?: (bookingId: string) => void;
  onBookAgain?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onReschedule,
  onRate,
  onBookAgain,
}) => {
  const isUpcoming = booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed';
  const isCompleted = booking.bookingStatus === 'completed';
  const isCancelled = booking.bookingStatus === 'cancelled';

  const getStatusColor = () => {
    switch (booking.bookingStatus) {
      case 'confirmed':
        return theme.colors.success;
      case 'completed':
        return theme.colors.primaryDark;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Image
          source={{ uri: booking.salonImage || 'https://i.imgur.com/GXoYrQy.jpg' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.salonName} numberOfLines={1}>
              {booking.salonName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.stylistName}>Stylist: {booking.stylistName}</Text>

          <View style={styles.timeRow}>
            <Icon name="calendar-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.timeText}>
              {dayjs(booking.bookingDate).format('DD MMM')} • {booking.bookingTime}
            </Text>
          </View>
          
          <Text style={styles.priceText}>₹{booking.price}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {isUpcoming && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => onReschedule?.(booking)}
            >
              <Text style={styles.secondaryButtonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => onCancel?.(booking.bookingId)}
            >
              <Text style={styles.dangerButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {isCompleted && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => onRate?.(booking.bookingId)}
            >
              <Text style={styles.secondaryButtonText}>Rate Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => onBookAgain?.(booking.bookingId)}
            >
              <Text style={styles.primaryButtonText}>Book Again</Text>
            </TouchableOpacity>
          </>
        )}

        {isCancelled && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { width: '100%' }]}
            onPress={() => onBookAgain?.(booking.bookingId)}
          >
            <Text style={styles.primaryButtonText}>Book Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  details: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  salonName: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: theme.fonts.subheading,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  stylistName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
  },
  priceText: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
    fontSize: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  secondaryButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.subheading,
    fontSize: 12,
  },
  dangerButton: {
    backgroundColor: theme.colors.error + '20',
  },
  dangerButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
    fontSize: 12,
  },
});
