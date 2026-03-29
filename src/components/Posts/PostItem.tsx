import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Share,
} from 'react-native';
import React, { useState, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Feather from '@react-native-vector-icons/feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import { screenHeight } from '../../utils/Scaling';
import theme from '../../utils/Theme';
import { trendService } from '@/services/trendService';
import Video from 'react-native-video';
import { navigate } from '@/utils/NavigationUtil';
import CommentBottomSheet from './CommentBottomSheet';
import { TrueSheet } from '@lodev09/react-native-true-sheet';

interface PostItemProps {
  item: {
    _id: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    type: 'video' | 'photo';
    description?: string;
    tags?: string[];
    salonId: {
      _id: string;
      name: string;
      locationName?: string;
      images: string[];
    };
    likesCount: number;
    sharesCount: number;
    isLiked: boolean;
  };
  isVisible: boolean;
}

const PostItem = ({ item: initialItem, isVisible }: PostItemProps) => {
  const [item, setItem] = useState(initialItem);
  const [likeLoading, setLikeLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const sheetRef = useRef<TrueSheet>(null);

  const handleOpenComments = () => {
    sheetRef.current?.present();
  };

  const handleLike = async () => {
    if (likeLoading) return;
    try {
      setLikeLoading(true);
      const response = await trendService.likePost(item._id);
      if (response.status === 'success') {
        setItem(prev => ({
          ...prev,
          likesCount: response.data.likesCount,
          isLiked: response.data.isLiked,
        }));
      }
    } catch (error) {
      console.log('Like error:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing post from ${item.salonId.name}`,
        url: `https://trimora.dev/post/${item._id}`,
      });
      if (result.action === Share.sharedAction) {
        const response = await trendService.sharePost(item._id);
        if (response.status === 'success') {
          setItem(prev => ({
            ...prev,
            sharesCount: response.data.sharesCount,
          }));
        }
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const salonLogo =
    item.salonId.images?.[0] || 'https://via.placeholder.com/100';

  return (
    <View style={styles.container}>
      {item.type === 'video' ? (
        <>
          <Video
            source={{ uri: item.mediaUrl }}
            style={styles.backgroundImage}
            resizeMode="contain"
            repeat={true}
            paused={!isVisible}
            onLoad={() => setVideoLoading(false)}
            onBuffer={({ isBuffering }) => setVideoLoading(isBuffering)}
          />
          {videoLoading && (
            <View style={styles.videoLoadingContainer}>
              <Image
                source={{ uri: item.thumbnailUrl || item.mediaUrl }}
                style={styles.backgroundImage}
                resizeMode="contain"
              />
              <ActivityIndicator
                size="large"
                color={theme.colors.accent}
                style={styles.loader}
              />
            </View>
          )}
        </>
      ) : (
        <Image
          source={{ uri: item.mediaUrl }}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <View style={styles.overlay}>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.salonInfo}
            onPress={() =>
              navigate('SalonDetailsScreen', { salonId: item.salonId._id })
            }
          >
            <Image source={{ uri: salonLogo }} style={styles.salonLogo} />
            <View>
              <Text style={styles.salonName}>{item.salonId.name}</Text>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={12} color="#ccc" />
                <Text style={styles.locationText}>
                  {item.salonId.locationName || 'Location'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          {item.tags && item.tags.length > 0 && (
            <Text style={styles.tagsText}>
              {item.tags.map(tag => `#${tag}`).join(' ')}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            disabled={likeLoading}
          >
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={30}
              color={item.isLiked ? theme.colors.error : '#fff'}
            />
            <Text style={styles.actionText}>{item.likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenComments}
          >
            <Ionicons name="chatbubble-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>Comments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Feather name="share-2" size={26} color="#fff" />
            <Text style={styles.actionText}>{item.sharesCount || 'Share'}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.actionButton, styles.salonAvatarLink]}
            onPress={() =>
              navigate('SalonDetailsScreen', { salonId: item.salonId._id })
            }
          >
            <Image source={{ uri: salonLogo }} style={styles.sidebarLogo} />
            <View style={styles.plusIcon}>
              <Feather name="plus" size={10} color="#fff" />
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
      <CommentBottomSheet ref={sheetRef} postId={item._id} />
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: '100%',
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight * 0.4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    flexDirection: 'row',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  salonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  salonLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
    marginRight: 10,
  },
  salonName: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#ccc',
    fontFamily: theme.fonts.body,
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    color: '#fff',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    marginBottom: 8,
  },
  tagsText: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.subheading,
    fontSize: 13,
    marginBottom: 20,
  },
  rightSection: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
    fontSize: 12,
    marginTop: 4,
  },
  sidebarLogo: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  salonAvatarLink: {
    marginTop: 10,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    padding: 2,
  },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
  },
});
