import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonContainer from '@components/CommonContainer';
import { Salon } from '@/types';
import { salonService } from '@/services/salonService';
import { useRoute } from '@react-navigation/native';
import SalonCard from '@components/Cards/SalonCard';
import { navigate } from '@utils/NavigationUtil';
import theme from '@utils/Theme';

const SalonsScreen = () => {
  const route = useRoute();
  const { serviceCategory } = (route.params as any) || {};
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);

  const getSalons = async () => {
    try {
      setLoading(true);
      let response;
      // Coordinates for Noida area as used in other parts of the app
      const lat = 28.535516;
      const lng = 77.391026;

      if (serviceCategory) {
        response = await salonService.getSalonsByService(
          serviceCategory,
          lat,
          lng,
        );
      } else {
        response = await salonService.getNearBySalons(lat, lng);
      }
      setSalons(response?.data?.salons || []);
    } catch (error) {
      console.log('🚀 -> getSalons -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalons();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={theme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <CommonContainer
      title={serviceCategory ? `${serviceCategory} Salons` : 'Salons Near You'}
      showBackButton={true}
      hideHeader={false}
    >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
