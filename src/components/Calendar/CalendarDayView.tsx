import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import dayjs from 'dayjs';
import { Booking } from '../../types';

interface Props {
  dateYmd: string;
  bookings: Booking[];
  onLongPressBooking: (booking: Booking) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM → 11 PM
const MINUTE_HEIGHT = 60; // 60px = 1 hour

export default function CalendarDayView({
  dateYmd,
  bookings,
  onLongPressBooking,
}: Props) {
  const sortedBookings = [...bookings].sort(
    (a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf(),
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ height: HOURS.length * MINUTE_HEIGHT }}
    >
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {/* Left Column - Time Labels */}
        <View style={{ width: 50 }}>
          {HOURS.map(hour => (
            <View
              key={hour}
              style={{ height: MINUTE_HEIGHT, justifyContent: 'flex-start' }}
            >
              <Text style={{ fontSize: 12 }}>
                {dayjs().hour(hour).minute(0).format('h A')}
              </Text>
            </View>
          ))}
        </View>

        {/* Right Column - Bookings Layer */}
        <View
          style={{
            flex: 1,
            position: 'relative',
            borderLeftWidth: 1,
            borderColor: '#ddd',
          }}
        >
          {/* Hour lines */}
          {HOURS.map((_, idx) => (
            <View
              key={idx}
              style={{
                position: 'absolute',
                top: idx * MINUTE_HEIGHT,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: '#eee',
              }}
            />
          ))}

          {/* Bookings */}
          {sortedBookings.map(booking => {
            const start = dayjs(booking.start);
            const end = dayjs(booking.end);
            const startMinutesFromDayStart =
              start.hour() * 60 + start.minute() - HOURS[0] * 60;
            const endMinutesFromDayStart =
              end.hour() * 60 + end.minute() - HOURS[0] * 60;

            const top = (startMinutesFromDayStart / 60) * MINUTE_HEIGHT;
            const height =
              ((endMinutesFromDayStart - startMinutesFromDayStart) / 60) *
              MINUTE_HEIGHT;

            // Adjust content dynamically
            let fontSize = 12;
            let showTime = true;
            let showAvatar = true;

            if (height < 30) {
              fontSize = 9;
              showTime = false;
              showAvatar = false;
            } else if (height < 50) {
              fontSize = 10;
              showAvatar = false;
            }

            return (
              <TouchableOpacity
                key={booking.id}
                style={[
                  styles.bookingCard,
                  {
                    top,
                    height,
                    backgroundColor: booking.color || '#60a5fa',
                  },
                ]}
                onLongPress={() => onLongPressBooking(booking)}
              >
                <Text style={[styles.bookingTitle, { fontSize }]}>
                  {booking.serviceName}
                </Text>
                {showTime && (
                  <Text
                    style={[styles.bookingTime, { fontSize: fontSize - 1 }]}
                  >
                    {start.format('h:mm A')} — {end.format('h:mm A')}
                  </Text>
                )}
                {showAvatar && booking.customer?.avatar && (
                  <Image
                    source={{ uri: booking.customer.avatar }}
                    style={styles.avatar}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bookingCard: {
    position: 'absolute',
    left: 5,
    right: 5,
    borderRadius: 8,
    padding: 4,
    overflow: 'hidden',
  },
  bookingTitle: {
    fontWeight: '600',
    color: '#fff',
  },
  bookingTime: {
    color: '#fff',
  },
  avatar: {
    marginTop: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
