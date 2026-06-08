/**
 * Color Palette
 * Brand green aligned with logo: #237227
 */

/** Logo / primary brand green */
export const BRAND_GREEN = '#237227';
/** RGB components for rgba(...) tints */
export const BRAND_GREEN_RGB = '35, 114, 39';

export const Colors = {
  // Primary brand colors (logo green #237227)
  primary: BRAND_GREEN,
  primaryLight: '#E6F0E7',
  primaryDark: '#1B5A1F',
  primaryMedium: BRAND_GREEN,

  // Status colors
  success: BRAND_GREEN,
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Neutral scale
  black: '#000000',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F7F8FA',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic colors
  background: '#F7F8FA',
  backgroundLight: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceVariant: '#F9F9F9',
  text: '#071123',
  textDark: '#101828',
  textSecondary: '#4C4C4C',
  textTertiary: '#A5A9B5',
  textLight: '#6B7280',
  textGrey: '#4A5565',
  textLabel: '#364153',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderGrey: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  // Login / info surfaces
  infoBoxBg: `rgba(${BRAND_GREEN_RGB}, 0.1)`,
  infoBoxBorder: `rgba(${BRAND_GREEN_RGB}, 0.2)`,
};
