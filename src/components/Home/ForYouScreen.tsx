import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import theme from '../../utils/Theme';
import {
  bookAgainData,
  recommendedServicesData,
  trendingLooksData,
} from '../../utils/data';
import ServiceCard from '../../components/Cards/ServiceCard';
import Section from '../../components/Home/Section';
import SalonCard from '../Cards/SalonCard';
import { salonService } from '@/services/salonService';
import { locationService } from '@/services/locationService';
import { Salon, Location } from '@/types';

const ForYouScreen = () => {
  const [recommendedSalons, setRecommendedSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommended = async () => {
    try {
      setLoading(true);
      // Hardcoding location for debugging crash
      const location = { latitude: 28.6139, longitude: 77.2090 };

      const response = await salonService.getNearBySalons(
        location.latitude,
        location.longitude,
        50000,
        1,
        10
      );
      if (response.status === 'success') {
        setRecommendedSalons(response.data || []);
      }
    } catch (error) {
      console.log('🚀 -> fetchRecommended -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <Section
              title="Book Again"
              horizontal
              data={bookAgainData}
              renderItem={ServiceCard}
            />
            <Section
              title="Recommended for You"
              horizontal={false}
              data={recommendedSalons}
              renderItem={SalonCard}
            />
            <Section
              title="Trending Looks"
              horizontal
              data={trendingLooksData}
              renderItem={ServiceCard}
            />
            <Section
              title="Offers for You"
              horizontal
              data={recommendedServicesData}
              renderItem={ServiceCard}
            />
          </>
        }
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
      />
    </View>
  );
};

export default ForYouScreen;
