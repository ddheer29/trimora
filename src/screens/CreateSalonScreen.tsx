import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import CommonContainer from '@components/CommonContainer';
import { salonService } from '@/services/salonService';
import { launchImageLibrary } from 'react-native-image-picker';
import theme from '@utils/Theme';

const CreateSalonScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    images: [],
    locationName: '',
    description: '',
    serviceCategories: [],
    stylists: [],
    location: {
      latitude: null,
      longitude: null,
    },
    contact: {
      phone: '',
      email: '',
      website: '',
    },
    amenities: [],
  });

  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    services: [],
  });

  const [currentService, setCurrentService] = useState({
    title: '',
    price: '',
    duration: '30',
    description: '',
    categoryIndex: null,
  });

  const [currentStylist, setCurrentStylist] = useState({
    name: '',
    profilePhoto: '',
    rating: '',
    specialization: [],
    experience: '',
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139, // Default to Delhi
    longitude: 77.209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Request location permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Camera Roll Permission',
            message: 'App needs access to your camera roll to select images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to set your salon location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Sorry, we need camera roll permissions to make this work!',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 0, // 0 means unlimited
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets) {
        const newImages = response.assets.map(asset => asset.uri);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    });
  };

  // Remove image
  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Render image item for FlatList
  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
      >
        <Feather name="x" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // Get current location using react-native-geolocation-service
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Location permission is required to access your current location.',
      );
      return;
    }

    setLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        setFormData(prev => ({
          ...prev,
          location: {
            latitude,
            longitude,
          },
        }));

        setLoading(false);
        Alert.alert('Success', 'Current location set!');
      },
      error => {
        setLoading(false);
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get current location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        Alert.alert('Error', errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // Handle map press to set location
  const handleMapPress = event => {
    const { coordinate } = event.nativeEvent;
    setFormData(prev => ({
      ...prev,
      location: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
    }));
  };

  // Confirm location selection
  const confirmLocation = () => {
    if (formData.location.latitude && formData.location.longitude) {
      setMapModalVisible(false);
      Alert.alert('Success', 'Location selected successfully!');
    } else {
      Alert.alert('Error', 'Please select a location on the map');
    }
  };

  // Add new category
  const addCategory = () => {
    if (!currentCategory.name) {
      Alert.alert('Error', 'Please enter category name');
      return;
    }

    const newCategory = {
      name: currentCategory.name,
      services: [],
      isActive: true,
    };

    setFormData(prev => ({
      ...prev,
      serviceCategories: [...prev.serviceCategories, newCategory],
    }));

    setCurrentCategory({
      name: '',
      services: [],
    });
    setCategoryModalVisible(false);
  };

  // Remove category
  const removeCategory = index => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.filter((_, i) => i !== index),
    }));
  };

  // Add service to category
  const addService = () => {
    if (!currentService.title || !currentService.price) {
      Alert.alert('Error', 'Please enter service title and price');
      return;
    }

    if (currentService.categoryIndex === null) {
      Alert.alert('Error', 'Please select a category first');
      return;
    }

    const newService = {
      id: Date.now().toString(),
      title: currentService.title,
      price: `₹${currentService.price.replace('₹', '')}`,
      duration: parseInt(currentService.duration) || 30,
      description: currentService.description,
    };

    const updatedCategories = [...formData.serviceCategories];
    updatedCategories[currentService.categoryIndex].services.push(newService);

    setFormData(prev => ({
      ...prev,
      serviceCategories: updatedCategories,
    }));

    setCurrentService({
      title: '',
      price: '',
      duration: '30',
      description: '',
      categoryIndex: null,
    });
    setServiceModalVisible(false);
  };

  // Remove service from category
  const removeService = (categoryIndex, serviceId) => {
    const updatedCategories = [...formData.serviceCategories];
    updatedCategories[categoryIndex].services = updatedCategories[
      categoryIndex
    ].services.filter(service => service.id !== serviceId);

    setFormData(prev => ({
      ...prev,
      serviceCategories: updatedCategories,
    }));
  };

  // Add amenity
  const addAmenity = () => {
    if (!newAmenity.trim()) return;

    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity.trim()],
    }));
    setNewAmenity('');
  };

  // Remove amenity
  const removeAmenity = index => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  // Add stylist
  const addStylist = () => {
    if (!currentStylist.name || !currentStylist.rating) {
      Alert.alert('Error', 'Please enter stylist name and rating');
      return;
    }

    const rating = parseFloat(currentStylist.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      Alert.alert('Error', 'Please enter a valid rating between 0 and 5');
      return;
    }

    const newStylist = {
      profilePhoto:
        currentStylist.profilePhoto || 'https://via.placeholder.com/100',
      name: currentStylist.name,
      rating: rating,
      specialization: currentStylist.specialization,
      experience: currentStylist.experience,
      isActive: true,
    };

    setFormData(prev => ({
      ...prev,
      stylists: [...prev.stylists, newStylist],
    }));

    setCurrentStylist({
      name: '',
      profilePhoto: '',
      rating: '',
      specialization: [],
      experience: '',
    });
  };

  // Remove stylist
  const removeStylist = index => {
    setFormData(prev => ({
      ...prev,
      stylists: prev.stylists.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission using salonService
  const handleCreateSalon = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.locationName ||
      !formData.description ||
      !formData.location.latitude ||
      !formData.location.longitude
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    if (formData.serviceCategories.length === 0) {
      Alert.alert('Error', 'Please add at least one service category');
      return;
    }

    // Check if each category has at least one service
    const emptyCategories = formData.serviceCategories.filter(
      cat => cat.services.length === 0,
    );
    if (emptyCategories.length > 0) {
      Alert.alert(
        'Error',
        `Please add at least one service to "${emptyCategories[0].name}" category`,
      );
      return;
    }

    if (formData.stylists.length === 0) {
      Alert.alert('Error', 'Please add at least one stylist');
      return;
    }

    setLoading(true);
    try {
      // Use salonService instead of direct api call
      const response = await salonService.createSalon({
        ...formData,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
        },
      });

      if (response.success) {
        Alert.alert('Success', 'Salon created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to create salon');
      }
    } catch (error) {
      console.error('Error creating salon:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to create salon. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item, index }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryInfo}>
          <Feather name="folder" size={20} color="#007AFF" />
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.serviceCount}>
            ({item.services.length} services)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => removeCategory(index)}
          style={styles.removeButton}
        >
          <Feather name="trash-2" size={16} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Services in this category */}
      {item.services.map(service => (
        <View key={service.id} style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
            {service.duration > 0 && (
              <Text style={styles.serviceDuration}>{service.duration} min</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => removeService(index, service.id)}
            style={styles.removeButton}
          >
            <Feather name="x" size={14} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addServiceButton}
        onPress={() => {
          setCurrentService(prev => ({ ...prev, categoryIndex: index }));
          setServiceModalVisible(true);
        }}
      >
        <Feather name="plus" size={14} color="#007AFF" />
        <Text style={styles.addServiceText}>Add Service</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStylistItem = ({ item, index }) => (
    <View style={styles.stylistItem}>
      <View style={styles.stylistInfo}>
        <Text style={styles.stylistName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color="#FFD700" />
          <Text style={styles.stylistRating}>{item.rating}/5</Text>
        </View>
        {item.experience && (
          <Text style={styles.stylistExperience}>{item.experience}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => removeStylist(index)}
        style={styles.removeButton}
      >
        <Feather name="trash-2" size={16} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <CommonContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create New Salon</Text>

        {/* Images Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="image" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Salon Images</Text>
          </View>

          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Feather name="upload" size={18} color="#007AFF" />
            <Text style={styles.addImageText}>Add Images</Text>
          </TouchableOpacity>

          {formData.images.length > 0 ? (
            <FlatList
              horizontal
              data={formData.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderImageItem}
              showsHorizontalScrollIndicator={false}
              style={styles.imagesList}
            />
          ) : (
            <Text style={styles.hintText}>No images selected</Text>
          )}

          {formData.images.length > 0 && (
            <Text style={styles.imageCountText}>
              {formData.images.length} image(s) selected
            </Text>
          )}
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Salon Name *"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, name: text }))
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Location Name (Area) *"
            placeholderTextColor="#999"
            value={formData.locationName}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, locationName: text }))
            }
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description *"
            placeholderTextColor="#999"
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, description: text }))
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Location Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>

          <View style={styles.locationButtonsContainer}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Feather name="navigation" size={16} color="#007AFF" />
              <Text style={styles.locationButtonText}>
                Use Current Location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setMapModalVisible(true)}
            >
              <Feather name="map" size={16} color="#007AFF" />
              <Text style={styles.locationButtonText}>Select on Map</Text>
            </TouchableOpacity>
          </View>

          {formData.location.latitude && formData.location.longitude ? (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                Latitude: {formData.location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinatesText}>
                Longitude: {formData.location.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.hintText}>No location selected</Text>
          )}
        </View>

        {/* Service Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="layers" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Service Categories</Text>
          </View>

          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Feather name="folder-plus" size={18} color="#007AFF" />
            <Text style={styles.addCategoryText}>Add Category</Text>
          </TouchableOpacity>

          {formData.serviceCategories.length > 0 ? (
            <FlatList
              data={formData.serviceCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCategoryItem}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.hintText}>No categories added yet</Text>
          )}
        </View>

        {/* Stylists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Stylists</Text>
          </View>

          <View style={styles.stylistForm}>
            <TextInput
              style={styles.input}
              placeholder="Stylist Name *"
              placeholderTextColor="#999"
              value={currentStylist.name}
              onChangeText={text =>
                setCurrentStylist(prev => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Profile Photo URL"
              placeholderTextColor="#999"
              value={currentStylist.profilePhoto}
              onChangeText={text =>
                setCurrentStylist(prev => ({ ...prev, profilePhoto: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Rating (0-5) *"
              placeholderTextColor="#999"
              value={currentStylist.rating}
              onChangeText={text =>
                setCurrentStylist(prev => ({
                  ...prev,
                  rating: text.replace(/[^0-9.]/g, ''),
                }))
              }
              keyboardType="decimal-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Experience (e.g., 5 years)"
              placeholderTextColor="#999"
              value={currentStylist.experience}
              onChangeText={text =>
                setCurrentStylist(prev => ({ ...prev, experience: text }))
              }
            />

            <TouchableOpacity style={styles.addButton} onPress={addStylist}>
              <Feather name="user-plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Stylist</Text>
            </TouchableOpacity>
          </View>

          {formData.stylists.length > 0 ? (
            <FlatList
              data={formData.stylists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderStylistItem}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.hintText}>No stylists added yet</Text>
          )}
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Amenities</Text>
          </View>

          <View style={styles.amenityInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add amenity (e.g., WiFi, Parking)"
              placeholderTextColor="#999"
              value={newAmenity}
              onChangeText={setNewAmenity}
              onSubmitEditing={addAmenity}
            />
            <TouchableOpacity
              style={styles.addAmenityButton}
              onPress={addAmenity}
            >
              <Feather name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.amenitiesList}>
            {formData.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>{amenity}</Text>
                <TouchableOpacity
                  onPress={() => removeAmenity(index)}
                  style={styles.removeAmenityButton}
                >
                  <Feather name="x" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleCreateSalon}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Feather name="loader" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Creating Salon...</Text>
            </View>
          ) : (
            <View style={styles.submitButtonContent}>
              <Feather name="check-circle" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Create Salon</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Add Category Modal */}
        <Modal
          visible={categoryModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>

              <TextInput
                style={styles.input}
                placeholder="Category Name *"
                placeholderTextColor="#999"
                value={currentCategory.name}
                onChangeText={text =>
                  setCurrentCategory(prev => ({ ...prev, name: text }))
                }
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={addCategory}
                >
                  <Text style={styles.confirmButtonText}>Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Service Modal */}
        <Modal
          visible={serviceModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setServiceModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Service</Text>

              <TextInput
                style={styles.input}
                placeholder="Service Title *"
                placeholderTextColor="#999"
                value={currentService.title}
                onChangeText={text =>
                  setCurrentService(prev => ({ ...prev, title: text }))
                }
              />

              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="Price *"
                  placeholderTextColor="#999"
                  value={currentService.price}
                  onChangeText={text =>
                    setCurrentService(prev => ({
                      ...prev,
                      price: text.replace(/[^0-9]/g, ''),
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Duration (minutes)"
                placeholderTextColor="#999"
                value={currentService.duration}
                onChangeText={text =>
                  setCurrentService(prev => ({
                    ...prev,
                    duration: text.replace(/[^0-9]/g, ''),
                  }))
                }
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor="#999"
                value={currentService.description}
                onChangeText={text =>
                  setCurrentService(prev => ({ ...prev, description: text }))
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setServiceModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={addService}
                >
                  <Text style={styles.confirmButtonText}>Add Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Map Modal for Location Selection */}
        <Modal
          visible={mapModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setMapModalVisible(false)}
        >
          <View style={styles.mapModalContainer}>
            <View style={styles.mapHeader}>
              <TouchableOpacity
                style={styles.mapBackButton}
                onPress={() => setMapModalVisible(false)}
              >
                <Feather name="arrow-left" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.mapTitle}>Select Location</Text>
              <TouchableOpacity
                style={styles.mapConfirmButton}
                onPress={confirmLocation}
              >
                <Text style={styles.mapConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <MapView
              style={styles.map}
              region={mapRegion}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {formData.location.latitude && formData.location.longitude && (
                <Marker
                  coordinate={{
                    latitude: formData.location.latitude,
                    longitude: formData.location.longitude,
                  }}
                  title="Salon Location"
                  description="Selected salon location"
                />
              )}
            </MapView>

            <View style={styles.mapInstructions}>
              <Feather name="info" size={16} color="#007AFF" />
              <Text style={styles.mapInstructionsText}>
                Tap on the map to select your salon location
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </CommonContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fafbfc',
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  locationButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 6,
  },
  coordinatesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#2c3e50',
    fontFamily: 'monospace',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 6,
  },
  categoryItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    marginLeft: 6,
    color: '#2c3e50',
  },
  serviceCount: {
    fontSize: 11,
    color: '#666',
    marginLeft: 6,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: '#2c3e50',
  },
  servicePrice: {
    fontSize: 11,
    color: '#27ae60',
    fontFamily: theme.fonts.bold,
  },
  serviceDuration: {
    fontSize: 10,
    color: '#666',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 6,
    marginTop: 6,
  },
  addServiceText: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 4,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f0f8ff',
  },
  addCategoryText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 6,
  },
  stylistForm: {
    marginBottom: 12,
  },
  stylistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  stylistInfo: {
    flex: 1,
  },
  stylistName: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: '#2c3e50',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stylistRating: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  stylistExperience: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  amenityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addAmenityButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    marginLeft: 6,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  amenityText: {
    color: '#1976d2',
    fontSize: 11,
    fontFamily: theme.fonts.semiBold,
  },
  removeAmenityButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginLeft: 6,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontFamily: theme.fonts.semiBold,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: theme.fonts.semiBold,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currencySymbol: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: '#666',
  },
  priceInput: {
    paddingLeft: 28,
  },
  // Map Modal Styles
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  mapBackButton: {
    padding: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: '#1a1a1a',
  },
  mapConfirmButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapConfirmText: {
    color: '#fff',
    fontFamily: theme.fonts.semiBold,
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  mapInstructionsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f0f8ff',
  },
  addImageText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 8,
  },
  imagesList: {
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCountText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CreateSalonScreen;
