import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../utils/Theme';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <View style={styles.searchBar}>
    <View style={styles.inputWrapper}>
      <Icon name="search" size={26} color={theme.colors.primaryDark} />
      <TextInput
        value={searchQuery}
        style={styles.input}
        cursorColor={theme.colors.primaryDark}
        onChangeText={setSearchQuery}
        placeholder="Salon, service..."
      />
    </View>
    <TouchableOpacity>
      <Ionicons
        name="filter-outline"
        size={26}
        color={theme.colors.primaryDark}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: 12,
    ...theme.shadows.soft,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  input: {
    width: '100%',
    marginLeft: theme.spacing.sm,
  },
});

export default SearchBar;
