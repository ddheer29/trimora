import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trendService, Comment } from '@/services/trendService';
import theme from '@/utils/Theme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { screenHeight } from '@/utils/Scaling';

dayjs.extend(relativeTime);

interface CommentBottomSheetProps {
  postId: string;
}

const CommentBottomSheet = forwardRef<TrueSheet, CommentBottomSheetProps>(
  ({ postId }, ref) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await trendService.getPostComments(postId);
        if (response.status === 'success') {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error('Fetch comments error:', error);
      } finally {
        setLoading(false);
      }
    };

    const handlePostComment = async () => {
      if (!text.trim() || isPosting) return;

      try {
        setIsPosting(true);
        const response = await trendService.addComment(postId, text);
        if (response.status === 'success') {
          setComments(prev => [response.data.comment, ...prev]);
          setText('');
          Keyboard.dismiss();
        }
      } catch (error) {
        console.error('Post comment error:', error);
      } finally {
        setIsPosting(false);
      }
    };

    const renderComment = ({ item }: { item: Comment }) => (
      <View style={styles.commentContainer}>
        <Image
          source={{
            uri: item.userId?.profilePhoto || 'https://via.placeholder.com/40',
          }}
          style={styles.avatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{item.userId?.name}</Text>
            <Text style={styles.timestamp}>
              {dayjs(item.createdAt).fromNow()}
            </Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
    );

    const renderFooter = () => (
      <View style={styles.footerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            onPress={handlePostComment}
            disabled={!text.trim() || isPosting}
            style={styles.sendButton}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color={theme.colors.accent} />
            ) : (
              <Ionicons
                name="send"
                size={24}
                color={
                  text.trim()
                    ? theme.colors.accent
                    : theme.colors.textSecondary
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <TrueSheet
        ref={ref}
        detents={['auto', 0.5, 0.9]}
        cornerRadius={24}
        backgroundColor={theme.colors.primary}
        onWillPresent={fetchComments}
        scrollable={true}
        footer={renderFooter()}
      >
        <View style={styles.sheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comments</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.accent}
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => item._id}
              renderItem={renderComment}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color={theme.colors.primaryLight}
                  />
                  <Text style={styles.emptyText}>
                    No comments yet. Be the first to comment!
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </TrueSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
    fontSize: 16,
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
    fontSize: 14,
    marginRight: 8,
  },
  timestamp: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
    fontSize: 12,
  },
  commentText: {
    color: '#eee',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    backgroundColor: theme.colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // Adjusted for footer prop
    backgroundColor: theme.colors.primaryDark,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginRight: 12,
  },
  sendButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default CommentBottomSheet;
