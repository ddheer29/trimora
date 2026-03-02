import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../../utils/Theme';

interface ServiceCardProps {
  icon?: string;
  image?: string;
  label: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, image, label }) => {
  const displayImage = icon || image || 'https://i.imgur.com/6VB8XG0.png';
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Image
          source={{ uri: displayImage }}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.soft,
    width: 100,
  },
  iconWrapper: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  icon: {
    width: 32,
    height: 32,
    backgroundColor: 'red',
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.primaryDark,
    textAlign: 'center',
  },
});
