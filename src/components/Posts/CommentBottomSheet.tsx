import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import theme from '../../utils/Theme';
import { trendService } from '@/services/trendService';
import Feather from '@react-native-vector-icons/feather';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface CommentBottomSheetProps {
  postId: string;
}

const CommentBottomSheet = forwardRef<BottomSheetModal, CommentBottomSheetProps>(
  ({ postId }, ref) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [sending, setSending] = useState(false);

    const snapPoints = useMemo(() => ['50%', '80%'], []);

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await trendService.getPostComments(postId);
        if (response.status === 'success') {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.log('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (postId) {
        fetchComments();
      }
    }, [postId]);

    const handleSend = async () => {
      if (!commentText.trim() || sending) return;

      try {
        setSending(true);
        const response = await trendService.addComment(postId, commentText);
        if (response.status === 'success') {
          // Optimistically add to list or re-fetch
          const newComment = response.data.comment;
          setComments(prev => [newComment, ...prev]);
          setCommentText('');
          Keyboard.dismiss();
        }
      } catch (error) {
        console.log('Error adding comment:', error);
      } finally {
        setSending(false);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props}>
          <View style={styles.inputContainer}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!commentText.trim() || sending}
              style={[
                styles.sendButton,
                (!commentText.trim() || sending) && styles.sendButtonDisabled,
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetFooter>
      ),
      [commentText, sending, handleSend]
    );

    const renderComment = useCallback(({ item }: { item: any }) => {
      const user = item.customerId || item.salonId || {};
      const name = user.name || 'User';
      const image = user.images?.[0] || 'https://via.placeholder.com/100';

      return (
        <View style={styles.commentItem}>
          <Image source={{ uri: image }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.timeText}>
                {dayjs(item.createdAt).fromNow()}
              </Text>
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        </View>
      );
    }, []);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Comments</Text>
          {loading && comments.length === 0 ? (
            <ActivityIndicator
              color={theme.colors.accent}
              style={styles.loader}
            />
          ) : (
            <BottomSheetFlatList
              data={comments}
              keyExtractor={(item: any) => item._id}
              renderItem={renderComment}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No comments yet.</Text>
              }
            />
          )}
        </View>
      </BottomSheetModal>
    );
  }
);

export default CommentBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: theme.colors.primaryDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: '#666',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    marginBottom: 15,
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
    fontSize: 14,
  },
  timeText: {
    color: '#999',
    fontSize: 11,
    fontFamily: theme.fonts.body,
  },
  commentText: {
    color: '#ddd',
    fontSize: 14,
    fontFamily: theme.fonts.body,
    lineHeight: 18,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: theme.fonts.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: theme.colors.primaryDark,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#444',
  },
});
