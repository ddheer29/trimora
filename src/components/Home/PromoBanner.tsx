import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import theme from '../../utils/Theme';

const PromoBanner = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#6D28D9', '#4C1D95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.subTitle}>First Booking</Text>
          <Text style={styles.title}>₹100 OFF</Text>
          <Text style={styles.codeText}>Use Code: WELCOME100</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Claim Offer</Text>
            <ChevronRight size={16} color="#4C1D95" />
          </TouchableOpacity>
        </View>

        {/* Decorative Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </LinearGradient>
    </View>
  );
};

export default PromoBanner;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  gradient: {
    padding: theme.spacing.lg,
    position: 'relative',
  },
  content: {
    zIndex: 1,
  },
  subTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  codeText: {
    color: '#DDD6FE',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: theme.fonts.medium,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  buttonText: {
    color: '#4C1D95',
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
  circle1: {
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    bottom: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
});
