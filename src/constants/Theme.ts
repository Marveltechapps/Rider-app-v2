/**
 * Theme Configuration
 * Typography, Spacing, Border Radius, Shadows
 * Extracted from Figma design system
 */

import { Colors } from './Colors';

export const Theme = {
  colors: Colors,

  typography: {
    display: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
      fontFamily: 'Inter-Bold',
    },
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38.4,
      fontFamily: 'Inter-Bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 28.8,
      fontFamily: 'Inter-SemiBold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 24,
      fontFamily: 'Inter-SemiBold',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 21,
      fontFamily: 'Inter-Regular',
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 18,
      fontFamily: 'Inter-Medium',
    },
    // Splash screen specific typography
    splashTitle: {
      fontSize: 26.25,
      fontWeight: '700' as const,
      lineHeight: 31.5,
      fontFamily: 'Inter-Bold',
    },
    splashSubtitle: {
      fontSize: 12.25,
      fontWeight: '700' as const,
      lineHeight: 17.5,
      fontFamily: 'Inter-Bold',
      letterSpacing: 0.5,
    },
    splashCaption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 21,
      fontFamily: 'Inter-Regular',
      letterSpacing: 2.5,
    },
    // Login screen specific typography
    loginTitle: {
      fontSize: 21,
      fontWeight: '700' as const,
      lineHeight: 28,
      fontFamily: 'Inter-Bold',
    },
    loginSubtitle: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 21,
      fontFamily: 'Inter-Regular',
    },
    loginLabel: {
      fontSize: 14,
      fontWeight: '700' as const,
      lineHeight: 21,
      fontFamily: 'Inter-Bold',
    },
    loginInput: {
      fontSize: 12.25,
      fontWeight: '400' as const,
      lineHeight: 14.1,
      fontFamily: 'Inter-Regular',
    },
    loginInfo: {
      fontSize: 12.25,
      fontWeight: '400' as const,
      lineHeight: 17.5,
      fontFamily: 'Inter-Regular',
    },
    loginButton: {
      fontSize: 15.75,
      fontWeight: '700' as const,
      lineHeight: 24.5,
      fontFamily: 'Inter-Bold',
    },
    loginTerms: {
      fontSize: 12.25,
      fontWeight: '400' as const,
      lineHeight: 17.5,
      fontFamily: 'Inter-Regular',
    },
    loginSkip: {
      fontSize: 10.5,
      fontWeight: '400' as const,
      lineHeight: 14,
      fontFamily: 'Inter-Regular',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    round: 9999,
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    // Splash screen icon shadow
    iconGlow: {
      shadowColor: '#32C96A',
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.3,
      shadowRadius: 50,
      elevation: 12,
    },
    // Login button shadow
    buttonPrimary: {
      shadowColor: '#32C96A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};

// Type exports
export type ColorKey = keyof typeof Colors;
export type TypographyVariant = keyof typeof Theme.typography;
export type SpacingScale = keyof typeof Theme.spacing;

