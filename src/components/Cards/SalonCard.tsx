import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../../utils/Theme';
import { navigate } from '../../utils/NavigationUtil';

interface SalonCardProps {
  _id?: string;
  id?: string;
  images?: string[];
  image?: string;
  name: string;
  locationName?: string;
  location?: string;
  rating: string | number;
}

const SalonCard: React.FC<SalonCardProps> = ({ _id, id, images, image, name, locationName, location, rating }) => {
  const salonId = _id || id;
  const displayImage = (images && images.length > 0) ? images[0] : image;
  const displayLocation = locationName || location;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigate('SalonDetailsScreen', { salonId })}
    >
      <Image
        source={{ uri: displayImage || 'https://i.imgur.com/GXoYrQy.jpg' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoWrapper}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons
            name="location"
            size={14}
            color={theme.colors.primaryDark}
          />
          <Text style={styles.location} numberOfLines={1}>
            {locationName}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons
            name="star"
            size={14}
            color={theme.colors.success}
          />
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SalonCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    width: 180,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.soft,
  },
  image: {
    width: '100%',
    height: 110,
  },
  infoWrapper: {
    padding: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginLeft: 4,
    fontFamily: theme.fonts.body,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primaryDark,
    marginLeft: 4,
    fontFamily: theme.fonts.body,
  },
});
