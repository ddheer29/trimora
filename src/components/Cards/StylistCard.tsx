import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../../utils/Theme';

const StylistCard = ({ avatar, name, specialty }) => {
  return (
    <View style={styles.card}>
      <Image source={avatar} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.specialty} numberOfLines={1}>
        {specialty}
      </Text>
    </View>
  );
};

export default StylistCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    ...theme.shadows.soft,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.primaryDark,
    textAlign: 'center',
  },
  specialty: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
