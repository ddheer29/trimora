export const fonts = {
  black: 'Poppins-Black',
  extraBold: 'Poppins-ExtraBold',
  bold: 'Poppins-Bold',
  semiBold: 'Poppins-SemiBold',
  medium: 'Poppins-Medium',
  regular: 'Poppins-Regular',
  light: 'Poppins-Light',
  extraLight: 'Poppins-ExtraLight',
  thin: 'Poppins-Thin',
  italic: 'Poppins-Italic',
} as const;

export type FontType = keyof typeof fonts;

export const typography = {
  heading: fonts.bold,
  subheading: fonts.semiBold,
  body: fonts.regular,
  light: fonts.light,
  italic: fonts.italic,
} as const;
