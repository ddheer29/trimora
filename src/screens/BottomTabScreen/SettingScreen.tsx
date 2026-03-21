import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import theme from '../../utils/Theme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useUserStore } from '@/store/userStore';
import { navigate, resetAndNavigate } from '@utils/NavigationUtil';
import CommonContainer from '@components/CommonContainer';
import CustomAlert from '@components/CustomAlert';

const SettingScreen = () => {
  const { user, logout } = useUserStore();

  const userProfile = {
    name: user?.name || 'Guest User',
    photo:
      user?.profilePhoto ||
      'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };

  const [isLogoutAlertVisible, setLogoutAlertVisible] = useState(false);

  const handleLogout = () => {
    setLogoutAlertVisible(true);
  };

  const settingsOptions = [
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {
        navigate('NotificationsScreen');
      },
    },
    { title: 'Saved Salons', icon: 'heart-outline', onPress: () => {} },
    { title: 'Rate Us', icon: 'star-outline', onPress: () => {} },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: () => {
        handleLogout();
      },
    },
  ];

  return (
    <CommonContainer scrollable>
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
              logout();
              resetAndNavigate('AuthNavigator');
            },
          },
        ]}
        onRequestClose={() => setLogoutAlertVisible(false)}
      />

      <View style={{ alignItems: 'center', marginVertical: theme.spacing.xl }}>
        <Image
          source={{ uri: userProfile.photo }}
          style={{
            width: 100,
            height: 100,
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing.md,
            borderWidth: 2,
            borderColor: theme.colors.primaryDark,
          }}
        />
        <Text
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: theme.fontSizes.xl,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          {userProfile.name}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.borderRadius.full,
          }}
          onPress={() => navigate('EditProfileScreen')}
        >
          <Text
            style={{
              fontFamily: theme.fonts.body,
              color: theme.colors.textOnPrimary,
              fontSize: theme.fontSizes.sm,
            }}
          >
            Edit Profile Settings
          </Text>
        </TouchableOpacity>
      </View>
      {settingsOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          activeOpacity={0.8}
          onPress={item.onPress}
        >
          <View style={styles.row}>
            <Ionicons
              name={item.icon as any}
              size={22}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.optionText}>{item.title}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </CommonContainer>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  optionContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.subheading,
    marginLeft: theme.spacing.md,
  },
});
