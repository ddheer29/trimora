import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@react-native-vector-icons/feather';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import { useUserStore } from '@/store/userStore';
import CustomAlert from '@components/CustomAlert';
import notificationService from '@/services/notificationService';

const SettingScreen = () => {
  const { user } = useUserStore();
  const [isLogoutAlertVisible, setLogoutAlertVisible] = useState(false);

  const menuItems = [
    {
      title: 'Edit Salon Details',
      icon: 'home',
      onPress: () => navigate('SalonSetupFormScreen', { isEdit: true }),
    },
    {
      title: 'Manage Stylists',
      icon: 'users',
      onPress: () => navigate('ManageStylistsScreen'),
    },
    {
      title: 'Manage Services',
      icon: 'scissors',
      onPress: () => navigate('ManageServicesScreen'),
    },
    {
      title: 'Portfolio & Posts',
      icon: 'image',
      onPress: () => navigate('ManagePostsScreen'),
    },
    {
      title: 'Notifications',
      icon: 'bell',
      onPress: () => navigate('NotificationsScreen'),
    },
  ];

  return (
    <CommonContainer title="Settings" hideHeader={false}>
      <CustomAlert
        visible={isLogoutAlertVisible}
        title="Logout"
        message="Are you sure you want to log out?"
        iconName="log-out-outline"
        iconBgColor="#F1F5F9"
        iconColor={theme.colors.primaryDark}
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
              useUserStore.getState().logout();
              resetAndNavigate('AuthNavigator');
            },
          },
        ]}
        onRequestClose={() => setLogoutAlertVisible(false)}
      />

      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.profileSection}
          activeOpacity={0.7}
          onPress={() => navigate('SalonPreviewScreen')}
        >
          <Image
            source={{
              uri: user?.profilePhoto || 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Partner'}</Text>
            <Text style={styles.userRole}>Salon Partner</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Feather
                  name={item.icon as any}
                  size={20}
                  color={theme.colors.textOnPrimary}
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.colors.textDisabled}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutAlertVisible(true)}
        >
          <Feather name="log-out" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </CommonContainer>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.soft,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textPrimary,
  },
  userRole: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  menuSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    ...theme.shadows.soft,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    marginBottom: 50,
  },
  logoutText: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.md,
    color: 'red',
  },
});
