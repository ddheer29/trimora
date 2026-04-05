import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const TRENDING_SERVICES = [
  { id: '1', title: 'Haircut + Beard combo', trend: '🔥 Trending now' },
  { id: '2', title: 'Keratin Treatment', trend: '📈 Most booked this week' },
  { id: '3', title: 'Gold Facial', trend: '⭐ High rating' },
  { id: '4', title: 'Detan Cleanup', trend: '☀️ Summer special' },
];

const TrendingServices = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Trending in your area</Text>
      
      <View style={styles.grid}>
        {TRENDING_SERVICES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Text style={styles.trendText}>{item.trend}</Text>
            <Text style={styles.serviceTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TrendingServices;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.md,
  },
  grid: {
    gap: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm, // fallback for gap
  },
  trendText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.highlight, // Warm Amber
    fontFamily: theme.fonts.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textPrimary,
  },
});
