import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Star, Sparkles } from 'lucide-react-native';
import theme from '../../utils/Theme';

const FeaturedPartner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Partner</Text>
      <View style={styles.card}>
        <LinearGradient
          colors={['#171717', '#262626', '#171717']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Sparkles size={20} color="#F59E0B" />
            <Text style={styles.headerTitle}>Luxury Hair Lounge</Text>
            <Sparkles size={20} color="#F59E0B" />
          </View>
        </LinearGradient>
        
        <View style={styles.body}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.salonName}>Luxury Hair Lounge</Text>
              <Text style={styles.specialization}>Premium • Specialized Styling</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton} activeOpacity={0.9}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.buttonGradient}
            >
              <Text style={styles.bookText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FeaturedPartner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: theme.fonts.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
  },
  header: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F59E0B',
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    letterSpacing: -0.5,
  },
  body: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  salonName: {
    fontSize: 19,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  specialization: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
});
