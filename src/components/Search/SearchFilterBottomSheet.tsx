import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { X } from 'lucide-react-native';
import theme from '../../utils/Theme';

interface FilterState {
  distance: string;
  rating: string;
  services: string[];
  categories: string[];
  priceRange: string;
  sortBy: string;
}

const initialFilters: FilterState = {
  distance: '5 km',
  rating: 'All',
  services: ['All Services'],
  categories: ['All Categories'],
  priceRange: 'All',
  sortBy: 'Recommended',
};

interface SearchFilterBottomSheetProps {
  onApply: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

const SearchFilterBottomSheet = forwardRef<
  TrueSheet,
  SearchFilterBottomSheetProps
>(({ onApply, currentFilters }, ref) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(
    currentFilters || initialFilters,
  );

  const toggleMultiSelect = (key: 'services' | 'categories', value: string) => {
    setLocalFilters(prev => {
      const list = prev[key];
      const allKey = key === 'services' ? 'All Services' : 'All Categories';
      if (value === allKey) return { ...prev, [key]: [allKey] };
      const newList = list.includes(value)
        ? list.filter(item => item !== value)
        : [...list.filter(item => item !== allKey), value];
      return { ...prev, [key]: newList.length === 0 ? [allKey] : newList };
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    (ref as any)?.current?.dismiss();
  };

  const renderChip = (
    key: keyof FilterState,
    value: string,
    isMulti = false,
  ) => {
    const isSelected = isMulti
      ? (localFilters[key] as string[]).includes(value)
      : localFilters[key] === value;

    return (
      <TouchableOpacity
        key={value}
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => {
          if (isMulti) toggleMultiSelect(key as any, value);
          else setLocalFilters(p => ({ ...p, [key]: value }));
        }}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Filters</Text>
      <TouchableOpacity
        onPress={() => (ref as any)?.current?.dismiss()}
        style={styles.closeBtn}
      >
        <X size={20} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.clearBtn}
        onPress={() => setLocalFilters(initialFilters)}
      >
        <Text style={styles.clearBtnText}>Clear All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={styles.applyBtnText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TrueSheet
      ref={ref}
      detents={[0.6, 0.9]}
      scrollable={true}
      header={renderHeader()}
      footer={renderFooter()}
      cornerRadius={32}
      backgroundColor="#FFFFFF"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.chipGrid}>
            {['1 km', '3 km', '5 km', '10 km', '20 km'].map(v =>
              renderChip('distance', v),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating</Text>
          <View style={styles.chipGrid}>
            {['All', '4.5+', '4.0+', '3.5+'].map(v => renderChip('rating', v))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service</Text>
          <View style={styles.chipGrid}>
            {['All Services', 'Haircut', 'Beard Trim', 'Facial', 'Waxing'].map(
              v => renderChip('services', v, true),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipGrid}>
            {[
              'All Categories',
              'Hair',
              'Skin Care',
              'Nails',
              'Spa',
              'Massage',
            ].map(v => renderChip('categories', v, true))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.chipGrid}>
            {['All', 'Under ₹300', '₹300-600', 'Above ₹1000'].map(v =>
              renderChip('priceRange', v),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.chipGrid}>
            {[
              'Recommended',
              'Highest Rated',
              'Nearest',
              'Price: Low to High',
              'Price: High to Low',
            ].map(v => renderChip('sortBy', v))}
          </View>
        </View>
      </ScrollView>
    </TrueSheet>
  );
});

export default SearchFilterBottomSheet;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  chipSelected: {
    backgroundColor: '#0F172A',
  },
  chipText: {
    fontSize: 14,
    color: '#475569',
    fontFamily: theme.fonts.medium,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 16,
  },
  clearBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
  },
  applyBtn: {
    flex: 1.5,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
});
