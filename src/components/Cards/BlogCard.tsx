import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../../utils/Theme';

const BlogCard = ({ image, title, excerpt }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: '' }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {excerpt}
        </Text>
      </View>
    </View>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.soft,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    backgroundColor: 'red',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  excerpt: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
