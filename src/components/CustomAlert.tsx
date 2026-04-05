import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import theme from '../utils/Theme';

export interface AlertOption {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  iconBgColor?: string;
  options?: AlertOption[];
  onRequestClose?: () => void;
}

const CustomAlert = ({
  visible,
  title,
  message,
  iconName,
  iconColor = theme.colors.primaryDark,
  iconBgColor = '#F1F5F9', // faint outer ring
  options = [],
  onRequestClose,
}: CustomAlertProps) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          
          {iconName && (
            <View style={[styles.haloRing, { backgroundColor: iconBgColor }]}>
              <View style={[styles.iconWrapper, { backgroundColor: iconColor }]}>
                <Ionicons name={iconName} size={28} color="#FFFFFF" />
              </View>
            </View>
          )}

          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            {options.map((option, index) => {
              const isCancel = option.style === 'cancel';
              const isDestructive = option.style === 'destructive';
              const isDefault = !isCancel && !isDestructive;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isCancel && styles.cancelButton,
                    isDestructive && styles.destructiveButton,
                    isDefault && styles.defaultButton,
                  ]}
                  onPress={option.onPress}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isCancel && styles.cancelButtonText,
                      isDestructive && styles.destructiveButtonText,
                      isDefault && styles.defaultButtonText,
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 310,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  haloRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB', // clean gray border
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  defaultButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
  },
  cancelButtonText: {
    color: '#374151',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  defaultButtonText: {
    color: '#FFFFFF',
  },
});
