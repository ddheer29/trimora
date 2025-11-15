import { RFValue } from 'react-native-responsive-fontsize';

const theme = {
  colors: {
    // 🎨 Primary Colors
    primary: '#F9D9D9', // Blush Pink
    primaryDark: '#B76E79', // Rose Gold
    accent: '#E6E6FA', // Lavender
    highlight: '#F08080', // Light Coral

    // 🌫️ Backgrounds & Surfaces
    background: '#FFF9F9', // App background
    card: '#FFF1F3', // Card background
    border: '#EAD7D7', // Divider/border

    // 🖤 Text Colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textDisabled: '#AAAAAA',
    textOnPrimary: '#FFFFFF',

    // 🟩 Status Colors
    success: '#B4E1C6',
    warning: '#FFF5BA',
    error: '#FFCCCC',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 999,
  },

  fonts: {
    heading: 'Poppins-Bold',
    subheading: 'Poppins-SemiBold',
    body: 'Poppins-Regular',
    light: 'Poppins-Light',
    italic: 'Poppins-Italic',
  },

  fontSizes: {
    xs: RFValue(8),
    sm: RFValue(12),
    md: RFValue(14),
    lg: RFValue(16),
    xl: RFValue(20),
    xxl: RFValue(24),
  },

  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

export default theme;
