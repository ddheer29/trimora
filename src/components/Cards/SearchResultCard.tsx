import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MapPin, Star, Clock } from 'lucide-react-native';
import theme from '../../utils/Theme';
import { Salon } from '@/types';

const { width } = Dimensions.get('window');

interface SearchResultCardProps {
  salon: Salon;
  onPress: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ salon, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: salon.images?.[0] || 'https://i.imgur.com/GXoYrQy.jpg' }}
          style={styles.image}
        />
        <View style={styles.ratingBadge}>
          <Star size={14} color="#FACC15" fill="#FACC15" />
          <Text style={styles.ratingText}>
            {salon.rating} <Text style={styles.reviewText}>({salon.totalReviews})</Text>
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.content}>
        <Text style={styles.salonName}>{salon.name}</Text>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.distanceText}>{salon.distance || '0.8'} km</Text>
        </View>

        <Text style={styles.categoryText}>
          {salon.amenities?.slice(0, 3).join(', ') || 'Hair, Skin, Nails'}
        </Text>

        <Text style={styles.priceText}>
          ₹{salon.averagePrice || '300'} - {(salon.averagePrice || 300) * 2.5}
        </Text>

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.availabilityRow}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.availabilityText}>Today, 4:30 PM</Text>
          </View>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
    ...theme.shadows.soft,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
  },
  reviewText: {
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  content: {
    padding: 20,
  },
  salonName: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  distanceText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  categoryText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#D97706', // Warm amber/gold for price
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#475569',
    fontFamily: theme.fonts.regular,
  },
  bookButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
});
