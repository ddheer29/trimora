import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const FeaturedSalons = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Featured Partner</Text>
      
      <TouchableOpacity style={styles.featuredCard}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>✨ Luxury Hair Lounge ✨</Text>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.titleRow}>
            <Text style={styles.salonName}>Luxury Hair Lounge</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Premium • Specialized Styling</Text>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FeaturedSalons;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: theme.fonts.semiBold,
    marginBottom: theme.spacing.sm,
  },
  featuredCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.accent, // Gold border for premium feel
    ...theme.shadows.medium,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.accent,
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    fontStyle: 'italic',
  },
  cardDetails: {
    padding: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  salonName: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    fontSize: 10,
    marginRight: 2,
  },
  ratingText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  bookButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  bookButtonText: {
    color: theme.colors.card,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.md,
  },
});
