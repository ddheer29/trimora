import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import theme from '@utils/Theme';

const TOP_SALONS = [
  {
    id: '1',
    name: 'Hair Masters',
    location: 'Connaught Place',
    rating: 4.9,
    reviews: 370,
    image: 'https://images.unsplash.com/photo-1759142235060-3191ee596c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: '2',
    name: 'Elite Salon',
    location: 'Vasant Kunj',
    rating: 4.8,
    reviews: 285,
    image: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
];

const TopRatedSalons = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Rated Salons</Text>
      <View style={styles.grid}>
        {TOP_SALONS.map((salon) => (
          <TouchableOpacity key={salon.id} style={styles.card} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: salon.image }} style={styles.image} />
              <View style={styles.ratingBadge}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{salon.rating}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{salon.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#64748B" />
                <Text style={styles.location} numberOfLines={1}>{salon.location}</Text>
              </View>
              <Text style={styles.reviews}>{salon.reviews} reviews</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TopRatedSalons;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '48.5%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
    flex: 1,
  },
  reviews: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: theme.fonts.regular,
  },
});
