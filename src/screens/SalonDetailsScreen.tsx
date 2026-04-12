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
import theme from '../utils/Theme';
import MapView, { Marker } from 'react-native-maps';
import { salonService } from '@/services/salonService';
import ImageView from 'react-native-image-viewing';
import {
  Salon,
  SalonDetailsScreenProps,
  ServicesData,
  Stylist,
  Service,
} from '@/types';
import { useCartStore } from '@/store/cartStore';
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  Star,
  IndianRupee,
  Share2,
  Heart,
  ChevronLeft,
  MapPinned,
  Wind,
  Wifi,
  Droplets,
  Coffee,
  ParkingCircle,
  Tv2,
  Scissors,
  ShowerHead,
  Dumbbell,
  Music2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 280;

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
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => {
          setCurrentImageIndex(index);
          setImageViewVisible(true);
        }}
      >
        <Image source={{ uri: item }} style={styles.heroImage} />
      </TouchableOpacity>
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

      const stylistsRes = await salonService.getSalonStylists(salonId);
      if (stylistsRes.status === 'success') {
        setSalonStylists(stylistsRes.data.stylists || []);
      }
    } catch (error) {
      console.log('fetchSalonData error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonData();
  }, []);

  // Mock reviews for UI demo
  const mockReviews = [
    {
      id: '1',
      name: 'Rahul M.',
      rating: 5,
      comment:
        'Amazing service! The stylist was very professional and understood exactly what I wanted.',
      service: 'Haircut',
      time: '2 days ago',
    },
    {
      id: '2',
      name: 'Priya S.',
      rating: 5,
      comment:
        'Best salon in the area. Clean, professional, and great value for money.',
      service: 'Hair Coloring',
      time: '1 week ago',
    },
  ];

  // Amenity icon map using lucide icons
  const amenityIconMap: { [key: string]: React.ReactNode } = {
    'Air conditioner': <Wind size={22} color="#64748B" />,
    WIFI: <Wifi size={22} color="#64748B" />,
    'Mineral water': <Droplets size={22} color="#64748B" />,
    'Coffee Machine': <Coffee size={22} color="#64748B" />,
    Coffee: <Coffee size={22} color="#64748B" />,
    Parking: <ParkingCircle size={22} color="#64748B" />,
    TV: <Tv2 size={22} color="#64748B" />,
    Salon: <Scissors size={22} color="#64748B" />,
    Shower: <ShowerHead size={22} color="#64748B" />,
    Gym: <Dumbbell size={22} color="#64748B" />,
    Music: <Music2 size={22} color="#64748B" />,
  };

  const getAmenityIcon = (amenity: string) => {
    return amenityIconMap[amenity] ?? <Wind size={22} color="#64748B" />;
  };

  return (
    <View style={styles.rootContainer}>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Carousel */}
        <View style={styles.heroContainer}>
          {salonData?.images && salonData.images.length > 0 ? (
            <FlatList
              data={salonData.images}
              horizontal
              pagingEnabled
              bounces={false}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAllProfilePics}
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]} />
          )}

          {/* Floating top nav */}
          <View style={styles.heroTopNav}>
            <TouchableOpacity
              style={styles.heroNavBtn}
              onPress={() => navigation?.goBack()}
            >
              <ChevronLeft size={22} color="#1E293B" />
            </TouchableOpacity>
            <View style={styles.heroNavRight}>
              <TouchableOpacity style={styles.heroNavBtn}>
                <Share2 size={20} color="#1E293B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroNavBtn}>
                <Heart size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.salonName}>{salonData?.name}</Text>
          <View style={styles.infoRow}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.infoText}>{salonData?.locationName}</Text>
          </View>
          <View style={styles.infoMetaRow}>
            <View style={styles.infoRow}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>
                {salonData?.rating || 0} ({salonData?.totalReviews || 0}{' '}
                reviews)
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <IndianRupee size={13} color="#64748B" />
              <Text style={styles.infoText}>
                {salonData?.averagePrice || 0} avg price
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                salonData?.phone && Linking.openURL(`tel:${salonData.phone}`)
              }
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={handleOpenMap}
            >
              <Navigation size={18} color="#1E293B" />
              <Text style={[styles.actionBtnText, styles.actionBtnOutlineText]}>
                Directions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
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
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Services</Text>
          <View style={styles.servicesCard}>
            {(servicesData[selectedCategory] || []).map((item, index) => {
              const isAdded = !!cartServices.find(s => s._id === item.id);
              const isLast =
                index === (servicesData[selectedCategory] || []).length - 1;
              return (
                <View key={item.id}>
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>{item.title}</Text>
                      <View style={styles.serviceMeta}>
                        <Clock size={12} color="#94A3B8" />
                        <Text style={styles.serviceDuration}>
                          {item.duration} min
                        </Text>
                        <Text style={styles.servicePrice}> ₹{item.price}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.addButton, isAdded && styles.removeButton]}
                      onPress={() => {
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
                        {isAdded ? 'Remove' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!isLast && <View style={styles.serviceDivider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Our Stylists */}
        {salonStylists && salonStylists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Our Stylists</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stylistsScrollContent}
            >
              {salonStylists.map(stylist => (
                <View key={stylist._id} style={styles.stylistCard}>
                  <Image
                    source={{ uri: stylist.profilePhoto }}
                    style={styles.stylistImage}
                  />
                  <Text style={styles.stylistName}>{stylist.name}</Text>
                  <View style={styles.stylistRatingRow}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.stylistRating}>
                      {stylist.rating || 0}
                    </Text>
                  </View>
                  {stylist.yearsOfExperience && (
                    <Text style={styles.stylistExp}>
                      {stylist.yearsOfExperience} years exp
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Our Location */}
        {salonData?.location && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Our Location</Text>
            <View style={styles.locationCard}>
              <MapView
                style={styles.map}
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
              <View style={styles.locationFooter}>
                <View style={styles.locationAddressRow}>
                  <MapPinned size={16} color="#64748B" />
                  <Text style={styles.locationAddress}>
                    {salonData?.locationName}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.openMapsBtn}
                  onPress={handleOpenMap}
                >
                  <Text style={styles.openMapsBtnText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Ratings & Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsCard}>
            {mockReviews.map((review, index) => (
              <View key={review.id}>
                <View style={styles.reviewItem}>
                  <View style={styles.reviewTopRow}>
                    <View style={styles.starRow}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color="#F59E0B"
                          fill={i < review.rating ? '#F59E0B' : 'transparent'}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewTime}>{review.time}</Text>
                  </View>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewService}>
                    Service: {review.service}
                  </Text>
                </View>
                {index < mockReviews.length - 1 && (
                  <View style={styles.serviceDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Amenities */}
        {salonData?.amenities && salonData.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {salonData.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityCard}>
                  <View style={styles.amenityIconWrapper}>
                    {getAmenityIcon(amenity)}
                  </View>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Book Now Button — visibility logic preserved */}
      {cartServices.length > 0 && (
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() => navigation?.navigate('StylistAndTimeSlotScreen')}
        >
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>
              {cartServices.length}{' '}
              {cartServices.length === 1 ? 'Service' : 'Services'} Added
            </Text>
            <Text style={styles.cartTotal}>
              Total: ₹{cartServices.reduce((sum, s) => sum + s.price, 0)}
            </Text>
          </View>
          <Text style={styles.bookNowButtonText}>Book Now →</Text>
        </TouchableOpacity>
      )}

      <ImageView
        images={salonData?.images?.map(img => ({ uri: img })) || []}
        imageIndex={currentImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  );
};

export default SalonDetailsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Hero
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width,
    height: HERO_HEIGHT,
  },
  heroPlaceholder: {
    backgroundColor: '#E2E8F0',
  },
  heroTopNav: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heroNavRight: {
    flexDirection: 'row',
    gap: 10,
  },
  heroNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -32,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  salonName: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  infoDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
  actionBtnOutlineText: {
    color: '#1E293B',
  },

  // Categories
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
    marginBottom: 8,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  selectedCategoryTab: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryText: {
    fontSize: 14,
    color: '#475569',
    fontFamily: theme.fonts.medium,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 14,
  },
  viewAllText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.medium,
  },

  // Services
  servicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 6,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDuration: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: theme.fonts.regular,
  },
  servicePrice: {
    fontSize: 14,
    color: '#F59E0B',
    fontFamily: theme.fonts.bold,
  },
  addButton: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  removeButton: {
    backgroundColor: '#EF4444',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },

  // Stylists
  stylistsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  stylistsScrollContent: {
    gap: 16,
    paddingRight: 4,
  },
  stylistCard: {
    width: 150,
  },
  stylistImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  stylistName: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 4,
  },
  stylistRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  stylistRating: {
    fontSize: 13,
    color: '#F59E0B',
    fontFamily: theme.fonts.medium,
  },
  stylistExp: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
  },

  // Location
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  map: {
    height: 180,
    width: '100%',
  },
  locationFooter: {
    padding: 16,
  },
  locationAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationAddress: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.regular,
    flex: 1,
  },
  openMapsBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  openMapsBtnText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },

  // Reviews
  reviewsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  reviewItem: {
    paddingVertical: 16,
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: theme.fonts.regular,
  },
  reviewerName: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: '#0F172A',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    marginBottom: 6,
  },
  reviewService: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: theme.fonts.regular,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  amenityIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: '#0F172A',
    flexShrink: 1,
  },

  // Book Now
  bookNowButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10,
    zIndex: 99,
  },
  bookNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },
  cartTotal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
