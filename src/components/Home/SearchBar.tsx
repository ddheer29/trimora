import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../utils/Theme';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <View style={styles.container}>
    <View style={styles.inputWrapper}>
      <Icon
        name="search"
        size={20}
        color={theme.colors.primaryDark}
        style={styles.icon}
      />
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for salon, service..."
        placeholderTextColor={theme.colors.textPrimary}
        style={styles.input}
        cursorColor={theme.colors.primaryDark}
      />
    </View>
    <TouchableOpacity style={styles.filterIconWrapper}>
      <Ionicons
        name="filter-outline"
        size={22}
        color={theme.colors.primaryDark}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingVertical: 2,
  },
  filterIconWrapper: {
    marginLeft: theme.spacing.md,
  },
});

export default SearchBar;
