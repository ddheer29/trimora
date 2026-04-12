import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import theme from '../../utils/Theme';
import { CustomerBooking } from '@/types';
import dayjs from 'dayjs';

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

  const getStatusStyle = () => {
    switch (booking.bookingStatus) {
      case 'confirmed':
        return { bg: '#E6F4EA', text: '#1E7E34', label: 'Confirmed' };
      case 'completed':
        return { bg: '#E8F0FE', text: '#1967D2', label: 'Completed' };
      case 'cancelled':
        return { bg: '#FCE8E6', text: '#C5221F', label: 'Cancelled' };
      default:
        return { bg: '#FFF4E5', text: '#B76E00', label: booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1) };
    }
  };

  const status = getStatusStyle();

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Image
          source={{ uri: booking.salonImage || 'https://i.imgur.com/GXoYrQy.jpg' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.salonName} numberOfLines={1}>
              {booking.salonName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.text }]}>
                {status.label}
              </Text>
            </View>
          </View>

          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.stylistName}>Stylist: {booking.stylistName}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.infoText}>{dayjs(booking.bookingDate).format('DD MMM')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.infoText}>{booking.bookingTime}</Text>
            </View>
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
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => onCancel?.(booking.bookingId)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topSection: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  salonName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: theme.fonts.bold,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: '#475569',
    marginBottom: 2,
  },
  stylistName: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#334155',
    fontFamily: theme.fonts.bold,
  },
  priceText: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.bold,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  secondaryButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
});
