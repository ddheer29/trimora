import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import theme from '../../utils/Theme';
import { bookingService } from '@/services/bookingService';
import { CustomerBooking } from '@/types';
import BookingCard from '@/components/Booking/BookingCard';
import RescheduleModal from '@/components/Booking/RescheduleModal';
import Toast from 'react-native-toast-message';

const UpcomingScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<CustomerBooking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async (pageNum: number, isRefresh = false) => {
    try {
      if (pageNum === 1 && !isRefresh) setLoading(true);
      const res = await bookingService.getAppointments('upcoming', pageNum);
      if (res.status === 'success') {
        const newBookings = res.data.bookings || [];
        if (isRefresh) {
          setBookings(newBookings);
        } else {
          setBookings(prev => {
            const existingIds = new Set(prev.map(b => b.bookingId));
            const uniqueNew = newBookings.filter(
              b => !existingIds.has(b.bookingId),
            );
            return [...prev, ...uniqueNew];
          });
        }
        setHasMore(newBookings.length === 10);
      }
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchBookings(1, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBookings(nextPage);
    }
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              const res = await bookingService.cancelBooking(bookingId);
              if (res.status === 'success') {
                Toast.show({
                  type: 'success',
                  text1: 'Booking Cancelled',
                });
                onRefresh();
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to cancel booking',
              });
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleOpenReschedule = (booking: CustomerBooking) => {
    setSelectedBooking(booking);
    setRescheduleVisible(true);
  };

  const handleReschedule = async (
    bookingId: string,
    date: string,
    time: string,
  ) => {
    try {
      setActionLoading(true);
      const res = await bookingService.rescheduleBooking(bookingId, date, time);
      if (res.status === 'success') {
        setRescheduleVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Booking Rescheduled',
        });
        onRefresh();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to reschedule booking',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={theme.colors.primaryDark} />
      </View>
    );
  };

  if (loading && bookings.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.bookingId}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={handleCancel}
            onReschedule={() => handleOpenReschedule(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming appointments found</Text>
          </View>
        }
      />

      <RescheduleModal
        visible={rescheduleVisible}
        booking={selectedBooking}
        onClose={() => setRescheduleVisible(false)}
        onReschedule={handleReschedule}
        loading={actionLoading}
      />
    </View>
  );
};

export default UpcomingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footerLoader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
});
