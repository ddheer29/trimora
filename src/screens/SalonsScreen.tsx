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
  const { serviceCategory } = route.params;
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);

  const getSalons = async () => {
    try {
      setLoading(true);
      const response = await salonService.getSalonsByService(
        serviceCategory,
        28.535516,
        77.391026,
      );
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
      title={serviceCategory + ' Salons'}
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
