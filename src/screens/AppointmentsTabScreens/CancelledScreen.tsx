import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import theme from '../../utils/Theme';
import { bookingService } from '@/services/bookingService';
import { CustomerBooking } from '@/types';
import BookingCard from '@/components/Booking/BookingCard';
import Toast from 'react-native-toast-message';

const CancelledScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBookings = async (pageNum: number, isRefresh = false) => {
    try {
      if (pageNum === 1 && !isRefresh) setLoading(true);
      const res = await bookingService.getAppointments('cancelled', pageNum);
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
      console.error('Error fetching cancelled bookings:', error);
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

  const handleBookAgain = async (bookingId: string) => {
    try {
      const res = await bookingService.getRebookData(bookingId);
      if (res.status === 'success') {
        if (res.data?.salonId) {
          navigation.navigate('SalonDetailsScreen', {
            salonId: res.data.salonId,
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch rebook data',
      });
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
            onBookAgain={() => handleBookAgain(item.bookingId)}
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
            <Text style={styles.emptyText}>
              No cancelled appointments found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CancelledScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: theme.spacing.md,
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
