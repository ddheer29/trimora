import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import CommonContainer from '@components/CommonContainer';
import theme from '../../utils/Theme';
import { DashboardData, UpcomingBooking } from '@/types';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
import { useDashboard, useUpcomingBookings } from '@/hooks/useSalonQueries';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const [range, setRange] = useState<'7d' | '30d'>('7d');

  const {
    data: dashRes,
    isLoading: dashLoading,
    isRefetching: dashRefetching,
    refetch: refetchDash,
  } = useDashboard(range);

  const {
    data: upcomingRes,
    isLoading: upcomingLoading,
    isRefetching: upcomingRefetching,
    refetch: refetchUpcoming,
  } = useUpcomingBookings();

  const loading = dashLoading || upcomingLoading;
  const refreshing = dashRefetching || upcomingRefetching;
  const dashboardData: DashboardData | null =
    dashRes?.status === 'success' ? (dashRes.data as DashboardData) : null;
  const upcomingBookings: UpcomingBooking[] =
    upcomingRes?.status === 'success'
      ? (upcomingRes.data as any).upcomingBookings ?? []
      : [];

  const onRefresh = () => {
    refetchDash();
    refetchUpcoming();
  };

  const renderStatCard = (
    label: string,
    value: string | number,
    icon: string,
    color: string,
  ) => (
    <View style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: color + '20' }]}
      >
        <Icon name={icon as any} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <CommonContainer title="Dashboard">
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        </View>
      </CommonContainer>
    );
  }

  const stats = dashboardData?.stats;

  return (
    <CommonContainer
      title="Dashboard"
      showBackButton
      hideHeader={false}
      backgroundColor={'#FFFFFF'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Date Range Toggle */}
        <View style={styles.rangeContainer}>
          <TouchableOpacity
            style={[
              styles.rangeButton,
              range === '7d' && styles.rangeButtonActive,
            ]}
            onPress={() => setRange('7d')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === '7d' && styles.rangeButtonTextActive,
              ]}
            >
              Last 7 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButton,
              range === '30d' && styles.rangeButtonActive,
            ]}
            onPress={() => setRange('30d')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === '30d' && styles.rangeButtonTextActive,
              ]}
            >
              Last 30 Days
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatCard(
            "Today's Bookings",
            stats?.todayBookings || 0,
            'calendar-outline',
            '#4285F4',
          )}
          {renderStatCard(
            "Today's Revenue",
            `₹${stats?.todayRevenue || 0}`,
            'cash-outline',
            '#34A853',
          )}
          {renderStatCard(
            'Pending Bookings',
            stats?.pendingBookings || 0,
            'time-outline',
            '#FBBC05',
          )}
          {renderStatCard(
            'Total Customers',
            stats?.totalCustomers || 0,
            'people-outline',
            '#EA4335',
          )}
          {renderStatCard(
            'Total Revenue',
            `₹${stats?.totalRevenue || 0}`,
            'wallet-outline',
            '#9C27B0',
          )}
          {renderStatCard(
            'Avg Rating',
            stats?.averageRating || 0,
            'star-outline',
            '#FF9800',
          )}
        </View>

        {/* Revenue Line Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <LineChart
            areaChart
            data={dashboardData?.revenueTrend || []}
            width={width - 64}
            height={200}
            spacing={width / 8}
            initialSpacing={20}
            color={theme.colors.primaryDark}
            thickness={3}
            startFillColor={theme.colors.primaryDark}
            endFillColor={theme.colors.primaryLight}
            startOpacity={0.5}
            endOpacity={0.1}
            curved
            noOfSections={5}
            yAxisColor="#ddd"
            xAxisColor="#ddd"
            yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
            xAxisLabelTextStyle={{
              color: theme.colors.textSecondary,
              fontSize: 10,
            }}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: theme.colors.primaryDark,
              radius: 6,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={styles.pointerLabel}>
                    <Text style={styles.pointerLabelText}>
                      ₹{items[0].value}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>

        {/* Bookings Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Bookings Trend</Text>
          <BarChart
            data={dashboardData?.bookingTrend || []}
            width={width - 64}
            height={200}
            barWidth={22}
            noOfSections={5}
            barBorderRadius={4}
            frontColor={theme.colors.accent}
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
            xAxisLabelTextStyle={{
              color: theme.colors.textSecondary,
              fontSize: 10,
            }}
          />
        </View>

        {/* Popular Services Pie Chart */}
        {dashboardData?.popularServices &&
        dashboardData.popularServices.length > 0 ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Popular Services</Text>
            <View style={styles.pieContainer}>
              <PieChart
                data={dashboardData.popularServices}
                donut
                radius={80}
                innerRadius={50}
                centerLabelComponent={() => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      Top
                    </Text>
                  );
                }}
              />
              <View style={styles.pieLegend}>
                {dashboardData.popularServices.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendText} numberOfLines={1}>
                      {item.text} ({item.value}%)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {/* Upcoming Bookings */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BookingScreen')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <TouchableOpacity
                key={booking.bookingId}
                style={styles.bookingItem}
                onPress={() =>
                  navigation.navigate('BookingDetailsScreen', {
                    bookingId: booking.bookingId,
                  })
                }
              >
                <View style={styles.bookingTime}>
                  <Text style={styles.bookingTimeText}>
                    {dayjs(booking.bookingDate).format('DD MMM')}
                  </Text>
                  <Text style={styles.bookingTimeSub}>
                    {booking.bookingTime}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>
                    {booking.customerName}
                  </Text>
                  <Text style={styles.bookingSub}>
                    {booking.serviceName} • {booking.stylistName}
                  </Text>
                </View>
                <Icon
                  name="chevron-forward-outline"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming bookings</Text>
          )}
        </View>

        {/* Top Stylists */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Stylists</Text>
          <View style={styles.stylistHeader}>
            <Text style={[styles.stylistCol, { flex: 2 }]}>Stylist</Text>
            <Text style={styles.stylistCol}>Bookings</Text>
            <Text style={styles.stylistCol}>Revenue</Text>
          </View>
          {dashboardData?.topStylists.map((stylist, index) => (
            <View key={index} style={styles.stylistRow}>
              <Text style={[styles.stylistName, { flex: 2 }]}>
                {stylist.stylistName}
              </Text>
              <Text style={styles.stylistVal}>{stylist.totalBookings}</Text>
              <Text style={styles.stylistVal}>₹{stylist.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Cancellation Insights */}
        {dashboardData?.cancellationStats &&
        (dashboardData.cancellationStats.completed > 0 ||
          dashboardData.cancellationStats.cancelled > 0 ||
          dashboardData.cancellationStats.pending > 0) ? (
          <View style={[styles.chartCard, { marginBottom: 40 }]}>
            <Text style={styles.chartTitle}>Cancellation Insights (%)</Text>
            <View style={styles.pieContainer}>
              <PieChart
                data={[
                  {
                    value: dashboardData.cancellationStats.completed,
                    color: '#34A853',
                    text: 'Completed',
                  },
                  {
                    value: dashboardData.cancellationStats.cancelled,
                    color: '#EA4335',
                    text: 'Cancelled',
                  },
                  {
                    value: dashboardData.cancellationStats.pending,
                    color: '#FBBC05',
                    text: 'Pending',
                  },
                ]}
                radius={70}
                showText
                textColor="#fff"
                textSize={10}
              />
              <View style={styles.pieLegend}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: '#34A853' }]}
                  />
                  <Text style={styles.legendText}>
                    Completed ({dashboardData.cancellationStats.completed}%)
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: '#EA4335' }]}
                  />
                  <Text style={styles.legendText}>
                    Cancelled ({dashboardData.cancellationStats.cancelled}%)
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: '#FBBC05' }]}
                  />
                  <Text style={styles.legendText}>
                    Pending ({dashboardData.cancellationStats.pending}%)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </CommonContainer>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: theme.spacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  rangeButtonActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  rangeButtonText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.subheading,
  },
  rangeButtonTextActive: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: (width - theme.spacing.md * 2 - theme.spacing.sm) / 2,
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.subheading,
  },
  statValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chartTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 12,
  },
  pieLegend: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.subheading,
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.subheading,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bookingTime: {
    width: 60,
  },
  bookingTimeText: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  bookingTimeSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  bookingSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginVertical: 20,
  },
  stylistHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  stylistCol: {
    flex: 1,
    fontSize: 11,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  stylistRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  stylistName: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
  },
  stylistVal: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  pointerLabel: {
    height: 25,
    width: 50,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerLabelText: {
    color: 'white',
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
});
