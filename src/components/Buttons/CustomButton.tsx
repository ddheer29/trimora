import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomButton = ({
  // Content props
  title = 'Button',
  titleStyle = {},
  loading = false,
  loadingColor = '#FFFFFF',

  // Style props
  style = {},
  backgroundColor = '#007AFF',
  disabledBackgroundColor = '#CCCCCC',
  textColor = '#FFFFFF',
  disabledTextColor = '#888888',

  // Size props
  height = 50,
  borderRadius = 8,
  fullWidth = true,

  // Animation props
  animated = false,

  // Function props
  onPress = () => {},

  // Other props
  testID = '',
  accessibilityLabel = '',
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (animated && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!loading) {
      onPress();
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: loading ? disabledBackgroundColor : backgroundColor,
      height,
      borderRadius,
      width: fullWidth ? SCREEN_WIDTH - 32 : undefined,
    },
    animated && { transform: [{ scale: scaleAnim }] },
    style,
  ];

  const textStyles = [
    styles.text,
    { color: loading ? disabledTextColor : textColor },
    titleStyle,
  ];

  const ButtonComponent = animated
    ? Animated.createAnimatedComponent(TouchableOpacity)
    : TouchableOpacity;

  return (
    <ButtonComponent
      style={buttonStyles}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Text style={textStyles} numberOfLines={1}>
          {title}
        </Text>
      )}
    </ButtonComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomButton;
