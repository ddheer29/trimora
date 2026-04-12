import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import CommonContainer from '@components/CommonContainer';
import theme from '../../utils/Theme';
import dayjs from 'dayjs';
import { Booking } from '@/types';
import { usePartnerBookings } from '@/hooks/useSalonQueries';

const BookingScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading: loading,
    isRefetching: refreshing,
    refetch,
  } = usePartnerBookings(page);

  const bookings: Booking[] = (data as any)?.data?.bookings ?? [];
  const hasMore = bookings.length === 10;

  const onRefresh = () => {
    setPage(1);
    refetch();
  };

  const loadMore = () => {
    if (!loading && !refreshing && hasMore) {
      setPage(prev => prev + 1);
    }
  };

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

  const renderBookingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() =>
        navigation.navigate('BookingDetailsScreen', { bookingId: item._id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.guestName || 'Customer'}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Service:</Text>
          <Text style={styles.infoValue}>{item.serviceId?.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>
            {dayjs(item.bookingDate).format('DD MMM')} at {item.startTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <CommonContainer title="Manage Bookings" hideHeader={false} showBackButton>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primaryDark}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item?._id?.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primaryDark]}
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() =>
              loading ? (
                <ActivityIndicator
                  color={theme.colors.primaryDark}
                  style={{ marginVertical: 20 }}
                />
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No bookings found.</Text>
              </View>
            )}
          />
        )}
      </View>
    </CommonContainer>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  customerName: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontFamily: theme.fonts.subheading,
  },
  cardBody: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    width: 70,
  },
  infoValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
});
