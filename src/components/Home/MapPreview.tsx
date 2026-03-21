import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@utils/Theme';

const MapPreview = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapMockup}>
        <View style={styles.pinContainer}>
          <Text style={styles.pin}>📍</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>View salons near you →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapPreview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.lg,
  },
  mapMockup: {
    backgroundColor: '#E2E8F0', // Light slate to mock a map background
    borderRadius: theme.borderRadius.lg,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 40, // push it up slightly
  },
  pin: {
    fontSize: 24,
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
    fontSize: theme.fontSizes.md,
  },
});
