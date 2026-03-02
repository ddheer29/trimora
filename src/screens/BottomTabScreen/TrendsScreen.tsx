/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import { debounce } from 'lodash';
import CommonContainer from '../../components/CommonContainer';
import PostItem from '@components/Posts/PostItem';
import { screenHeight } from '../../utils/Scaling';
import theme from '../../utils/Theme';
import { trendService } from '@/services/trendService';

const TrendsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  const fetchReels = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum !== 1)) return;

    try {
      setLoading(true);
      const response = await trendService.getReelsFeed(pageNum, 8);

      if (response.status === 'success') {
        const newData = response.data || [];
        if (pageNum === 1) {
          setData(newData);
        } else {
          setData(prev => [...prev, ...newData]);
        }

        setHasMore(newData.length === 8);
        setPage(pageNum);
      }
    } catch (error) {
      console.log('🚀 -> fetchReels -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels(1);
  }, []);

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

  const keyExtractor = useCallback((item: any) => (item?._id || Math.random().toString()).toString(), []);

  return (
    <CommonContainer>
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <PostItem
            item={item}
            isVisible={index === currentVisibleIndex}
          />
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
    </CommonContainer>
  );
};

export default TrendsScreen;

const styles = StyleSheet.create({
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
