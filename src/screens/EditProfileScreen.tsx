import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ScrollView,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import CustomAlert from '../components/CustomAlert';
import { useUserStore } from '@/store/userStore';
import { userService } from '@/services/userService';
import { goBack, resetAndNavigate } from '@utils/NavigationUtil';
import Toast from 'react-native-toast-message';

const dressTypes = ['Home', 'Work', 'Others'];

interface AlertOption {
  text: string;
  onPress: () => void;
  style?: 'cancel' | 'default' | 'destructive';
}

const EditProfileScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [selectedDressType, setSelectedDressType] = useState('');
  const [dob, setDob] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    options: [] as AlertOption[],
  });

  const { user, updateUser } = useUserStore();

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Pre-fill form with existing user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfileImage(user.profilePhoto || null);
      setAddress1(user.address || '');
      setDob(user.dob ? new Date(user.dob) : new Date());
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();

      if (response.data?.user) {
        const userData = response.data.user;
        updateUser(userData);
      }
    } catch (error: any) {
      console.log('Fetch profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load profile data',
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  const showCustomAlert = (title: string, message: string, options: any[]) => {
    setAlertConfig({ title, message, options });
    setAlertVisible(true);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return showCustomAlert(
        'Permission Denied',
        'Please grant camera and gallery permissions to continue.',
        [{ text: 'OK', onPress: () => setAlertVisible(false) }],
      );
    }

    showCustomAlert('Choose Option', 'Select image source', [
      {
        text: 'Camera',
        onPress: () => {
          setAlertVisible(false);
          launchCamera({ mediaType: 'photo', quality: 0.8 }, res => {
            if (!res.didCancel && !res.errorCode && res.assets?.[0]?.uri) {
              const imageUri = res.assets[0].uri;
              setProfileImage(imageUri || null);
            }
          });
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          setAlertVisible(false);
          launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
            if (!res.didCancel && !res.errorCode && res.assets?.[0]?.uri) {
              const imageUri = res.assets[0].uri;
              setProfileImage(imageUri || null);
            }
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => setAlertVisible(false),
      },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your name',
        topOffset: 60,
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append(
        'address',
        address1.trim() + (address2 ? ', ' + address2.trim() : ''),
      );
      formData.append('dob', dob.toISOString());

      if (profileImage && profileImage.startsWith('file://')) {
        const uriParts = profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('profilePhoto', {
          uri: profileImage,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      console.log('🚀 -> handleSaveProfile -> formData:', formData);
      const response = await userService.updateProfile(formData);
      console.log('🚀 -> handleSaveProfile -> response:', response);

      if (response.status === 'success' && response.data?.user) {
        const updatedUserData = response.data.user;
        updateUser(updatedUserData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
          topOffset: 60,
        });

        // Navigate based on role and profile completion status using the latest data
        if (updatedUserData.isProfileCompleted) {
          if (updatedUserData.role === 'partner') {
            resetAndNavigate('PartnerHomeScreen');
          } else {
            resetAndNavigate('MainTabs');
          }
        } else {
          goBack();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to update profile',
          topOffset: 60,
        });
      }
    } catch (error: any) {
      console.log('Update profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error.response?.data?.message ||
          'Failed to update profile. Please try again.',
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      headerStyle={{ borderBottomWidth: 0 }}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageContainer}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.image} />
          ) : user?.profilePhoto ? (
            <Image source={{ uri: user.profilePhoto }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
          {loading && (
            <View style={styles.imageOverlay}>
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Address Line 1"
          value={address1}
          onChangeText={setAddress1}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Address Line 2"
          value={address2}
          onChangeText={setAddress2}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!loading}
        />

        {/* Dress Type */}
        <Text style={styles.label}>Dress Type</Text>
        <View style={styles.dressTypeContainer}>
          {dressTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dressTypeButton,
                selectedDressType === type && styles.dressTypeSelected,
              ]}
              onPress={() => !loading && setSelectedDressType(type)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.dressTypeText,
                  selectedDressType === type && styles.dressTypeTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          onPress={() => !loading && setOpenDatePicker(true)}
          style={styles.input}
          disabled={loading}
        >
          <Text style={styles.dateText}>
            {dob ? new Date(dob).toDateString() : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={openDatePicker}
          date={dob}
          mode="date"
          maximumDate={new Date()}
          onConfirm={date => {
            setOpenDatePicker(false);
            setDob(date);
          }}
          onCancel={() => setOpenDatePicker(false)}
          theme="light"
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          options={alertConfig.options as any}
          onRequestClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </CommonContainer>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.body,
  },
  input: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
    ...theme.shadows.soft,
  },
  bioInput: {
    minHeight: 80,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  label: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  dressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  dressTypeButton: {
    flex: 1,
    marginHorizontal: theme.spacing.sm / 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  dressTypeSelected: {
    backgroundColor: theme.colors.primaryDark,
  },
  dressTypeText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  dressTypeTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  saveButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  saveButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
  },
});
