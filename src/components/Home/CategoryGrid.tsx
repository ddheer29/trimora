import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Scissors,
  User,
  Sparkles,
  Waves,
  Paintbrush,
  Flower,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../utils/Theme';
import { navigate } from '../../utils/NavigationUtil';

const categories = [
  { icon: Scissors, label: 'Hair', color: ['#F3E8FF', '#E9D5FF'] }, // Purple
  { icon: User, label: 'Beard', color: ['#DBEAFE', '#BFDBFE'] }, // Blue
  { icon: Sparkles, label: 'Skin', color: ['#FCE7F3', '#FBCFE8'] }, // Pink
  { icon: Waves, label: 'Waxing', color: ['#FEF3C7', '#FDE68A'] }, // Amber
  { icon: Paintbrush, label: 'Nails', color: ['#DCFCE7', '#BBF7D0'] }, // Green
  { icon: Flower, label: 'Massage', color: ['#FFEDD5', '#FED7AA'] }, // Orange
];

const CategoryGrid = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(item => (
        <TouchableOpacity
          key={item.label}
          style={styles.item}
          onPress={() =>
            navigate('SalonsScreen', { serviceCategory: item.label })
          }
          activeOpacity={0.8}
        >
          <LinearGradient colors={item.color} style={styles.iconContainer}>
            <item.icon
              size={24}
              color={theme.colors.textPrimary}
              strokeWidth={2}
            />
          </LinearGradient>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryGrid;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
    marginBottom: 2,
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    width: 85,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
  },
});
