import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const DUMMY_SERVICES = [
  {
    id: '1',
    name: 'Haircut',
    price: 199,
    salons: 43,
    image: 'https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: '2',
    name: 'Beard Trim',
    price: 99,
    salons: 58,
    image: 'https://images.unsplash.com/photo-1603899968034-1a56ca48d172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: '3',
    name: 'Facial',
    price: 499,
    salons: 20,
    image: 'https://images.unsplash.com/photo-1664549760921-2198b054a592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
];

const PopularServices = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Services</Text>
      <View style={styles.grid}>
        {DUMMY_SERVICES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>Starts ₹{item.price}</Text>
              <Text style={styles.salons}>{item.salons} salons</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PopularServices;

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
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '31%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
  },
  imageContainer: {
    width: '100%',
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  price: {
    fontSize: 13,
    color: '#D97706',
    fontFamily: theme.fonts.bold,
    marginBottom: 2,
  },
  salons: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
});
