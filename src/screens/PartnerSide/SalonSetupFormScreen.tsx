import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';
import { launchImageLibrary } from 'react-native-image-picker';
import { Feather } from '@react-native-vector-icons/feather';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { resetAndNavigate } from '@utils/NavigationUtil';
import { useUserStore } from '@/store/userStore';

const SalonSetupFormScreen = ({ route }: any) => {
  const isEdit = route?.params?.isEdit || false;
  const [currentStep, setCurrentStep] = useState(1);
  const { updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    images: [] as string[],
    locationName: '',
    location: {
      latitude: 28.6139,
      longitude: 77.209,
    },
    amenities: [] as string[],
    openingTime: '09:00',
    closingTime: '20:00',
    slotDuration: '30',
  });

  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchSalonData();
    }
  }, [isEdit]);

  const fetchSalonData = async () => {
    setLoading(true);
    try {
      const response = await salonService.getPartnerSalon();
      if (response.status === 'success' || response.success) {
        const salon = response.data;
        if (salon) {
          setFormData({
            name: salon.name || '',
            images: salon.images || [],
            locationName: salon.locationName || '',
            location: {
              latitude: salon.location?.coordinates?.[1] || 28.6139,
              longitude: salon.location?.coordinates?.[0] || 77.209,
            },
            amenities: salon.amenities || [],
            openingTime: salon.openingTime || '09:00',
            closingTime: salon.closingTime || '20:00',
            slotDuration: salon.slotDuration
              ? String(salon.slotDuration)
              : '30',
          });
        }
      }
    } catch (error) {
      console.log('Error fetching salon data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load existing salon details',
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter salon name',
      });
      return;
    }
    if (currentStep === 2 && formData.images.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please upload at least one image',
      });
      return;
    }
    if (currentStep === 3 && !formData.locationName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter location area name',
      });
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const pickImage = async () => {
    if (formData.images.length >= 10) {
      Toast.show({
        type: 'info',
        text1: 'Limit Reached',
        text2: 'You can only upload up to 10 images.',
      });
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as any,
      selectionLimit: 10 - formData.images.length,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const newImages = response.assets
          .map(asset => asset.uri)
          .filter(Boolean) as string[];
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 10),
        }));
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('locationName', formData.locationName.trim());

      // Formatting location as GeoJSON Point { type: "Point", coordinates: [lng, lat] }
      const geoJSONLocation = {
        type: 'Point',
        coordinates: [formData.location.longitude, formData.location.latitude],
      };
      formDataToSend.append('location', JSON.stringify(geoJSONLocation));

      formDataToSend.append('openingTime', formData.openingTime);
      formDataToSend.append('closingTime', formData.closingTime);
      formDataToSend.append('slotDuration', formData.slotDuration);

      // Amenities as JSON string
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));

      // Append images
      formData.images.forEach((uri, index) => {
        if (!uri.startsWith('http')) {
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1] || 'jpg';
          formDataToSend.append('images', {
            uri,
            name: `salon_image_${Date.now()}_${index}.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        }
      });

      let response;
      if (isEdit) {
        response = await salonService.updateSalon(formDataToSend);
      } else {
        response = await salonService.createSalon(formDataToSend);
      }
      console.log('🚀 -> handleSubmit -> response:', response);
      if (response.status === 'success' || response.success) {
        if (!isEdit) {
          updateUser({ isProfileCompleted: true });
        }
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: isEdit ? 'Salon details updated!' : 'Salon setup complete!',
        });
        resetAndNavigate('PartnerBottomTab');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to create salon',
        });
      }
    } catch (error: any) {
      console.log('Salon setup error:', error.response?.data?.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>What is your salon name?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Trendy Cuts"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              autoFocus
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Upload salon images (Max 10)</Text>
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Feather name="plus" size={24} color={theme.colors.primaryDark} />
              <Text style={styles.addImageText}>Add Images</Text>
            </TouchableOpacity>
            <FlatList
              data={formData.images}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              style={styles.imageList}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Where is your salon located?</Text>
            <TextInput
              style={styles.input}
              placeholder="Area Name (e.g. New Delhi)"
              value={formData.locationName}
              onChangeText={text =>
                setFormData({ ...formData, locationName: text })
              }
            />
            <Text style={styles.hint}>
              Drag the marker to pinpoint location
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  ...formData.location,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={formData.location}
                  draggable
                  onDragEnd={e =>
                    setFormData({
                      ...formData,
                      location: e.nativeEvent.coordinate,
                    })
                  }
                />
              </MapView>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Salon Amenities</Text>
            <View style={styles.amenityInputRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="e.g. AC, WiFi"
                value={newAmenity}
                onChangeText={setNewAmenity}
              />
              <TouchableOpacity style={styles.addButton} onPress={addAmenity}>
                <Feather name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.amenitiesList}>
              {formData.amenities.map((item, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeAmenity(index)}>
                    <Feather
                      name="x"
                      size={14}
                      color={theme.colors.primaryDark}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Opening & Closing Hours</Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Opens At</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  value={formData.openingTime}
                  onChangeText={text =>
                    setFormData({ ...formData, openingTime: text })
                  }
                />
              </View>
              <View style={{ width: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Closes At</Text>
                <TextInput
                  style={styles.input}
                  placeholder="20:00"
                  value={formData.closingTime}
                  onChangeText={text =>
                    setFormData({ ...formData, closingTime: text })
                  }
                />
              </View>
            </View>
            <Text style={styles.label}>Slot Duration (Minutes)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              keyboardType="numeric"
              value={formData.slotDuration}
              onChangeText={text =>
                setFormData({ ...formData, slotDuration: text })
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <CommonContainer
      showBackButton={isEdit}
      hideHeader={false}
      title={isEdit ? 'Edit Salon Details' : 'Salon Setup'}
      isTitleCentered={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step {currentStep} of 5</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressLine,
                { width: `${(currentStep / 5) * 100}%` },
              ]}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, loading && { opacity: 0.7 }]}
            onPress={nextStep}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {loading
                ? 'Submitting...'
                : currentStep === 5
                ? isEdit
                  ? 'Update Salon'
                  : 'Complete Setup'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CommonContainer>
  );
};

export default SalonSetupFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  stepIndicator: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressLine: {
    height: '100%',
    backgroundColor: theme.colors.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
  },
  label: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  smallLabel: {
    fontFamily: theme.fonts.subheading,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addImageText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.primaryDark,
    marginTop: theme.spacing.xs,
  },
  imageList: {
    marginVertical: theme.spacing.md,
  },
  imageWrapper: {
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  mapContainer: {
    height: 250,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  map: {
    flex: 1,
  },
  hint: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  amenityInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    backgroundColor: theme.colors.primaryDark,
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  amenityText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primaryDark,
    marginRight: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.heading,
  },
  nextButton: {
    flex: 2,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  nextButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.heading,
  },
});
