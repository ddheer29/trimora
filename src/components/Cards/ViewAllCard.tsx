import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../../utils/Theme';

interface ViewAllCardProps {
  onPress: () => void;
  style?: ViewStyle;
}

const ViewAllCard = ({ onPress, style }: ViewAllCardProps) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons name="arrow-forward" size={24} color={theme.colors.textOnPrimary} />
      </View>
      <Text style={styles.text}>View All</Text>
    </TouchableOpacity>
  );
};

export default ViewAllCard;

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: '#F8FAFC', // Crisp, soft navigational slate
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryDark, // Midnight primary
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },
  text: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
