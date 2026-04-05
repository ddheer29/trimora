import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Salon } from '@/types';
import theme from '@utils/Theme';


const { width } = Dimensions.get('window');
interface SalonCardProps {
  salon: Salon;
  onPress: () => void;
  salonCardStyle?: StyleProp<ViewStyle>;
}

const SalonCard = ({ salon, onPress, salonCardStyle }: SalonCardProps) => {
  return (
    <TouchableOpacity
      key={salon._id}
      style={[styles.card, salonCardStyle]}
      onPress={onPress}
    >
      <Image source={{ uri: salon.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{salon.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.rating}>{salon.rating}</Text>
          <Text style={styles.review}>{salon.totalReviews}</Text>
        </View>
        <Text style={styles.distance}>📍 {salon.distance} away</Text>
        <Text style={styles.price}>Starting: ₹{salon.averagePrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SalonCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 14,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    padding: 12,
  },

  name: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    marginBottom: 4,
  },

  rating: {
    fontSize: 14,
    marginBottom: 4,
  },

  review: {
    color: '#777',
  },

  distance: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: '#111',
  },
});
