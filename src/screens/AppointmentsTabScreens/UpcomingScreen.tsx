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

const UpcomingScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://i.imgur.com/GXoYrQy.jpg' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.serviceName}>Luxury Facial & Hair Spa</Text>
          <Text style={styles.datetime}>23 July, 2:30 PM</Text>
          <Text style={styles.inDays}>in 2 days</Text>
          <Text style={styles.price}>₹1800</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UpcomingScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  image: {
    width: 110,
    height: '100%',
  },
  details: {
    flex: 1,
    padding: theme.spacing.md,
  },
  serviceName: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  datetime: {
    marginTop: 4,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  inDays: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.highlight,
    marginVertical: 4,
  },
  price: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.md,
    color: theme.colors.primaryDark,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  viewButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  viewButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.body,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  editButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  editButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
});
