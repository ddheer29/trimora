import React, { useRef, useState } from 'react';
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

const { width } = Dimensions.get('window');

const sampleImages = [
  'https://plus.unsplash.com/premium_photo-1664301489002-2fed4596c101?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1669675936121-6d3d42244ab5?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const serviceCategories = ['Hair', 'Skin', 'Makeup', 'Nails'];

const servicesData = {
  Hair: [
    { id: '1', title: 'Haircut - Women', price: '₹499' },
    { id: '2', title: 'Hair Spa', price: '₹799' },
    { id: '3', title: 'Hair Color', price: '₹999' },
    { id: '4', title: 'Hair Smoothening', price: '₹1999' },
    { id: '5', title: 'Hair Wash', price: '₹299' },
    { id: '6', title: 'Blow Dry', price: '₹499' },
  ],
  Skin: [
    { id: '1', title: 'Facial', price: '₹699' },
    { id: '2', title: 'Cleanup', price: '₹399' },
  ],
  Makeup: [{ id: '1', title: 'Party Makeup', price: '₹1499' }],
  Nails: [{ id: '1', title: 'Nail Art', price: '₹799' }],
};

const SalonDetailsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Hair');

  const handleOpenMap = () => {
    Linking.openURL('https://maps.google.com?q=28.6139,77.2090');
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
  const [showBookButton, setShowBookButton] = useState(true);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowBookButton(offsetY < 100); // 👈 Show when near top
      },
    },
  );

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
            data={sampleImages}
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
            <Text style={styles.title}>Glamorous Salon</Text>
            <Text style={styles.subtitle}>Connaught Place, New Delhi</Text>
            <Text style={styles.rating}>⭐ 4.8 (280 reviews)</Text>
            <Text style={styles.pricing}>Avg Price: ₹1200</Text>
          </View>

          {/* 🪄 Service Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabContainer}
          >
            {serviceCategories.map(category => (
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
              data={servicesData[selectedCategory]}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.serviceItem}>
                  <View>
                    <Text style={styles.serviceTitle}>{item.title}</Text>
                    <Text style={styles.servicePrice}>{item.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={servicesData[selectedCategory].length > 5}
              style={{ maxHeight: theme.spacing.xl * 5 }}
            />
          </View>

          {/* 📝 Description */}
          <ScrollView style={styles.descriptionContainer} nestedScrollEnabled>
            <Text style={styles.descriptionText}>
              Glamorous Salon is your ultimate destination for luxurious beauty
              and wellness treatments. Enjoy world-class service in an ambiance
              tailored for modern women who seek premium pampering.
            </Text>
          </ScrollView>

          {/* 👩 Stylists */}
          <Text style={styles.sectionHeading}>Our Stylists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: theme.spacing.lg,
            }}
          >
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.stylistCard}>
                <Image
                  source={{ uri: 'https://source.unsplash.com/100x100/?woman' }}
                  style={styles.stylistImage}
                />
                <Text style={styles.stylistName}>Stylist {index + 1}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 🗺️ Map & Direction */}
          <Text style={styles.sectionHeading}>Our Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={{ flex: 1, borderRadius: theme.borderRadius.md }}
              initialRegion={{
                latitude: 28.6139,
                longitude: 77.209,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: 28.6139, longitude: 77.209 }} />
            </MapView>
            <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          {/* 🌟 Ratings */}
          <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
          <View style={styles.reviewBox}>
            <Text style={styles.ratingValue}>4.8 ⭐</Text>
            <Text style={styles.reviewText}>
              "Amazing ambiance and expert staff!"
            </Text>
          </View>
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
});
