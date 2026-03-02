import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { screenHeight } from '../../utils/Scaling';

const PostItem = ({ item, isVisible }: { item: any; isVisible: boolean }) => {
  return (
    <View style={styles.container}>
      {item.mediaUrl ? (
        <Text style={styles.text}>{item.name || 'Post'}</Text>
      ) : (
        <Text style={styles.text}>No Media</Text>
      )}
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
  },
});
