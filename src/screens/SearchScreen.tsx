// SearchScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import theme from '../utils/Theme';
import { Feather } from '@react-native-vector-icons/feather';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import CommonContainer from '../components/CommonContainer';
import { navigate } from '../utils/NavigationUtil';
import { salonService } from '@/services/salonService';
import { Salon } from '@/types';
import SalonCard from '../components/Cards/SalonCard';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';

const genderOptions = ['Unisex', 'Female', 'Male'];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [distance, setDistance] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;

  const handleResetFilters = () => {
    setSelectedGender(null);
    setDistance('');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedGender) filters.gender = selectedGender.toLowerCase();
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      // distance is not directly supported by search API, usually handled by lat/lng if nearby

      const response = await salonService.searchSalons(searchQuery, filters);
      if (response.status === 'success') {
        setResults(response.data || []);
      }
    } catch (error) {
      console.log('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSalonItem = ({ item }: { item: Salon }) => (
    <View style={{ marginBottom: theme.spacing.md }}>
      <SalonCard
        _id={item._id}
        name={item.name}
        images={item.images}
        locationName={item.locationName}
        rating={item.rating}
      />
    </View>
  );

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -12,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 300);
  }, []);

  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      headerStyle={{ borderBottomWidth: 0 }}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.inputWrapper}>
          <Feather
            name="search"
            size={20}
            color={theme.colors.primaryDark}
            style={styles.icon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Search for salon, service..."
            placeholderTextColor={theme.colors.textPrimary}
            style={styles.input}
            cursorColor={theme.colors.primaryDark}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterIconWrapper}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons
            name="filter-outline"
            size={22}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primaryDark} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => (item._id || item.id || Math.random().toString()).toString()}
          renderItem={renderSalonItem}
          contentContainerStyle={{ padding: theme.spacing.md }}
          ListEmptyComponent={
            searchQuery ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }}>
                No salons found matching your search.
              </Text>
            ) : null
          }
        />
      )}

      <Modal
        visible={showFilter}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Results</Text>

            {/* Distance */}
            <Text style={styles.label}>Distance (in km)</Text>
            <TextInput
              placeholder="e.g. 5"
              keyboardType="numeric"
              value={distance}
              onChangeText={setDistance}
              placeholderTextColor={theme.colors.textDisabled}
              style={styles.inputField}
            />

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderOption,
                    selectedGender === g && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedGender(g)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedGender === g && styles.genderTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <Text style={styles.label}>Price Range</Text>
            <View style={styles.priceRow}>
              <TextInput
                placeholder="Min"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                style={[styles.inputField, { flex: 1, marginRight: 8 }]}
                placeholderTextColor={theme.colors.textDisabled}
              />
              <TextInput
                placeholder="Max"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                style={[styles.inputField, { flex: 1 }]}
                placeholderTextColor={theme.colors.textDisabled}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.applyButton]}
                onPress={() => {
                  setShowFilter(false);
                  handleSearch();
                }}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CommonContainer>
  );
};

export default SearchScreen;

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
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    paddingVertical: 2,
  },
  filterIconWrapper: {
    marginLeft: theme.spacing.md,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  modalTitle: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  inputField: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: theme.colors.primaryDark,
  },
  genderText: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  genderTextSelected: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.subheading,
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.sm,
  },
  applyButton: {
    backgroundColor: theme.colors.primaryDark,
    marginLeft: theme.spacing.sm,
  },
  resetText: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  applyText: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.textOnPrimary,
  },
});
