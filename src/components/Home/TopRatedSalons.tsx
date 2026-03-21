import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';
import { navigate } from '@utils/NavigationUtil';
import ViewAllCard from '../Cards/ViewAllCard';

const TOP_SALONS = [
  { id: '1', name: 'Hair Masters', rating: '4.9', reviews: 120, location: 'Connaught Place' },
  { id: '2', name: 'Elite Salon', rating: '4.8', reviews: 304, location: 'Vasant Kunj' },
  { id: '3', name: 'Style Hub', rating: '4.7', reviews: 89, location: 'Hauz Khas' },
];

const TopRatedSalons = () => {
  const renderItem = ({ item }: { item: typeof TOP_SALONS[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>🏢</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Rated Salons</Text>
      </View>
      <FlatList
        data={TOP_SALONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <ViewAllCard 
            onPress={() => navigate('SalonsScreen')} 
            style={{ marginLeft: 8, height: 200 }} 
          />
        }
      />
    </View>
  );
};

export default TopRatedSalons;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    width: 200,
    marginRight: theme.spacing.md, // Spacing
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  cardContent: {
    padding: theme.spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.sm,
    marginRight: 4,
  },
  reviews: {
    color: theme.colors.textDisabled,
    fontSize: theme.fontSizes.xs,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  location: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});
