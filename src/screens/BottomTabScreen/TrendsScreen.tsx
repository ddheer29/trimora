/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import CommonContainer from '../../components/CommonContainer';
import theme from '../../utils/Theme';
import { trendService } from '@/services/trendService';
import TrendGalleryItem from '@components/Posts/TrendGalleryItem';
import Ionicons from '@react-native-vector-icons/ionicons';

const TrendsScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const searchTimeout = useRef<any>(null);

  const fetchTrends = async (pageNum: number, query: string = searchText) => {
    if (loading || (!hasMore && pageNum !== 1)) return;

    try {
      setLoading(true);
      const response = await trendService.getGalleryFeed(pageNum, 30, undefined, query);

      if (response.status === 'success') {
        const newPosts = response.data.posts || [];
        if (pageNum === 1) {
          setData(newPosts);
        } else {
          setData(prev => [...prev, ...newPosts]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.log('🚀 -> fetchTrends -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(1, '');
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchTrends(1, searchText);
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTrends(page + 1);
    }
  };

  const openReel = (index: number) => {
    navigation.navigate('ReelsFeedScreen', {
      initialIndex: index,
      data: data,
    });
  };

  const keyExtractor = useCallback(
    (item: any) => (item?._id || Math.random().toString()).toString(),
    [],
  );

  return (
    <CommonContainer noPadding>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trends, tags..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color="#94A3B8"
              onPress={() => setSearchText('')}
            />
          )}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TrendGalleryItem
            item={{
              _id: item._id,
              mediaUrl:
                item.type === 'video'
                  ? item.thumbnailUrl || item.mediaUrl
                  : item.mediaUrl,
              type: item.type,
            }}
            onPress={() => openReel(index)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={theme.colors.accent} />
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No trends found.</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </CommonContainer>
  );
};

export default TrendsScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Light Slate 100
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Border color
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 0,
  },
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#94A3B8',
    fontFamily: theme.fonts.body,
    fontSize: 16,
  },
});
