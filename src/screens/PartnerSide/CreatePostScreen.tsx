import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { Feather } from '@react-native-vector-icons/feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { partnerPostService } from '../../services/partnerPostService';
import { goBack } from '@utils/NavigationUtil';
import Toast from 'react-native-toast-message';

const CreatePostScreen = () => {
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [media, setMedia] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const pickMedia = async () => {
    const result = await launchImageLibrary({
      mediaType: type === 'photo' ? 'photo' : 'video',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setMedia(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!media) {
      Toast.show({
        type: 'error',
        text1: 'Media Required',
        text2: 'Please select a photo or video to upload.',
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('type', type);
      formData.append('description', description);
      formData.append('tags', tags);

      formData.append('media', {
        uri:
          Platform.OS === 'android'
            ? media.uri
            : media.uri.replace('file://', ''),
        type: media.type,
        name:
          media.fileName || `upload_${Date.now()}.${media.type.split('/')[1]}`,
      } as any);

      const response = await partnerPostService.createPost(formData);

      if (response.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Post Created',
          text2: 'Your post has been uploaded successfully.',
        });
        goBack();
      }
    } catch (error) {
      console.log('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Something went wrong while uploading your post.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonContainer
      title="Create Post"
      hideHeader={false}
      showBackButton={true}
      noPadding
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'photo' && styles.activeType]}
              onPress={() => {
                setType('photo');
                setMedia(null);
              }}
            >
              <Feather
                name="image"
                size={20}
                color={type === 'photo' ? '#fff' : theme.colors.textPrimary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'photo' && styles.activeTypeText,
                ]}
              >
                Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'video' && styles.activeType]}
              onPress={() => {
                setType('video');
                setMedia(null);
              }}
            >
              <Feather
                name="video"
                size={20}
                color={type === 'video' ? '#fff' : theme.colors.textPrimary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'video' && styles.activeTypeText,
                ]}
              >
                Video
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mediaPlaceholder} onPress={pickMedia}>
            {media ? (
              type === 'photo' ? (
                <Image source={{ uri: media.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.videoPreviewContainer}>
                  <Feather name="video" size={50} color={theme.colors.primaryDark} />
                  <Text style={styles.videoNameText} numberOfLines={1}>
                    {media.fileName || 'Video Selected'}
                  </Text>
                  <Text style={styles.videoSizeText}>
                    {(media.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </View>
              )
            ) : (
              <View style={styles.placeholderContent}>
                <Feather
                  name="plus-circle"
                  size={40}
                  color={theme.colors.textDisabled}
                />
                <Text style={styles.placeholderText}>
                  Select {type === 'photo' ? 'Photo' : 'Video'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What's this post about?"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. stylish, haircut, gold"
              value={tags}
              onChangeText={setTags}
            />
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.disabledButton]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Post</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonContainer>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeType: {
    backgroundColor: theme.colors.primaryDark,
  },
  typeText: {
    marginLeft: 8,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  activeTypeText: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
  },
  mediaPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textDisabled,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  videoNameText: {
    marginTop: 15,
    fontFamily: theme.fonts.heading,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  videoSizeText: {
    marginTop: 5,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: theme.fonts.heading,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: theme.fonts.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    fontFamily: theme.fonts.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  uploadButton: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
});
