import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../../utils/Theme';
import { navigate } from '../../utils/NavigationUtil';

const SearchBar = () => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={0.9}
    onPress={() => navigate('SearchScreen')}
  >
    <View style={styles.inputWrapper}>
      <Feather
        name="search"
        size={20}
        color={theme.colors.textSecondary}
        style={styles.icon}
      />
      <View>
        <Text style={styles.searchTitle}>Where to?</Text>
        <Text style={styles.searchSubtitle}>Search salons, services...</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.filterIconWrapper}>
      <Ionicons
        name="options-outline" // More premium looking filter icon
        size={20}
        color={theme.colors.textOnPrimary}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.sm,
    paddingVertical: 10,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium, // Stronger elevation
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  searchTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  searchSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.xs,
  },
  filterIconWrapper: {
    backgroundColor: theme.colors.primaryDark,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;
