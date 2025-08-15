import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import theme from '../../utils/Theme';

type Props = {
  imageUrl: string;
  name: string;
  location: string;
  rating: number;
  onPress: () => void;
};

export const SalonCard = ({
  imageUrl,
  name,
  location,
  rating,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {location}
        </Text>
        <Text style={styles.rating}>⭐ {rating.toFixed(1)} / 5</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const CompletedScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SalonCard
        imageUrl="https://example.com/salon.jpg"
        name="Blush & Bloom"
        location="Connaught Place, Delhi"
        rating={4.6}
        onPress={() => {}}
      />
    </ScrollView>
  );
};

export default CompletedScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  details: {
    alignItems: 'center',
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  rating: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textOnPrimary,
  },
});
