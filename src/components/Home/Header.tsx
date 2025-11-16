import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../../utils/Theme';
import { useUserStore } from '@/store/userStore';

const Header = () => {
  const { user } = useUserStore();
  return (
    <View style={styles.headerWrapper}>
      <View>
        <Text style={styles.greeting}>{user?.name}</Text>
        <Text style={styles.subtitle}>Welcome to Timora</Text>
      </View>
      <Image
        source={{
          uri: user?.userImage,
        }}
        style={styles.avatar}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
  },
});

export default Header;
