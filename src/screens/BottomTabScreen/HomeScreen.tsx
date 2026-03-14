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
import HairSVG from '@assets/svg/HairSVG';
import BeardSVG from '@assets/svg/BeardSVG';
import SkinSVG from '@assets/svg/SkinSVG';
import WaxingSVG from '@assets/svg/WaxingSVG';
import NailsSVG from '@assets/svg/NailsSVG';
import MassageSVG from '@assets/svg/MassageSVG';
import { salonService } from '@/services/salonService';
import { Salon } from '@/types';
import OfferCarousel from '@components/OfferCarousel';
import { navigate } from '@utils/NavigationUtil';
import SalonCard from '@components/Cards/SalonCard';

const categories = [
  { name: 'Hair', Icon: HairSVG, _id: '1' },
  { name: 'Beard', Icon: BeardSVG, _id: '2' },
  { name: 'Skin', Icon: SkinSVG, _id: '3' },
  { name: 'Waxing', Icon: WaxingSVG, _id: '4' },
  { name: 'Nails', Icon: NailsSVG, _id: '5' },
  { name: 'Massage', Icon: MassageSVG, _id: '6' },
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
      <View style={{ flex: 1 }}>
        <SearchBar />

        {/* Offers banner */}
        <OfferCarousel />

        <View
          style={{
            alignItems: 'center',
          }}
        >
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigate('SalonsScreen', { serviceCategory: item?.name })
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 8,
                  gap: 4,
                  borderWidth: 0.5,
                  borderColor: '#ece7e7ff',
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <item.Icon width={40} height={40} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Near by Salons */}
        <View style={{ marginVertical: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: theme.colors.textPrimary,
              marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            Salons Near You
          </Text>
        </View>

        <ScrollView
          style={{ flexGrow: 1 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row' }}>
            {nearBySalons?.map((salon: Salon) => (
              <SalonCard
                salon={salon}
                onPress={() => onPressNearBySalonCard(salon._id)}
                salonCardStyle={styles.nearbySalonCard}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </CommonContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  nearbySalonCard: {
    width: width * 0.75,
  },
});
