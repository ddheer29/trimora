import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Menu, MapPin, ChevronRight } from 'lucide-react-native';
import CommonContainer from '@components/CommonContainer';
import SearchBar from '@components/Home/SearchBar';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { Salon } from '@/types';
import { navigate } from '@utils/NavigationUtil';

// Updated/Redesigned Components
import RecentlyBooked from '@components/Home/RecentlyBooked';
import PopularServices from '@components/Home/PopularServices';
import TrendingServices from '@components/Home/TrendingServices';
import TopRatedSalons from '@components/Home/TopRatedSalons';
import FeaturedPartner from '@components/Home/FeaturedPartner';
import PromoBanner from '@components/Home/PromoBanner';
import CategoryGrid from '@components/Home/CategoryGrid';
import ComboPackages from '@components/Home/ComboPackages';
import Testimonials from '@components/Home/Testimonials';
import SalonCard from '@components/Cards/SalonCard';
import ViewAllCard from '@components/Cards/ViewAllCard';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [nearBySalons, setNearBySalons] = useState<Salon[]>([]);

  const getNearBySalons = async () => {
    try {
      const response = await salonService.getNearBySalons(
        28.6139,
        77.209,
        50000,
        1,
        10,
      );
      setNearBySalons(response?.data?.salons || []);
    } catch (error) {
      console.log('🚀 -> getNearBySalons -> error:', error);
    }
  };

  const onPressNearBySalonCard = (salonId: string) => {
    navigate('SalonDetailsScreen', { salonId });
  };

  useEffect(() => {
    getNearBySalons();
  }, []);

  return (
    <CommonContainer
      scrollable
      containerStyle={styles.container}
      noPadding
      statusBarBackgroundColor="#FFFFFF"
      backgroundColor="#FFFFFF"
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Trimora</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <SearchBar />
      </View>

      {/* Quick Rebook */}
      <RecentlyBooked />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Categories */}
      <CategoryGrid />

      {/* Popular Services */}
      <PopularServices />

      {/* Featured Partner */}
      <FeaturedPartner />

      {/* Salons Near You (Existing API Data) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Salons Near You</Text>
          <TouchableOpacity
            style={styles.viewAllRow}
            onPress={() => navigate('SalonsScreen')}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {nearBySalons?.slice(0, 3).map((salon: Salon) => (
            <View key={salon._id} style={styles.salonCardWrapper}>
              <SalonCard
                salon={salon}
                onPress={() => onPressNearBySalonCard(salon._id)}
                salonCardStyle={styles.nearbySalonCard}
              />
            </View>
          ))}
          {nearBySalons.length > 0 && (
            <ViewAllCard
              onPress={() => navigate('SalonsScreen')}
              style={styles.viewAllCard}
            />
          )}
        </ScrollView>
      </View>

      {/* Map CTA */}
      {/* <View style={styles.mapCtaContainer}>
        <TouchableOpacity
          style={styles.mapCta}
          activeOpacity={0.9}
          onPress={() => navigate('ExploreScreen')}
        >
          <View style={styles.mapIconCircle}>
            <MapPin size={28} color="#EF4444" />
          </View>
          <View style={styles.mapBtn}>
            <Text style={styles.mapBtnText}>View salons near you</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View> */}

      {/* Combo Packages */}
      <ComboPackages />

      {/* Trending Section */}
      <TrendingServices />

      {/* Top Rated Salons */}
      <TopRatedSalons />

      {/* Testimonials */}
      <Testimonials />

      {/* Padding for Bottom Tabs */}
      <View style={{ height: 100 }} />
    </CommonContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    letterSpacing: -1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    letterSpacing: -0.5,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: '#475569',
    fontFamily: theme.fonts.medium,
  },
  horizontalScroll: {
    paddingLeft: theme.spacing.sm,
    flexDirection: 'row',
  },
  salonCardWrapper: {
    marginBottom: 16,
  },
  nearbySalonCard: {
    width: width - 32,
  },
  viewAllCard: {
    width: width - 32,
    height: 250,
    marginBottom: 24,
  },
  mapCtaContainer: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: 24,
  },
  mapCta: {
    backgroundColor: '#EEF2FF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  mapBtn: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
});
