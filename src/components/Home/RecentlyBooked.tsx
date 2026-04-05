import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const RecentlyBooked = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.label}>Book again at</Text>
          <Text style={styles.salonName}>Glow Hair Studio</Text>
          <Text style={styles.lastVisit}>Last visit: Haircut</Text>
        </View>
        <TouchableOpacity style={styles.rebookButton}>
          <Text style={styles.rebookText}>Rebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentlyBooked;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary, // Highlight it with the Midnight Slate primary color
    ...theme.shadows.soft,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  salonName: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
  },
  lastVisit: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  rebookButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  rebookText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.sm,
  },
});
