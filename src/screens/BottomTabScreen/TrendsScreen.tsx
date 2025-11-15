/* eslint-disable react/no-unstable-nested-components */
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import CommonContainer from '../../components/CommonContainer';
import PostItem from '@components/Posts/PostItem';
import { screenHeight } from '@utils/Scaling';
import theme from '@utils/Theme';
import { debounce } from 'lodash';

const TrendsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

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

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  return (
    <CommonContainer>
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={PostItem}
        windowSize={2}
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
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
