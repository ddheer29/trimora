import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import CommonContainer from '@components/CommonContainer';
import { Salon } from '@/types';
import { salonService } from '@/services/salonService';
import { useRoute } from '@react-navigation/native';
import SalonCard from '@components/Cards/SalonCard';
import { navigate } from '@utils/NavigationUtil';

const SalonsScreen = () => {
  const route = useRoute();
  const { serviceCategory } = route.params;
  const [salons, setSalons] = React.useState<Salon[]>([]);

  const getSalons = async () => {
    try {
      const response = await salonService.getSalonsByService(
        serviceCategory,
        28.535516,
        77.391026,
      );
      setSalons(response?.data?.salons || []);
    } catch (error) {
      console.log('🚀 -> getSalons -> error:', error);
    }
  };

  useEffect(() => {
    getSalons();
  }, []);

  return (
    <CommonContainer showBackButton={true} hideHeader={false}>
      <FlatList
        data={salons}
        renderItem={({ item, index }) => (
          <SalonCard
            salon={item}
            onPress={() => navigate('SalonDetails', { salonId: item._id })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </CommonContainer>
  );
};

export default SalonsScreen;

const styles = StyleSheet.create({});
