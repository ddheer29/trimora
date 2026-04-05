import { fonts as baseFonts, typography } from './fonts';

export const colors = {
  // 🎨 Primary Colors
  primary: '#1E293B', // Deep Midnight Slate
  primaryDark: '#0F172A', // Ultra Dark Slate
  primaryLight: '#475569', // Muted Slate
  primary1: '#D4AF37', // Mapping primary1 to gold for compatibility in ResultTopBarNavigator
  accent: '#D4AF37', // Luxury Gold
  highlight: '#F59E0B', // Warm Amber
  white: '#FFFFFF',
  dark: '#0F172A',

  // 🌫️ Backgrounds & Surfaces
  background: '#F8FAFC', // Slate 50 (App background)
  card: '#FFFFFF', // Card background
  border: '#E2E8F0', // Divider/border

  // 🖤 Text Colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textDisabled: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // 🟩 Status Colors
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red 500
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
};

export const fontSizes = {
  xs: 8,
  sm: 12,
  md: 14,
  regular: 14, // Backwards compatibility for ResultTopBarNavigator
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const fonts = {
  ...typography,
  ...baseFonts,
};

// Aliasing fonts to fontFamily for component compatibility
export const fontFamily = fonts;

const theme = {
  colors,
  spacing,
  borderRadius,
  fonts,
  fontSizes,
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
