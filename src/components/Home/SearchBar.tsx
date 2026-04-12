import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import theme from '../../utils/Theme';
import { navigate } from '../../utils/NavigationUtil';

const SearchBar = () => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={0.9}
    onPress={() => navigate('SearchScreen')}
  >
    <Search
      size={20}
      color="#94A3B8"
      style={styles.icon}
    />
    <Text style={styles.placeholder}>Search salons, services...</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 12,
  },
  placeholder: {
    color: '#94A3B8',
    fontSize: 15,
    fontFamily: theme.fonts.regular,
  },
});

export default SearchBar;
