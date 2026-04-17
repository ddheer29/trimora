import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import theme from '@utils/Theme';
import { salonService } from '@/services/salonService';
import { locationService } from '@/services/locationService';
import { Salon } from '@/types';
import SalonCard from '@components/Cards/SalonCard';
import { navigate } from '@utils/NavigationUtil';

const { width } = Dimensions.get('window');

const SuggestedForYou = () => {
  const [recommendations, setRecommendations] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let latitude = 28.6139; // Default Delhi
      let longitude = 77.209;

      // try {
      //   const location: any = await locationService.getCurrentLocation();
      //   latitude = location.latitude;
      //   longitude = location.longitude;
      // } catch (error) {
      //   console.log('Location error, using default:', error);
      // }

      const response = await salonService.getRecommendations(
        latitude,
        longitude,
      );
      if (response.status === 'success') {
        setRecommendations(response.data.salons || []);
      }
    } catch (error) {
      console.log('🚀 -> fetchRecommendations -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (!loading && recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconBadge}>
            <Sparkles size={14} color="#D4AF37" />
          </View>
          <Text style={styles.title}>Suggested for You</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllRow}
          onPress={() => navigate('SalonsScreen')}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {recommendations.map(salon => (
            <View key={salon._id} style={styles.cardWrapper}>
              <SalonCard
                salon={salon}
                onPress={() =>
                  navigate('SalonDetailsScreen', { salonId: salon._id })
                }
                salonCardStyle={styles.cardStyle}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FAF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    letterSpacing: -0.5,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: theme.fonts.medium,
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  cardWrapper: {
    marginRight: 16,
    marginBottom: 16,
  },
  cardStyle: {
    width: width * 0.75,
  },
});

export default SuggestedForYou;
