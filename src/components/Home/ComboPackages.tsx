import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const COMBOS = [
  {
    id: '1',
    name: 'Haircut + Beard Trim',
    price: 399,
    originalPrice: 549,
    save: 150,
    image: 'https://images.unsplash.com/photo-1759134248487-e8baaf31e33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
  {
    id: '2',
    name: 'Basic Cleanup + Massage',
    price: 699,
    originalPrice: 999,
    save: 300,
    image: 'https://images.unsplash.com/photo-1768363446104-b8a0c1716600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
  },
];

const ComboPackages = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combo Packages</Text>
      <View style={styles.grid}>
        {COMBOS.map((combo) => (
          <View key={combo.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: combo.image }} style={styles.image} />
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save ₹{combo.save}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.comboName} numberOfLines={2}>{combo.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{combo.price}</Text>
                <Text style={styles.originalPrice}>₹{combo.originalPrice}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ComboPackages;

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
  saveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: theme.fonts.bold,
  },
  info: {
    padding: 12,
  },
  comboName: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  price: {
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontFamily: theme.fonts.regular,
  },
  addButton: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#D97706',
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },
});
