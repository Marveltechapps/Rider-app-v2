/**
 * Profile Update Success Screen Styles
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const profileSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(24),
    gap: verticalScale(28),
  },

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

  textContainer: {
    width: '100%',
    maxWidth: scale(320),
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    width: '100%',
    maxWidth: scale(300),
  },

  summaryCard: {
    width: '100%',
    maxWidth: scale(320),
    alignItems: 'center',
    gap: verticalScale(16),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
    gap: verticalScale(4),
  },
  name: {
    textAlign: 'center',
    width: '100%',
  },
  email: {
    textAlign: 'center',
    width: '100%',
  },
  phone: {
    textAlign: 'center',
    width: '100%',
  },

  buttonContainer: {
    width: '100%',
    maxWidth: scale(320),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  primaryButton: {
    width: '100%',
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
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
  },
  secondaryButtonText: {
    color: '#32C96A',
    textAlign: 'center',
  },
});

export default profileSuccessStyles;
