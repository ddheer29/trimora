import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home,
  Users,
  Scissors,
  Image as ImageIcon,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import CommonContainer from '@components/CommonContainer';
import CustomAlert from '@components/CustomAlert';
import theme from '@utils/Theme';
import notificationService from '@/services/notificationService';

const SettingScreen = () => {
  const { user, logout } = useUserStore();
  const [isLogoutAlertVisible, setLogoutAlertVisible] = useState(false);

  const userProfile = {
    name: user?.name || 'Partner',
    email: user?.email || 'salon.partner@email.com',
    initial: (user?.name || 'P')[0].toUpperCase(),
  };

  const menuItems = [
    {
      title: 'Edit Salon Details',
      subtitle: 'Update your business information',
      icon: Home,
      onPress: () => navigate('SalonSetupFormScreen', { isEdit: true }),
    },
    {
      title: 'Manage Stylists',
      subtitle: 'Add or remove team members',
      icon: Users,
      onPress: () => navigate('ManageStylistsScreen'),
    },
    {
      title: 'Manage Services',
      subtitle: 'Configure your service menu',
      icon: Scissors,
      onPress: () => navigate('ManageServicesScreen'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage alert preferences',
      icon: Bell,
      onPress: () => navigate('NotificationsScreen'),
    },
  ];

  const handleLogout = () => {
    setLogoutAlertVisible(true);
  };

  return (
    <CommonContainer
      scrollable
      backgroundColor="#F9FAFB"
      title="Settings"
      hideHeader={false}
      noPadding
      headerStyle={styles.header}
      titleStyle={styles.headerTitle}
      showBackButton
    >
      <CustomAlert
        visible={isLogoutAlertVisible}
        title="Logout"
        message="Are you sure you want to log out?"
        iconName="log-out-outline"
        iconBgColor="#F1F5F9"
        iconColor={theme.colors.error}
        options={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setLogoutAlertVisible(false),
          },
          {
            text: 'Logout',
            style: 'default',
            onPress: () => {
              setLogoutAlertVisible(false);
              notificationService.unregisterToken();
              logout();
              resetAndNavigate('AuthNavigator');
            },
          },
        ]}
        onRequestClose={() => setLogoutAlertVisible(false)}
      />

      <View style={styles.content}>
        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.9}
          onPress={() => navigate('SalonPreviewScreen')}
        >
          <LinearGradient
            colors={['#A855F7', '#EC4899']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>{userProfile.initial}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileRole}>Salon Partner</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* Settings Group */}
        <View style={styles.settingsGroup}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.settingItem}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.iconContainer}>
                  <item.icon size={22} color="#475569" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutCard}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LogOut size={24} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </CommonContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    borderBottomWidth: 0,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: theme.fonts.bold,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  settingsGroup: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 80, // Offset to align with text
  },
  logoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.error,
  },
});

export default SettingScreen;
