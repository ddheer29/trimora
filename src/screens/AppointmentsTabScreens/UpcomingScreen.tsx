import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import theme from '../../utils/Theme';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { ActivityIndicator, FlatList } from 'react-native';
import moment from 'moment';

const UpcomingScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      if (response.status === 'success') {
        setBookings(response.data || []);
      }
    } catch (error) {
      console.log('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const salon = item.salonId as any;
    const service = item.serviceId as any;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: salon?.images?.[0] || 'https://i.imgur.com/GXoYrQy.jpg' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.serviceName}>{service?.name || 'Service'}</Text>
          <Text style={styles.datetime}>
            {moment(item.bookingDate).format('DD MMM')}, {item.startTime}
          </Text>
          <Text style={styles.statusText}>Status: {item.status}</Text>
          <Text style={styles.price}>₹{item.totalAmount}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            {item.status === 'pending' && (
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={item => item._id}
      renderItem={renderBookingItem}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No upcoming appointments found.</Text>
      }
    />
  );
};

export default UpcomingScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  image: {
    width: 110,
    height: '100%',
  },
  details: {
    flex: 1,
    padding: theme.spacing.md,
  },
  serviceName: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  datetime: {
    marginTop: 4,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  inDays: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.highlight,
    marginVertical: 4,
  },
  price: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.primaryDark,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  viewButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  viewButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.body,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  editButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  editButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  statusText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginVertical: 2,
  },
});
