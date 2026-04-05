import theme from '@utils/Theme';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SNAP_INTERVAL = width - 16; // Perfectly snaps taking parent paddings into account
const ITEM_WIDTH = width - 32; // Ensures 16px total left/right padding relative to the device bounds
const GAP = 16;

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  salon: string;
}

const originalBanners: Banner[] = [
  {
    id: '1',
    title: 'Flat 20% OFF',
    subtitle: 'on All Hair Services',
    salon: 'Glow Hair Studio',
  },
  {
    id: '2',
    title: 'First Booking Offer',
    subtitle: '₹100 OFF',
    salon: 'Use Code: WELCOME100',
  },
  {
    id: '3',
    title: 'Keratin Treatment',
    subtitle: 'Save ₹500',
    salon: 'Limited Time Offer',
  },
];

// Replicate banners for infinite scroll effect
const banners: Banner[] = [
  ...originalBanners,
  ...originalBanners,
  ...originalBanners,
];

interface BannerItemProps {
  item: Banner;
  index: number;
  scrollX: SharedValue<number>;
}

const BannerItem = ({ item, index, scrollX }: BannerItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.bannerContainer, animatedStyle]}>
      <View style={styles.banner}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.salon}>{item.salon}</Text>
      </View>
    </Animated.View>
  );
};

const OfferCarousel = () => {
  const flatListRef = useRef<FlatList<Banner>>(null);
  const [activeIndex, setActiveIndex] = useState<number>(
    originalBanners.length,
  );
  const scrollX = useSharedValue(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;

      if (nextIndex >= banners.length - 1) {
        // Soft reset to middle set to maintain "infinite" feel
        nextIndex = originalBanners.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: false,
        });
        nextIndex += 1;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem: ListRenderItem<Banner> = ({ item, index }) => {
    return <BannerItem item={item} index={index} scrollX={scrollX} />;
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={banners}
        horizontal
        pagingEnabled={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 8, // Set precise 8px padding to align with the rest of the layout
        }}
        initialScrollIndex={originalBanners.length}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
        onMomentumScrollEnd={(
          event: NativeSyntheticEvent<NativeScrollEvent>,
        ) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SNAP_INTERVAL,
          );
          setActiveIndex(index);
        }}
      />

      <View style={styles.pagination}>
        {originalBanners.map((_, index) => {
          const normalizedIndex = activeIndex % originalBanners.length;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                normalizedIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default OfferCarousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  bannerContainer: {
    width: ITEM_WIDTH,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: GAP,
  },
  banner: {
    width: ITEM_WIDTH,
    height: 150,
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#6C4AB6',
    justifyContent: 'center',
    // shadowColor: '#6C4AB6',
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.3,
    // shadowRadius: 20,
    // elevation: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.extraBold,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  salon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: theme.fonts.semiBold,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6C4AB6',
    width: 16,
    height: 6,
    borderRadius: 3,
  },
});
