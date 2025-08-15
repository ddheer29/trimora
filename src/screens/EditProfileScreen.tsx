import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import CustomAlert from '../components/CustomAlert';

const dressTypes = ['Home', 'Work', 'Others'];

const EditProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [selectedDressType, setSelectedDressType] = useState('');
  const [dob, setDob] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    options: [],
  });

  const showCustomAlert = (title, message, options) => {
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
              setProfileImage(res.assets[0].uri);
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
              setProfileImage(res.assets[0].uri);
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

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {
        if (
          !response.didCancel &&
          !response.errorCode &&
          response.assets?.[0]?.uri
        ) {
          setProfileImage(response.assets[0].uri);
        }
      },
    );
  };

  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      headerStyle={{ borderBottomWidth: 0 }}
      scrollable
    >
      {/* Profile Image */}
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Add Photo</Text>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.textDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme.colors.textDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor={theme.colors.textDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 1"
        value={address1}
        onChangeText={setAddress1}
        placeholderTextColor={theme.colors.textDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 2"
        value={address2}
        onChangeText={setAddress2}
        placeholderTextColor={theme.colors.textDisabled}
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
            onPress={() => setSelectedDressType(type)}
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
        onPress={() => setOpenDatePicker(true)}
        style={styles.input}
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
        textColor={theme.colors.textPrimary}
        fadeToColor={theme.colors.background}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        options={alertConfig.options}
        onRequestClose={() => setAlertVisible(false)}
      />
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
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  imagePlaceholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
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
  saveButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
  },
});
