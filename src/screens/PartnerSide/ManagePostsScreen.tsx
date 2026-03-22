import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { navigate } from '@utils/NavigationUtil';
import {
  partnerPostService,
  PartnerPost,
} from '../../services/partnerPostService';
import TrendGalleryItem from '@components/Posts/TrendGalleryItem';
import { Feather } from '@react-native-vector-icons/feather';
import { useFocusEffect } from '@react-navigation/native';

const ManagePostsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<PartnerPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number, isRefreshing = false) => {
    if (loading || (!hasMore && !isRefreshing)) return;

    try {
      if (isRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await partnerPostService.getPartnerPosts(pageNum, 15);

      if (response.status === 'success') {
        const newPosts = response.data.posts || [];
        if (pageNum === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts(1, true);
    }, []),
  );

  const onRefresh = () => {
    setHasMore(true);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const renderItem = ({ item }: { item: PartnerPost }) => (
    <TrendGalleryItem
      item={{
        _id: item._id,
        mediaUrl: item.type === 'video' ? item.thumbnailUrl : item.mediaUrl,
        type: item.type,
      }}
      onPress={() => {
        // Maybe show detail or delete option
      }}
    />
  );

  return (
    <CommonContainer title="Manage Portfolio" hideHeader={false} noPadding>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Feather
                name="image"
                size={50}
                color={theme.colors.textDisabled}
              />
              <Text style={styles.emptyText}>
                No posts yet. Start building your portfolio!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator
                size="small"
                color={theme.colors.primaryDark}
              />
            </View>
          ) : null
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigate('CreatePostScreen')}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </CommonContainer>
  );
};

export default ManagePostsScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 20,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
});
