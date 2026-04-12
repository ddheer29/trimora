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
        <TouchableOpacity style={styles.rebookButton} activeOpacity={0.8}>
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
    marginTop: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    ...theme.shadows.soft,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  salonName: {
    fontSize: 19,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.bold,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  lastVisit: {
    fontSize: 13,
    color: '#475569',
    fontFamily: theme.fonts.medium,
  },
  rebookButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 99,
  },
  rebookText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
});
