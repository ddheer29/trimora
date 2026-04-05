import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CommonContainer from '@components/CommonContainer';
import SearchBar from '@components/Home/SearchBar';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { Salon } from '@/types';
import OfferCarousel from '@components/OfferCarousel';
import { navigate } from '@utils/NavigationUtil';
import SalonCard from '@components/Cards/SalonCard';
import ViewAllCard from '@components/Cards/ViewAllCard';

// 8 New UI Components
import RecentlyBooked from '@components/Home/RecentlyBooked';
import PopularServices from '@components/Home/PopularServices';
import TrendingServices from '@components/Home/TrendingServices';
import TopRatedSalons from '@components/Home/TopRatedSalons';
import FeaturedSalons from '@components/Home/FeaturedSalons';
import MapPreview from '@components/Home/MapPreview';
import ComboPackages from '@components/Home/ComboPackages';
import Testimonials from '@components/Home/Testimonials';

const categories = [
  { name: 'Hair', icon: '✂️', _id: '1' },
  { name: 'Beard', icon: '🧔🏻', _id: '2' },
  { name: 'Skin', icon: '✨', _id: '3' },
  { name: 'Waxing', icon: '🧴', _id: '4' },
  { name: 'Nails', icon: '💅', _id: '5' },
  { name: 'Massage', icon: '💆🏽‍♂️', _id: '6' },
];

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
    <CommonContainer scrollable>
      <View style={{ flex: 1, paddingBottom: theme.spacing.xl * 2 }}>
        <SearchBar />

        {/* Quick action for repeat customers */}
        <RecentlyBooked />

        {/* Offers banner */}
        <OfferCarousel />

        {/* Categories Block */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => navigate('SalonsScreen', { serviceCategory: item.name })}
                style={styles.categoryItem}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Near by Salons (Existing functionality) */}
        <View style={{ marginVertical: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.fontSizes.xl,
              fontFamily: theme.fonts.bold,
              color: theme.colors.primaryDark,
              marginHorizontal: theme.spacing.sm,
              marginBottom: theme.spacing.sm,
            }}
          >
            Salons Near You
          </Text>
          <ScrollView
            style={{ flexGrow: 1 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.sm }}
          >
            <View style={{ flexDirection: 'row' }}>
              {nearBySalons?.map((salon: Salon) => (
                <View key={salon._id} style={{ marginRight: theme.spacing.md }}>
                  <SalonCard
                    salon={salon}
                    onPress={() => onPressNearBySalonCard(salon._id)}
                    salonCardStyle={styles.nearbySalonCard}
                  />
                </View>
              ))}
              <ViewAllCard 
                onPress={() => navigate('SalonsScreen')} 
                style={{ marginLeft: 4, height: 255 }} 
              />
            </View>
          </ScrollView>
        </View>

        {/* 8 New UI Enhancements Flow */}
        <PopularServices />
        <FeaturedSalons />
        <MapPreview />
        <ComboPackages />
        <TrendingServices />
        <TopRatedSalons />

        {/* Social Proof at exactly the end */}
        <Testimonials />
      </View>
    </CommonContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  nearbySalonCard: {
    width: width * 0.85,
  },
  categoriesContainer: {
    marginVertical: theme.spacing.lg,
  },
  categoriesScroll: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 65,
    marginRight: theme.spacing.sm,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  categoryIcon: {
    fontSize: 26,
  },
  categoryText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});
