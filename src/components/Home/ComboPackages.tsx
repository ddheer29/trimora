import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const COMBOS = [
  { id: '1', title: 'Haircut + Beard Trim', price: 399, oldPrice: 549, save: 150 },
  { id: '2', title: 'Basic Cleanup + Massage', price: 699, oldPrice: 999, save: 300 },
  { id: '3', title: 'Keratin + Hair Spa', price: 1499, oldPrice: 1999, save: 500 },
];

const ComboPackages = () => {
  const renderItem = ({ item }: { item: typeof COMBOS[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.saveBadge}>
        <Text style={styles.saveText}>Save ₹{item.save}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Combo Packages</Text>
      </View>
      <FlatList
        data={COMBOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ComboPackages;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
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
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    width: 220,
    marginRight: theme.spacing.sm, // Spacing fallback
    ...theme.shadows.soft,
  },
  saveBadge: {
    backgroundColor: '#DEF7EC', // Soft green
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  saveText: {
    color: '#03543F', // Dark green text
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    height: 40, // fixed height for alignment
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  price: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginRight: 8,
  },
  oldPrice: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  addButton: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.accent,
    fontWeight: '600',
    fontSize: theme.fontSizes.sm,
  },
});
