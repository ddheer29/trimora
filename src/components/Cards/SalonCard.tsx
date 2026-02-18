import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import theme from '../../utils/Theme';
import { navigate } from '../../utils/NavigationUtil';

const SalonCard = ({ _id, images, name, locationName, rating }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigate('SalonDetailsScreen', { salonId: _id })}
    >
      <Image
        source={{ uri: images?.[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoWrapper}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.locationRow}>
          <MaterialDesignIcons
            name="map-marker"
            size={14}
            color={theme.colors.primaryDark}
          />
          <Text style={styles.location} numberOfLines={1}>
            {locationName}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          <MaterialDesignIcons
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
