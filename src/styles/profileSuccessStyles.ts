/**
 * Profile Update Success Screen Styles
 * Styles for profile update success confirmation
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const profileSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    gap: verticalScale(32),
  },

  // Success Icon
  successIconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#32C96A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#32C96A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  // Text Container
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(8),
  },
  title: {
    fontSize: scale(28),
    fontWeight: '700',
    lineHeight: scale(36),
    color: '#101828',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(21),
    color: '#6A7282',
    textAlign: 'center',
    maxWidth: scale(280),
  },

  // Summary Card
  summaryCard: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(16),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    maxWidth: scale(320),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: 3,
    borderColor: '#32C96A',
  },
  avatarPlaceholder: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: '#32C96A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#32C96A',
  },
  initials: {
    fontSize: scale(28),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(4),
  },
  name: {
    fontSize: scale(18),
    fontWeight: '700',
    lineHeight: scale(24),
    color: '#101828',
    textAlign: 'center',
  },
  email: {
    fontSize: scale(13),
    fontWeight: '400',
    lineHeight: scale(18),
    color: '#6A7282',
    textAlign: 'center',
  },
  phone: {
    fontSize: scale(13),
    fontWeight: '400',
    lineHeight: scale(18),
    color: '#6A7282',
    textAlign: 'center',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    width: '100%',
    maxWidth: scale(320),
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    backgroundColor: '#32C96A',
    borderRadius: scale(8),
    shadowColor: '#32C96A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
  },
  secondaryButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    lineHeight: scale(21),
    color: '#32C96A',
    textAlign: 'center',
  },
});

export default profileSuccessStyles;

