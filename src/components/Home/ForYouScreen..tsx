import React from 'react';
import { FlatList } from 'react-native';
import theme from '../../utils/Theme';
import {
  bookAgainData,
  recommendedServicesData,
  trendingLooksData,
} from '../../utils/data';
import ServiceCard from '../../components/Cards/ServiceCard';
import Section from '../../components/Home/Section';

const ForYouScreen = () => (
  <FlatList
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
          data={recommendedServicesData}
          renderItem={ServiceCard}
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
);

export default ForYouScreen;
