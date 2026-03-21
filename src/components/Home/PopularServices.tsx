import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const DUMMY_SERVICES = [
  { id: '1', name: 'Haircut', price: 199, salons: 45, icon: '✂️' },
  { id: '2', name: 'Beard Trim', price: 99, salons: 38, icon: '🧔' },
  { id: '3', name: 'Facial', price: 499, salons: 20, icon: '💆‍♂️' },
  { id: '4', name: 'Hair Spa', price: 799, salons: 15, icon: '🧴' },
  { id: '5', name: 'Manicure', price: 299, salons: 12, icon: '💅' },
  { id: '6', name: 'Pedicure', price: 399, salons: 10, icon: '🦶' },
];

const PopularServices = () => {
  const renderItem = ({ item }: { item: typeof DUMMY_SERVICES[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Starts ₹{item.price}</Text>
      <Text style={styles.salons}>{item.salons} salons</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Services</Text>
      </View>
      <FlatList
        data={DUMMY_SERVICES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PopularServices;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
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
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    width: 130,
    marginRight: theme.spacing.sm, // Using marginRight instead of gap for older RN compat
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.accent,
    fontWeight: '600',
    marginBottom: 2,
  },
  salons: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textDisabled,
  },
});
