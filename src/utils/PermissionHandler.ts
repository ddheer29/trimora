import { Platform } from 'react-native';
import {
  check,
  request,
  RESULTS,
  PERMISSIONS,
  requestNotifications,
} from 'react-native-permissions';

export const requestMissingPermissions = async () => {
  const permissions =
    Platform.OS === 'ios'
      ? [
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.PHOTO_LIBRARY,
          // Notifications handled separately below
        ]
      : [
          PERMISSIONS.ANDROID.CAMERA,
          Number(Platform.Version) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          'android.permission.POST_NOTIFICATIONS' as any,
        ];

  for (const permission of permissions) {
    try {
      const status = await check(permission);

      if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
        const res = await request(permission);
        console.log(`Requested ${permission} → ${res}`);
      } else {
        console.log(`Already granted: ${permission}`);
      }
    } catch (err) {
      console.warn('Error requesting permission:', permission, err);
    }
  }

  try {
    const { status } = await requestNotifications(['alert', 'sound', 'badge']);
    console.log('Notification permission status:', status);
  } catch (e) {
    console.warn('Notification permission request failed:', e);
  }
};
