import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { screenWidth } from '../../utils/Scaling';

interface TrendGalleryItemProps {
  item: {
    _id: string;
    mediaUrl: string;
    type?: 'video' | 'photo';
  };
  onPress: () => void;
}

const TrendGalleryItem = ({ item, onPress }: TrendGalleryItemProps) => {
  const itemSize = (screenWidth - 4) / 3;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: itemSize, height: itemSize }]}>
      <Image
        source={{ uri: item.mediaUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <View style={styles.videoIcon}>
          <Feather name="play" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TrendGalleryItem;

const styles = StyleSheet.create({
  container: {
    margin: 0.5,
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    padding: 2,
  },
});
