import React, { ReactNode, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ViewStyle,
  TextStyle,
  ScrollViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../utils/Theme';

type CommonContainerProps = {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
  isTitleCentered?: boolean;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  customHeader?: ReactNode;
  hideHeader?: boolean;
  statusBarColor?: 'light-content' | 'dark-content';
  backgroundColor?: string;
  scrollable?: boolean;
  noPadding?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  extraScrollProps?: ScrollViewProps;
};

const CommonContainer = ({
  children,
  showBackButton = false,
  title = '',
  isTitleCentered = false,
  rightIcon,
  onRightIconPress,
  customHeader,
  hideHeader = true,
  statusBarColor = 'dark-content',
  backgroundColor = theme.colors.background,
  scrollable = false,
  noPadding = false,
  containerStyle,
  headerStyle,
  titleStyle,
  extraScrollProps = {},
}: CommonContainerProps) => {
  const navigation = useNavigation();

  const renderDefaultHeader = () => (
    <View style={[styles.header, headerStyle]}>
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <View
        style={[styles.titleContainer, isTitleCentered && styles.centerTitle]}
      >
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );

  const ContainerComponent = scrollable ? ScrollView : View;
  const containerProps = scrollable ? { ...extraScrollProps } : {};

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }, containerStyle]}
    >
      <StatusBar barStyle={statusBarColor} backgroundColor={backgroundColor} />

      {!hideHeader && (customHeader ? customHeader : renderDefaultHeader())}

      <ContainerComponent
        style={[styles.content, noPadding && { paddingHorizontal: 0 }]}
        {...containerProps}
      >
        {children}
      </ContainerComponent>
    </SafeAreaView>
  );
};

export default memo(CommonContainer);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  centerTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  rightIcon: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
