import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import api from './apiConfig';
import { useUserStore } from '../store/userStore';
import { navigate } from '../utils/NavigationUtil';

class NotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS' as any;
      const res = await check(POST_NOTIFICATIONS);
      if (res !== RESULTS.GRANTED) {
        await request(POST_NOTIFICATIONS);
      }
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await this.getToken();
    }
  }

  async getToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        await this.registerTokenWithBackend(fcmToken);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  }

  async registerTokenWithBackend(token: string) {
    const isLoggedIn = useUserStore.getState().isLoggedIn;
    if (!isLoggedIn) {
      console.log('User not logged in, skipping device token registration.');
      return;
    }

    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const platform = Platform.OS;

      const response = await api.post('/device/save-token', {
        token,
        deviceId,
        platform,
      });

      console.log('Device token registered successfully:', response.data);
    } catch (error: any) {
      console.error(
        'Failed to register device token:',
        error.response?.data?.message || error.message,
      );
    }
  }

  async unregisterToken() {
    try {
      // Invalidate the token on the device so it stops receiving notifications
      // The backend will automatically clean up the old token on next delivery failure
      await messaging().deleteToken();
      console.log('Device token deleted locally.');
    } catch (error: any) {
      console.error('Failed to unregister device token:', error.message);
    }
  }

  // Handle foreground notifications
  async setupForegroundListener() {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Listen to background events (interactions when app is closed)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      if (type === EventType.PRESS && pressAction?.id === 'default') {
        const data = notification?.data;
        this.handleNotificationData(data);
      }
    });

    // Listen to foreground events (interactions when app is open)
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          this.handleNotificationData(detail.notification?.data);
          break;
      }
    });

    return messaging().onMessage(async remoteMessage => {
      console.log('New Foreground FCM Message:', JSON.stringify(remoteMessage));

      const { notification, data } = remoteMessage;

      // Display a local notification using Notifee
      await notifee.displayNotification({
        title: notification?.title || 'New Notification',
        body: notification?.body || '',
        data: data || {},
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
    });
  }

  // Handle notification clicks (Background/Quit state)
  setupNotificationHandlers() {
    // App opened from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background:',
        remoteMessage.data,
      );
      this.handleNotificationData(remoteMessage.data);
    });

    // App opened from totally quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
          this.handleNotificationData(remoteMessage.data);
        }
      });
  }

  handleNotificationData(data: any) {
    if (!data) return;

    const { type, bookingId } = data;

    if (bookingId && (type === 'NEW_BOOKING' || type === 'BOOKING_CONFIRMED')) {
      navigate('BookingDetailsScreen', { bookingId });
    }
  }

  onTokenRefresh() {
    return messaging().onTokenRefresh(token => {
      console.log('FCM Token Refreshed:', token);
      this.registerTokenWithBackend(token);
    });
  }
}

export default new NotificationService();
