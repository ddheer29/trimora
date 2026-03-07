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
import {
  Salon,
  SalonDetailsScreenProps,
  ServicesData,
  Stylist,
  Service,
} from '@/types';
import { useCartStore } from '@/store/cartStore';

const { width } = Dimensions.get('window');

const SalonDetailsScreen: FC<SalonDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [salonData, setSalonData] = useState<Salon | null>(null);
  const [servicesData, setServicesData] = useState<ServicesData>({});
  const [salonStylists, setSalonStylists] = useState<Stylist[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    services: cartServices,
    addService,
    removeService,
    setSalon,
    salonId: cartSalonId,
  } = useCartStore();

  const handleOpenMap = () => {
    if (salonData?.location) {
      const [longitude, latitude] = salonData.location.coordinates;
      Linking.openURL(`https://maps.google.com?q=${latitude},${longitude}`);
    }
  };

  const renderAllProfilePics = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const size = width / 1.48;
    return (
      <View key={index} style={{ marginRight: 8 }}>
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
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowBookButton(offsetY < 100);
      },
    },
  );

  const fetchSalonData = async () => {
    try {
      setLoading(true);
      const salonId = route.params.salonId;
      const salonRes = await salonService.getSalonById(salonId);
      console.log('🚀 -> fetchSalonData -> salonRes:', salonRes);
      if (salonRes.status === 'success') {
        const salon = salonRes.data.salon;
        setSalonData(salon);
        if (cartSalonId !== salon._id) {
          setSalon(salon._id, salon.name);
        }
      }

      const servicesRes = await salonService.getSalonServices(salonId, 1, 100);
      if (servicesRes.status === 'success') {
        const services = servicesRes.data.services || [];
        const grouped = services.reduce(
          (acc: ServicesData, service: Service) => {
            const cat = service.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({
              id: service._id,
              title: service.name,
              price: service.price,
              duration: service.duration,
              description: service.description,
            });
            return acc;
          },
          {} as ServicesData,
        );

        setServicesData(grouped);
        const cats = Object.keys(grouped);
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0]);
        }
      }

      // Fetch Stylists
      const stylistsRes = await salonService.getSalonStylists(salonId);
      if (stylistsRes.status === 'success') {
        setSalonStylists(stylistsRes.data.stylists || []);
      }
    } catch (error) {
      console.log('🚀 -> fetchSalonData -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonData();
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
              ⭐ {salonData?.rating || 0} ({salonData?.totalReviews || 0}{' '}
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
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.selectedCategoryTab,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category}
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
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      cartServices.find(s => s._id === item.id) &&
                        styles.removeButton,
                    ]}
                    onPress={() => {
                      const isAdded = cartServices.find(s => s._id === item.id);
                      if (isAdded) {
                        removeService(item.id);
                      } else {
                        addService({
                          _id: item.id,
                          name: item.title,
                          price: item.price,
                          duration: item.duration || 0,
                          category: selectedCategory,
                          subCategory: '',
                          gender: 'Unisex',
                          description: item.description,
                        });
                      }
                    }}
                  >
                    <Text style={styles.addButtonText}>
                      {cartServices.find(s => s._id === item.id)
                        ? 'Remove'
                        : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              style={{ maxHeight: theme.spacing.xl * 5 }}
            />
          </View>

          {/* 📝 Stylists */}
          {salonStylists && salonStylists.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Our Stylists</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  marginBottom: theme.spacing.lg,
                }}
              >
                {salonStylists.map((stylist, index) => (
                  <View key={stylist._id} style={styles.stylistCard}>
                    <Image
                      source={{ uri: stylist.profilePhoto }}
                      style={styles.stylistImage}
                    />
                    <Text style={styles.stylistName}>{stylist.name}</Text>
                    <Text style={styles.stylistRating}>
                      ⭐ {stylist.rating || 0}
                    </Text>
                    {stylist.yearsOfExperience && (
                      <Text style={styles.stylistExperience}>
                        {stylist.yearsOfExperience} years exp
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
                    latitude: salonData?.location?.coordinates?.[1],
                    longitude: salonData?.location?.coordinates?.[0],
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: salonData?.location?.coordinates?.[1],
                      longitude: salonData?.location?.coordinates?.[0],
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

          {/* 🌟 Ratings & Reviews (Mocked/Placeholder) */}
          <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
          <View style={styles.reviewBox}>
            <Text style={styles.ratingValue}>{salonData?.rating || 0} ⭐</Text>
            <Text style={styles.reviewText}>
              No reviews yet. Be the first to review!
            </Text>
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
        {cartServices.length > 0 && (
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => navigation?.navigate('StylistAndTimeSlotScreen')}
          >
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>
                {cartServices.length} {cartServices.length === 1 ? 'Service' : 'Services'} Added
              </Text>
              <Text style={styles.cartTotal}>
                Total: ₹{cartServices.reduce((sum, s) => sum + s.price, 0)}
              </Text>
            </View>
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
  removeButton: {
    backgroundColor: theme.colors.error || '#FF5252',
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
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.medium,
    zIndex: 99,
  },
  bookNowButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
  cartInfo: {
    flex: 1,
    paddingLeft: theme.spacing.sm,
  },
  cartCount: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.body,
  },
  cartTotal: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.sm,
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
