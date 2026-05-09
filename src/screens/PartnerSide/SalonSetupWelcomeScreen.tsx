import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  Users,
  Calendar,
  TrendingUp,
  Camera,
  Star,
  BarChart2,
  Shield,
  Zap,
  MapPin,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import theme from '@utils/Theme';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import { useUserStore } from '@/store/userStore';
import { salonService } from '@/services/salonService';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, stat, statLabel }: any) => (
  <View style={styles.featureCard}>
    <LinearGradient colors={['#F59E0B', '#EA580C']} style={styles.iconBox}>
      {icon}
    </LinearGradient>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{description}</Text>
    <View style={styles.divider} />
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{stat}</Text>
      <Text style={styles.statLabelText}>{statLabel}</Text>
    </View>
  </View>
);

const GridCard = ({ icon, title, desc }: any) => (
  <View style={styles.gridCard}>
    <View style={styles.gridIconBox}>{icon}</View>
    <Text style={styles.gridTitle}>{title}</Text>
    <Text style={styles.gridDesc}>{desc}</Text>
  </View>
);

const SalonSetupWelcomeScreen = () => {
  const { updateUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSalon();
  }, []);

  const checkExistingSalon = async () => {
    try {
      const response = await salonService.getPartnerSalon();
      if (
        response &&
        (response.status === 'success' || response.success) &&
        response.data
      ) {
        // Salon already exists, update store and move to dashboard
        // updateUser({ isProfileCompleted: true });
        // resetAndNavigate('PartnerHomeScreen');
      }
    } catch (error) {
      console.log('Error checking existing salon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.mainContainer, styles.loadingContainer]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primaryDark}
        />
        <Text style={styles.loadingText}>Checking salon status...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primaryDark}
        translucent={false}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.partnerBadge}>
            <Sparkles size={14} color={theme.colors.accent} />
            <Text style={styles.partnerBadgeText}>Partner with Trimora</Text>
          </View>

          <View style={styles.heroImagesContainer}>
            <View style={styles.imageColumnLeft}>
              <View style={styles.imageWrapperLeft}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
                  }}
                  style={styles.heroImage}
                />
              </View>
              <View style={styles.floatingBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.floatingBadgeText}>10K+ Bookings</Text>
              </View>
            </View>

            <View style={styles.imageWrapperRight}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1521590832167-7bfc17484d20?q=80&w=1000&auto=format&fit=crop',
                }}
                style={styles.heroImage}
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.heroTitle}>Transform Your</Text>
            <Text style={styles.heroTitle}>Salon Into a</Text>
            <Text style={[styles.heroTitle, styles.heroTitleHighlight]}>
              Thriving
            </Text>
            <Text style={[styles.heroTitle, styles.heroTitleHighlight]}>
              Business
            </Text>
          </View>

          <Text style={styles.heroSubtitle}>
            Join thousands of salon owners who have doubled their bookings and
            streamlined their operations with Trimora
          </Text>

          <TouchableOpacity
            onPress={() => navigate('SalonSetupFormScreen')}
            activeOpacity={0.8}
            style={styles.fullWidth}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.primaryButtonContent}>
                <Text style={styles.primaryButtonText}>Start Free Setup</Text>
                <ArrowRight
                  size={20}
                  color={theme.colors.white}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.miniFooter}>
            <Sparkles size={12} color={theme.colors.textDisabled} />
            <Text style={styles.miniFooterText}>
              Setup takes only 5 minutes • No credit card required
            </Text>
          </View>

          {/* Scroll Indicator */}
          {/* <View style={styles.scrollIndicatorContainer}>
            <Text style={styles.scrollIndicatorText}>Scroll to explore</Text>
            <View style={styles.scrollMouse}>
              <View style={styles.scrollWheel} />
            </View>
          </View> */}
        </View>

        {/* WHY CHOOSE TRIMORA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose{'\n'}Trimora?</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need to manage and grow your salon business
          </Text>

          {/* Cards */}
          <View style={styles.featuresList}>
            <FeatureCard
              icon={<Users size={24} color={theme.colors.white} />}
              title="Reach More Customers"
              description="Get discovered by thousands of customers looking for salon services near them"
              stat="10K+"
              statLabel="Active Users"
            />
            <FeatureCard
              icon={<Calendar size={24} color={theme.colors.white} />}
              title="Smart Booking System"
              description="Automated appointment scheduling that saves you time and reduces no-shows"
              stat="95%"
              statLabel="Booking Rate"
            />
            <FeatureCard
              icon={<TrendingUp size={24} color={theme.colors.white} />}
              title="Grow Your Business"
              description="Powerful analytics and insights to help you understand and grow your business"
              stat="3x"
              statLabel="Avg Growth"
            />
          </View>
        </View>

        {/* POWERFUL FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleSmall}>
            Powerful Features Built For You
          </Text>
          <View style={styles.gridContainer}>
            <GridCard
              icon={<Camera size={24} color={theme.colors.highlight} />}
              title="Beautiful Portfolio"
              desc="Showcase your work with stunning photo galleries"
            />
            <GridCard
              icon={<Star size={24} color={theme.colors.highlight} />}
              title="Reviews & Ratings"
              desc="Build trust with verified customer reviews"
            />
            <GridCard
              icon={<BarChart2 size={24} color={theme.colors.highlight} />}
              title="Business Analytics"
              desc="Track revenue, bookings, and customer trends"
            />
            <GridCard
              icon={<Shield size={24} color={theme.colors.highlight} />}
              title="Secure Payments"
              desc="Safe and instant payment processing"
            />
            <GridCard
              icon={<Zap size={24} color={theme.colors.highlight} />}
              title="Instant Notifications"
              desc="Get notified for every booking in real-time"
            />
            <GridCard
              icon={<MapPin size={24} color={theme.colors.highlight} />}
              title="Location Marketing"
              desc="Appear in local searches and maps"
            />
          </View>
        </View>

        {/* BOTTOM CTA */}
        <View style={styles.bottomCTAContainer}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.15)', 'rgba(15, 23, 42, 0.5)']}
            style={styles.bottomCTACard}
          >
            <Text style={styles.bottomCTATitle}>
              Ready to Grow{'\n'}Your Salon?
            </Text>
            <Text style={styles.bottomCTASubtitle}>
              Join the Trimora partner network today and start accepting
              bookings in minutes
            </Text>

            <TouchableOpacity
              onPress={() => navigate('SalonSetupFormScreen')}
              activeOpacity={0.8}
              style={styles.ctaButtonWrapper}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>
                    Build Your Salon Now
                  </Text>
                  <ArrowRight
                    size={20}
                    color={theme.colors.white}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.checksContainer}>
              <View style={styles.checkItem}>
                <Check size={14} color={theme.colors.success} />
                <Text style={styles.checkText}>Free to start</Text>
              </View>
              <View style={styles.checkItem}>
                <Check size={14} color={theme.colors.success} />
                <Text style={styles.checkText}>5-minute setup</Text>
              </View>
              <View style={styles.checkItem}>
                <Check size={14} color={theme.colors.success} />
                <Text style={styles.checkText}>No contracts</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SalonSetupWelcomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.textDisabled,
    fontSize: theme.fontSizes.md,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 40,
    gap: 6,
  },
  partnerBadgeText: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.sm,
  },
  heroImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
    width: '100%',
  },
  imageColumnLeft: {
    position: 'relative',
    transform: [{ translateY: -10 }],
    width: '45%',
  },
  imageWrapperLeft: {
    width: '100%',
    aspectRatio: 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageWrapperRight: {
    width: '45%',
    aspectRatio: 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    transform: [{ translateY: 10 }],
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 20,
    left: -16,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...theme.shadows.medium,
    zIndex: 10,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  floatingBadgeText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.sm,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    lineHeight: 46,
    color: theme.colors.white,
    textAlign: 'center',
  },
  heroTitleHighlight: {
    color: theme.colors.highlight,
  },
  heroSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textDisabled,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButtonGradient: {
    borderRadius: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.lg,
  },
  miniFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  miniFooterText: {
    color: theme.colors.textDisabled,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.xs,
  },
  scrollIndicatorContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  scrollIndicatorText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
  },
  scrollMouse: {
    width: 24,
    height: 36,
    borderWidth: 2,
    borderColor: theme.colors.textDisabled,
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: 4,
  },
  scrollWheel: {
    width: 4,
    height: 8,
    backgroundColor: theme.colors.highlight,
    borderRadius: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 60,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textDisabled,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: 8,
  },
  featureDesc: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'column',
    gap: 4,
  },
  statValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.highlight,
  },
  statLabelText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 4,
  },
  gridIconBox: {
    marginBottom: 16,
  },
  gridTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.white,
    marginBottom: 8,
  },
  gridDesc: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textDisabled,
    lineHeight: 18,
  },
  bottomCTAContainer: {
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  bottomCTACard: {
    borderRadius: 24,
    // paddingHorizontal: 20,
    paddingVertical: 32,
    // alignItems: 'center',
  },
  ctaButtonWrapper: {
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: 20,
  },
  bottomCTATitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    lineHeight: 38,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  bottomCTASubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textDisabled,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  checksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 12,
    columnGap: 16,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  checkText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
    marginLeft: 6,
  },
});
