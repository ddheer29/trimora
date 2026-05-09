import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Settings,
  Calendar,
  Users,
  BarChart3,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Store,
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import theme from '@utils/Theme';
import { navigate } from '@utils/NavigationUtil';

const StatCard = ({ icon, value, label, change, isPositive }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={styles.statIconBox}>{icon}</View>
      <View
        style={[
          styles.changeBadge,
          {
            backgroundColor: isPositive
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
          },
        ]}
      >
        <Text
          style={[
            styles.changeText,
            { color: isPositive ? theme.colors.success : theme.colors.error },
          ]}
        >
          {isPositive ? '+' : ''}
          {change}
        </Text>
      </View>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const BookingItem = ({ initial, name, service, time, color }: any) => (
  <View style={styles.bookingItem}>
    <View style={[styles.bookingAvatar, { backgroundColor: color }]}>
      <Text style={styles.bookingAvatarText}>{initial}</Text>
    </View>
    <View style={styles.bookingInfo}>
      <Text style={styles.bookingName}>{name}</Text>
      <Text style={styles.bookingService}>{service}</Text>
    </View>
    <Text style={styles.bookingTime}>{time}</Text>
  </View>
);

const PartnerHomeScreen = () => {
  const { user } = useUserStore();

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primaryDark}
      />
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        {/* TOP HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <View style={styles.storeIconBox}>
              <Store size={22} color={theme.colors.white} />
            </View>
            <View>
              <Text style={styles.salonName}>Elite Salon & Spa</Text>
              <Text style={styles.dashboardSubtitle}>Partner Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigate('NotificationsScreen')}
            >
              <Bell size={20} color={theme.colors.white} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigate('SettingScreen')}
            >
              <Settings size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TOP ACTIONS */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigate('SchedulesScreen')}
          >
            <Calendar size={24} color={theme.colors.highlight} />
            <Text style={styles.actionBtnText}>Schedules</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigate('ManagePostsScreen')}
          >
            <Users size={24} color={theme.colors.highlight} />
            <Text style={styles.actionBtnText}>Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigate('DashboardScreen')}
          >
            <BarChart3 size={24} color={theme.colors.highlight} />
            <Text style={styles.actionBtnText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* BOTTOM SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollInner}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.bottomSheet}>
          {/* STATS GRID */}
          <View style={styles.statsGrid}>
            <StatCard
              icon={<CalendarDays size={20} color="#3B82F6" />}
              value="12"
              label="Today's Bookings"
              change="8%"
              isPositive={true}
            />
            <StatCard
              icon={<Users size={20} color="#F59E0B" />}
              value="1,234"
              label="Total Customers"
              change="15%"
              isPositive={true}
            />
            <StatCard
              icon={<DollarSign size={20} color="#10B981" />}
              value="₹8,450"
              label="Revenue (Today)"
              change="12%"
              isPositive={true}
            />
            <StatCard
              icon={<TrendingUp size={20} color="#8B5CF6" />}
              value="4.8"
              label="Avg. Rating"
              change="0.2"
              isPositive={true}
            />
          </View>

          {/* UPCOMING BOOKINGS */}
          <View style={styles.upcomingSection}>
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingTitle}>Upcoming Bookings</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <BookingItem
              initial="D"
              name="Divyang Patel"
              service="Gold Facial • Chugli Aunty"
              time="2:00 PM"
              color="#F59E0B"
            />
            <BookingItem
              initial="P"
              name="Priya Sharma"
              service="Hair Styling • Meera Singh"
              time="3:30 PM"
              color="#F97316"
            />
            <BookingItem
              initial="R"
              name="Rahul Verma"
              service="Haircut • Stylist John"
              time="4:15 PM"
              color="#EAB308"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PartnerHomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
  },
  headerSafeArea: {
    backgroundColor: theme.colors.primaryDark,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeIconBox: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.highlight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeIconText: {
    fontSize: 20,
  },
  salonName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.white,
    marginBottom: 2,
  },
  dashboardSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.highlight,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionBtnText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.white,
    marginTop: 8,
  },
  contentScroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentScrollInner: {
    paddingBottom: 40,
  },
  bottomSheet: {
    padding: 20,
    paddingTop: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    ...theme.shadows.soft,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.xs,
  },
  statValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  upcomingSection: {
    marginTop: 32,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 20,
    ...theme.shadows.soft,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  upcomingTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.highlight,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 16,
  },
  bookingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingAvatarText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.white,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  bookingService: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  bookingTime: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.highlight,
  },
});
