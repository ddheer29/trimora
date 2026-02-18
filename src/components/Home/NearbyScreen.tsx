import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import theme from '../../utils/Theme';
import {
  bookAgainData,
  topStylistsInDelhi,
} from '../../utils/data';
import Section from './Section';
import SalonCard from '../Cards/SalonCard';
import ServiceCard from '../Cards/ServiceCard';
import StylistCard from '../Cards/StylistCard';
import { salonService } from '@/services/salonService';
import { locationService } from '@/services/locationService';

const NearbyScreen = () => {
  const [allSalons, setAllSalons] = useState([]);
  const [nearbySalons, setNearbySalons] = useState([]);

  const fetchAllSalons = async () => {
    try {
      const response = await salonService.getAllSalons();
      setAllSalons(response?.data || []);
    } catch (error) {
      console.log('🚀 -> fetchAllSalons -> error:', error);
    }
  };

  const fetchNearBySalons = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      const response = await salonService.getNearBySalons(location.latitude, location.longitude, 5);
      console.log("🚀 ~ fetchNearBySalons ~ response:", response)
      setNearbySalons(response?.data);
    } catch (error) {
      console.log("🚀 ~ fetchNearBySalons ~ error:", error)
    }
  }

  useEffect(() => {
    fetchAllSalons();
    fetchNearBySalons();
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Section
            title="New in Your Area"
            horizontal
            data={allSalons}
            renderItem={SalonCard}
          />
          <Section
            title="Salons Near You"
            horizontal
            data={nearbySalons}
            renderItem={SalonCard}
          />
          <Section
            title="Top Services"
            horizontal
            data={bookAgainData}
            renderItem={ServiceCard}
          />
          <Section
            title="Top Stylists"
            horizontal
            data={topStylistsInDelhi}
            renderItem={StylistCard}
          />
        </>
      }
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
    />
  );
};

export default NearbyScreen;
