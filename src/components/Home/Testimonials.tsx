import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import theme from '@utils/Theme';

const TESTIMONIALS = [
  {
    text: 'Great haircut experience from start to finish. Highly recommended!',
    author: 'Rahul M.',
    service: 'for Haircut',
    rating: 5
  },
  {
    text: 'Very professional staff and relaxing environment. Will visit again.',
    author: 'Aarav S.',
    service: 'for Facial',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What our customers say</Text>
      <View style={styles.list}>
        {TESTIMONIALS.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.stars}>
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.quote}>"{item.text}"</Text>
            <View style={styles.authorRow}>
              <Text style={styles.author}>– {item.author}</Text>
              <Text style={styles.service}>, {item.service}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Testimonials;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...theme.shadows.soft,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  quote: {
    fontSize: 14,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: theme.fonts.regular,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  author: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  service: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
});
