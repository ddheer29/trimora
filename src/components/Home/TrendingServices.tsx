import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, TrendingUp, Star, Sparkles } from 'lucide-react-native';
import theme from '@utils/Theme';

const TRENDING_SERVICES = [
  { 
    id: '1', 
    name: 'Haircut + Beard combo', 
    badge: 'TRENDING NOW', 
    badgeColor: '#FEE2E2', 
    textColor: '#B91C1C',
    icon: Flame 
  },
  { 
    id: '2', 
    name: 'Keratin Treatment', 
    badge: 'MOST BOOKED THIS WEEK', 
    badgeColor: '#F3E8FF', 
    textColor: '#7E22CE',
    icon: TrendingUp 
  },
  { 
    id: '3', 
    name: 'Gold Facial', 
    badge: 'HIGH RATING', 
    badgeColor: '#FEF3C7', 
    textColor: '#B45309',
    icon: Star 
  },
  { 
    id: '4', 
    name: 'Detan Cleanup', 
    badge: 'SUMMER SPECIAL', 
    badgeColor: '#FFEDD5', 
    textColor: '#C2410C',
    icon: Sparkles 
  },
];

const TrendingServices = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending in your area</Text>
      <View style={styles.list}>
        {TRENDING_SERVICES.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.item, 
              index !== TRENDING_SERVICES.length - 1 && styles.borderBottom
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
              <item.icon size={12} color={item.textColor} />
              <Text style={[styles.badgeText, { color: item.textColor }]}>{item.badge}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
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
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  item: {
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
});
