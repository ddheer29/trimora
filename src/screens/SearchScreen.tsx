import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import theme from '../utils/Theme';
import { Search as SearchIcon, Filter, ChevronLeft } from 'lucide-react-native';
import CommonContainer from '../components/CommonContainer';
import { salonService } from '@/services/salonService';
import { Salon } from '@/types';
import SearchResultCard from '../components/Cards/SearchResultCard';
import { useNavigation } from '@react-navigation/native';
import SearchFilterBottomSheet from '../components/Search/SearchFilterBottomSheet';
import { TrueSheet } from '@lodev09/react-native-true-sheet';

const SearchScreen = () => {
  const navigation = useNavigation();
  const filterSheetRef = useRef<TrueSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    distance: '5 km',
    rating: 'All',
    services: ['All Services'],
    categories: ['All Categories'],
    priceRange: 'All',
    sortBy: 'Recommended',
  });

  const handleSearch = async (currentFilters = filters) => {
    try {
      setLoading(true);
      // Map filters to API parameters if needed
      const apiFilters: any = {};
      
      const response = await salonService.searchSalons(searchQuery, apiFilters);
      if (response.status === 'success') {
        setResults(response.data || []);
      }
    } catch (error) {
      console.log('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    handleSearch(newFilters);
  };

  const renderSalonItem = ({ item }: { item: Salon }) => (
    <SearchResultCard salon={item} onPress={() => {}} />
  );

  return (
    <CommonContainer
      hideHeader
      noPadding
      backgroundColor="#FFFFFF"
      statusBarBackgroundColor="#FFFFFF"
      statusBarColor="dark-content"
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            placeholder="Search salons, services..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            cursorColor="#0F172A"
          />
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.stickyFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => filterSheetRef.current?.present()}
          >
            <Filter size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chipButton}>
            <Text style={styles.chipText}>{filters.distance}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chipButton}>
            <Text style={styles.chipText}>{filters.sortBy}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results Header */}
      {results.length > 0 && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            Found <Text style={styles.boldText}>{results.length}</Text> salons near you
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0F172A"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => (item._id || item.id || Math.random().toString()).toString()}
          renderItem={renderSalonItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No salons found matching your search.</Text>
              </View>
            ) : null
          }
        />
      )}

      <SearchFilterBottomSheet 
        ref={filterSheetRef}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </CommonContainer>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 52,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: '#0F172A',
    paddingVertical: 0,
  },
  stickyFilterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    color: '#0F172A',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  boldText: {
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: theme.fonts.regular,
  },
});
