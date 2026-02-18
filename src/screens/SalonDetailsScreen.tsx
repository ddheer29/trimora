import React, { FC, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Animated,
} from 'react-native';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import MapView, { Marker } from 'react-native-maps';
import { salonService } from '@/services/salonService';
import { Salon, SalonDetailsScreenProps, ServicesData } from '@/types';

const { width } = Dimensions.get('window');

const SalonDetailsScreen: FC<SalonDetailsScreenProps> = ({ route }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [salonData, setSalonData] = useState<Salon | null>(null);
  const [servicesData, setServicesData] = useState<ServicesData>({});

  const handleOpenMap = () => {
    if (salonData?.location) {
      const { latitude, longitude } = salonData.location;
      Linking.openURL(`https://maps.google.com?q=${latitude},${longitude}`);
    }
  };

  const renderAllProfilePics = ({ item, index }) => {
    const size = width / 1.48;
    return (
      <View style={{ marginRight: 8 }}>
        <Image
          source={{ uri: item }}
          style={{ width: size, height: size, borderRadius: 12 }}
        />
      </View>
    );
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const [showBookButton, setShowBookButton] = useState<boolean>(true);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowBookButton(offsetY < 100);
      },
    },
  );

  const fetchSalon = async () => {
    try {
      const response = await salonService.getSalonById(route.params.salonId);
      console.log(
        '🚀 -> fetchSalon -> response:',
        JSON.stringify(response, null, 2),
      );

      if (response.success && response.data) {
        const salon = response.data;
        setSalonData(salon);

        // Set first category as selected by default
        if (salon.serviceCategories && salon.serviceCategories.length > 0) {
          setSelectedCategory(salon.serviceCategories[0].name);
        }

        // Transform service categories into servicesData format
        const transformedServices = {};
        salon.serviceCategories?.forEach(category => {
          transformedServices[category.name] =
            category.services?.map(service => ({
              id: service.id || service._id,
              title: service.title,
              price: service.price,
              duration: service.duration,
              description: service.description,
            })) || [];
        });
        setServicesData(transformedServices);
      }
    } catch (error) {
      console.log('🚀 -> fetchSalon -> error:', error);
    }
  };

  useEffect(() => {
    fetchSalon();
  }, []);

  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      title="Salon Details"
      headerStyle={{ borderBottomWidth: 0 }}
      titleStyle={{
        color: theme.colors.primaryDark,
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.heading,
      }}
    >
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* 🖼️ Image Carousel */}
          <FlatList
            data={salonData?.images}
            horizontal
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderAllProfilePics}
            contentContainerStyle={{
              marginBottom: 24,
            }}
            snapToInterval={width / 1.48 + 8}
            decelerationRate="fast"
          />

          {/* 📋 Salon Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{salonData?.name}</Text>
            <Text style={styles.subtitle}>{salonData?.locationName}</Text>
            <Text style={styles.rating}>
              ⭐ {salonData?.rating || 0} ({salonData?.numberOfReviews || 0}{' '}
              reviews)
            </Text>
            <Text style={styles.pricing}>
              Avg Price: {salonData?.averagePrice}
            </Text>
          </View>

          {/* 🪄 Service Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabContainer}
          >
            {salonData?.serviceCategories?.map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.name &&
                    styles.selectedCategoryTab,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 💆 Services List */}
          <View style={styles.servicesContainer}>
            <FlatList
              data={servicesData[selectedCategory] || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.serviceItem}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{item.title}</Text>
                    <Text style={styles.servicePrice}>{item.price}</Text>
                    {item.duration && (
                      <Text style={styles.serviceDuration}>
                        {item.duration} mins
                      </Text>
                    )}
                    {item.description ? (
                      <Text style={styles.serviceDescription}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={(servicesData[selectedCategory]?.length || 0) > 5}
              style={{ maxHeight: theme.spacing.xl * 5 }}
            />
          </View>

          {/* 📝 Description */}
          {salonData?.stylists && salonData?.stylists.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Our Stylists</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  marginBottom: theme.spacing.lg,
                }}
              >
                {salonData?.stylists.map((stylist, index) => (
                  <View key={stylist._id} style={styles.stylistCard}>
                    <Image
                      source={{ uri: stylist.profilePhoto }}
                      style={styles.stylistImage}
                    />
                    <Text style={styles.stylistName}>{stylist.name}</Text>
                    <Text style={styles.stylistRating}>
                      ⭐ {stylist.rating}
                    </Text>
                    {stylist.experience && (
                      <Text style={styles.stylistExperience}>
                        {stylist.experience} years exp
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* 🗺️ Map & Direction */}
          {salonData?.location && (
            <>
              <Text style={styles.sectionHeading}>Our Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={{ flex: 1, borderRadius: theme.borderRadius.md }}
                  initialRegion={{
                    latitude: salonData?.location.latitude,
                    longitude: salonData?.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: salonData?.location.latitude,
                      longitude: salonData?.location.longitude,
                    }}
                  />
                </MapView>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={handleOpenMap}
                >
                  <Text style={styles.mapButtonText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* 🌟 Ratings & Reviews */}
          <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
          <View style={styles.reviewBox}>
            <Text style={styles.ratingValue}>{salonData?.rating || 0} ⭐</Text>
            {salonData?.reviews && salonData?.reviews.length > 0 ? (
              salonData?.reviews.map(review => (
                <Text key={review._id} style={styles.reviewText}>
                  "{review.comment}"
                </Text>
              ))
            ) : (
              <Text style={styles.reviewText}>
                No reviews yet. Be the first to review!
              </Text>
            )}
          </View>

          {/* 🛠️ Amenities */}
          {salonData?.amenities && salonData?.amenities.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {salonData?.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.ScrollView>
        {showBookButton && (
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </CommonContainer>
  );
};

export default SalonDetailsScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  detailsContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rating: {
    marginTop: 4,
    color: theme.colors.highlight,
    fontFamily: theme.fonts.subheading,
  },
  pricing: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  categoryTabContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryTab: {
    backgroundColor: theme.colors.card,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  selectedCategoryTab: {
    backgroundColor: theme.colors.primaryDark,
  },
  categoryText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  selectedCategoryText: {
    color: theme.colors.textOnPrimary,
  },
  servicesContainer: {
    marginBottom: theme.spacing.lg,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  serviceTitle: {
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  servicePrice: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  addButton: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  addButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.subheading,
  },
  descriptionContainer: {
    maxHeight: width,
    marginBottom: theme.spacing.lg,
  },
  descriptionText: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  sectionHeading: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  stylistCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  stylistImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xs,
  },
  stylistName: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
  },
  mapContainer: {
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  mapButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.colors.primaryDark + 'CC',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  mapButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.subheading,
  },
  reviewBox: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  ratingValue: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.highlight,
    fontFamily: theme.fonts.heading,
    marginBottom: theme.spacing.xs,
  },
  reviewText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  bookNowButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
    zIndex: 99,
  },
  bookNowButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
  stylistRating: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.highlight,
    marginBottom: 2,
  },
  stylistExperience: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  amenityItem: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  amenityText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },

  serviceDuration: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  serviceInfo: {
    flex: 1,
  },
});
