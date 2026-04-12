import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { debounce } from 'lodash';
import PostItem from '@components/Posts/PostItem';
import { screenHeight } from '../../utils/Scaling';
import theme from '../../utils/Theme';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation, useRoute } from '@react-navigation/native';

import { trendService } from '@/services/trendService';

const ReelsFeedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { initialIndex, data: initialData, salonId } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>(initialData || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(
    initialIndex || 0,
  );

  const fetchReels = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum !== 1)) return;

    try {
      setLoading(true);
      const response = await trendService.getReelsFeed(pageNum, 8, salonId);

      if (response.status === 'success') {
        const newPosts = response.data.posts || [];
        if (pageNum === 1 && !initialData) {
          setData(newPosts);
        } else {
          // Avoid duplicates if initialData was already provided
          const filteredNewPosts = newPosts.filter(
            (newPost: any) =>
              !data.some(existingPost => existingPost._id === newPost._id),
          );
          setData(prev => [...prev, ...filteredNewPosts]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.log('🚀 -> fetchReels -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchReels(page + 1);
    }
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    debounce(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems?.length > 0) {
        setCurrentVisibleIndex(viewableItems[0]?.index || 0);
      }
    }, 100),
  ).current;

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback(
    (item: any) => (item?._id || Math.random().toString()).toString(),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <PostItem item={item} isVisible={index === currentVisibleIndex} />
        )}
        windowSize={2}
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        initialScrollIndex={initialIndex}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
        decelerationRate={'normal'}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ReelsFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});
