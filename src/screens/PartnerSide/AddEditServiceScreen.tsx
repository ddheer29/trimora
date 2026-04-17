import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { goBack } from '@utils/NavigationUtil';
import Toast from 'react-native-toast-message';
import { Service } from '@/types';

interface RouteParams {
  route: {
    params?: {
      service?: Service;
    };
  };
}

const AddEditServiceScreen = ({ route }: RouteParams) => {
  const isEditing = !!route.params?.service;
  const service = route.params?.service;

  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState(service?.category || '');
  const [subCategory, setSubCategory] = useState(service?.subCategory || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');
  const [duration, setDuration] = useState(service?.duration?.toString() || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unisex'>(
    service?.gender || 'Unisex',
  );
  const [description, setDescription] = useState(service?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !category.trim() || !price.trim() || !duration.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        category: category.trim(),
        subCategory: subCategory.trim(),
        price: parseFloat(price),
        duration: parseInt(duration),
        gender,
        description: description.trim(),
      };

      let response;
      if (isEditing && service) {
        response = await salonService.updateService(service._id, payload);
      } else {
        response = await salonService.createService(payload);
      }

      if (response.success || (response as any).status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Service ${isEditing ? 'updated' : 'added'} successfully`,
        });
        goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to save service',
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
      title={isEditing ? 'Edit Service' : 'Add Service'}
      hideHeader={false}
      backgroundColor="#FFFFFF"
      noPadding
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.form}>
            <Text style={styles.label}>Service Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Haircut & Style"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Category *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Hair"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
              <View style={{ width: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Sub-category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Styling"
                  value={subCategory}
                  onChangeText={setSubCategory}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="500"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={{ width: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Duration (Min) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>

            <Text style={styles.label}>Gender Specific</Text>
            <View style={styles.genderRow}>
              {(['Male', 'Female', 'Unisex'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderChip,
                    gender === g && styles.genderChipSelected,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === g && styles.genderTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell customers more about this service..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
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
                ? 'Update Service'
                : 'Add Service'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonContainer>
  );
};

export default AddEditServiceScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    flex: 1,
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
    borderWidth: 1,
    borderColor: '#f3f4f5ff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genderChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: '#f3f4f5ff',
    marginRight: 10,
  },
  genderChipSelected: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
  },
  genderText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
  },
  genderTextSelected: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
  },
  saveButton: {
    backgroundColor: theme.colors.primaryDark,
    width: '100%',
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
  },
});
