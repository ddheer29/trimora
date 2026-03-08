import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { goBack } from '@utils/NavigationUtil';
import Toast from 'react-native-toast-message';
import { Stylist } from '@/types';

interface RouteParams {
  route: {
    params?: {
      stylist?: Stylist;
    };
  };
}

const AddEditStylistScreen = ({ route }: RouteParams) => {
  const isEditing = !!route.params?.stylist;
  const stylist = route.params?.stylist;

  const [name, setName] = useState(stylist?.name || '');
  const [experience, setExperience] = useState(
    stylist?.yearsOfExperience?.toString() || '',
  );
  const [image, setImage] = useState<string | null>(
    (stylist as any)?.stylistImage || null,
  );
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as any,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0].uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    if (!name.trim() || !experience.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('yearsOfExperience', experience.trim());

      if (image && !image.startsWith('http')) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('stylistImage', {
          uri: image,
          name: `stylist_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      let response;
      if (isEditing && stylist) {
        response = await salonService.updateStylist(stylist._id, formData);
      } else {
        response = await salonService.createStylist(formData);
      }

      if (response.success || (response as any).status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Stylist ${isEditing ? 'updated' : 'added'} successfully`,
        });
        goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to save stylist',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonContainer
      showBackButton
      title={isEditing ? 'Edit Stylist' : 'Add Stylist'}
      hideHeader={false}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Feather
                name="camera"
                size={30}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.placeholderText}>Upload Image</Text>
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Feather name="plus" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Doe"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            keyboardType="numeric"
            value={experience}
            onChangeText={setExperience}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading
              ? 'Saving...'
              : isEditing
              ? 'Update Stylist'
              : 'Add Stylist'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </CommonContainer>
  );
};

export default AddEditStylistScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    ...theme.shadows.medium,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.colors.primaryDark,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    marginBottom: 20,
    ...theme.shadows.soft,
  },
  saveButton: {
    backgroundColor: theme.colors.primaryDark,
    width: '100%',
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
  },
});
