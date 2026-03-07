import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import { useUserStore } from '@/store/userStore';
import { salonService } from '@/services/salonService';

const SalonSetupWelcomeScreen = () => {
  const { updateUser } = useUserStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkExistingSalon();
  }, []);

  const checkExistingSalon = async () => {
    try {
      const response = await salonService.getPartnerSalon();
      if (
        response &&
        (response.status === 'success' || response.success) &&
        response.data
      ) {
        // Salon already exists, update store and move to dashboard
        updateUser({ isProfileCompleted: true });
        resetAndNavigate('PartnerBottomTab');
      }
    } catch (error) {
      console.log('Error checking existing salon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CommonContainer>
        <View style={styles.loadingContainer}>
          <Text style={styles.subtitle}>Checking salon status...</Text>
        </View>
      </CommonContainer>
    );
  }

  return (
    <CommonContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
              }}
              style={styles.welcomeImage}
            />
          </View>

          <Text style={styles.title}>Build Your Salon</Text>
          <Text style={styles.subtitle}>
            Welcome to Trimora! Let's get your business started by setting up
            your salon profile. This will help customers find and book your
            services.
          </Text>

          <View style={styles.bulletPoints}>
            <View style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Showcase your salon with beautiful images
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Set your location so locals can find you
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Define your amenities and working hours
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigate('SalonSetupFormScreen')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </CommonContainer>
  );
};

export default SalonSetupWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  bulletPoints: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryDark,
    marginRight: theme.spacing.md,
  },
  bulletText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  nextButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  nextButtonText: {
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
