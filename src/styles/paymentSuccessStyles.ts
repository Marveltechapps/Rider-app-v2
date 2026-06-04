/**
 * Payment Verify Success Screen Styles
 * Styles for payment verification success confirmation
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const paymentSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
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
    maxWidth: scale(300),
  },

  // Summary Card
  summaryCard: {
    flexDirection: 'column',
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
  summaryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(12),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderRadius: scale(12),
  },
  summaryBadgeText: {
    fontSize: scale(10.5),
    fontWeight: '700',
    lineHeight: scale(14),
    color: '#32C96A',
  },
  summaryInfo: {
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  summaryLabel: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
  },
  summaryValue: {
    fontSize: scale(15),
    fontWeight: '400',
    lineHeight: scale(22),
    color: '#6A7282',
    fontFamily: 'Consolas',
  },
  summaryAccountLabel: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6B7280',
  },
  summaryAccountValue: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(21),
    color: '#101828',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    width: '100%',
    maxWidth: scale(360),
    paddingHorizontal: scale(21),
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

export default paymentSuccessStyles;

