import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import theme from '@utils/Theme';

const REVIEWS = [
  { id: '1', name: 'Rahul M.', text: 'Great haircut experience from start to finish. Highly recommended!', rating: 5, service: 'Haircut' },
  { id: '2', name: 'Aarav S.', text: 'Very professional staff and clean environment.', rating: 5, service: 'Beard Trim' },
  { id: '3', name: 'Vikram K.', text: 'Loved the facial massage. Will definitely visit again.', rating: 4, service: 'Gold Facial' },
];

const Testimonials = () => {
  const renderItem = ({ item }: { item: typeof REVIEWS[0] }) => (
    <View style={styles.card}>
      <View style={styles.starsContainer}>
        {Array.from({ length: item.rating }).map((_, idx) => (
          <Text key={idx} style={styles.star}>⭐</Text>
        ))}
      </View>
      <Text style={styles.reviewText}>"{item.text}"</Text>
      <View style={styles.footer}>
        <Text style={styles.name}>– {item.name}</Text>
        <Text style={styles.service}>for {item.service}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>What our customers say</Text>
      <FlatList
        data={REVIEWS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Testimonials;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: '#F1F5F9', // Very light slate to separate it
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    width: 280,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  reviewText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    fontSize: theme.fontSizes.sm,
    marginRight: 4,
  },
  service: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
