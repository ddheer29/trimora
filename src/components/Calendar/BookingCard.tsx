import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import dayjs from 'dayjs';
import { HMMA } from '../../utils/dateUtils';
import { Booking } from '../../types';

type Props = {
  booking: Booking;
  onLongPress: (booking: Booking) => void;
  height?: number; // Pass in the height from CalendarDayView for responsive rendering
};

export default function BookingCard({
  booking,
  onLongPress,
  height = 60,
}: Props) {
  const isSmall = height < 40; // Very small slot (e.g., < 40px tall)
  const isMedium = height >= 40 && height < 70;

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(booking)}
      delayLongPress={300}
      style={[
        styles.card,
        {
          backgroundColor: booking.color || '#cce5ff',
          padding: isSmall ? 3 : isMedium ? 5 : 8,
        },
      ]}
    >
      {/* Service Name */}
      <Text
        style={[
          styles.serviceName,
          { fontSize: isSmall ? 10 : isMedium ? 12 : 14 },
        ]}
        numberOfLines={isSmall ? 1 : 2}
      >
        {booking.serviceName}
      </Text>

      {/* Time */}
      {!isSmall && (
        <Text
          style={[styles.time, { fontSize: isMedium ? 10 : 12 }]}
          numberOfLines={1}
        >
          {dayjs(booking.start).format(HMMA)} —{' '}
          {dayjs(booking.end).format(HMMA)}
        </Text>
      )}

      {/* Customer Name */}
      {!isSmall && (
        <Text
          style={[styles.customer, { fontSize: isMedium ? 10 : 12 }]}
          numberOfLines={1}
        >
          {booking.customer.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceName: {
    fontWeight: '600',
    color: '#fff',
  },
  time: {
    color: '#fff',
  },
  customer: {
    color: '#fff',
  },
});
