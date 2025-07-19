import React from 'react';
import { FlatList } from 'react-native';
import theme from '../../utils/Theme';
import {
  bookAgainData,
  highRatedSalons,
  nearbySalons,
  topStylistsInDelhi,
} from '../../utils/data';
import Section from './Section';
import SalonCard from '../Cards/SalonCard';
import ServiceCard from '../Cards/ServiceCard';
import StylistCard from '../Cards/StylistCard';

const NearbyScreen = () => {
  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Section
            title="New in Your Area"
            horizontal
            data={highRatedSalons}
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
