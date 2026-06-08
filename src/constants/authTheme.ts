/** Shared layout + brand constants for login / OTP screens (Selorg Rider green theme). */
export const AUTH_BRAND_NAME = 'Selorg Rider';

import { Colors } from './Colors';

/** Rider auth brand color — header text, tabs, inputs, links. */
export const AUTH_PRIMARY = Colors.primaryMedium;

export const AUTH_THEME = {
  primary: AUTH_PRIMARY,
  headerBg: '#E6F0E7',
  headerBorder: '#B8D4BA',
  pageBg: Colors.backgroundLight,
  primarySoft: Colors.primaryLight,
  primaryMuted: '#9BC49E',
  primaryLight: '#D9EAD9',
  legalLink: AUTH_PRIMARY,
  checkboxBorder: '#9CA3AF',
  disabledButton: Colors.gray400,
} as const;

export const AuthLayout = {
  contentPaddingH: 21,
  headerRadius: 24,
  tabRadius: 16,
  tabPadding: 4,
  otpBoxWidth: 42,
  otpBoxHeight: 56,
  otpGap: 10.5,
  resendCooldownSec: 30,
} as const;
