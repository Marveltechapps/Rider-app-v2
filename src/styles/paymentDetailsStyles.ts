/**
 * Payment Details Screen Styles
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const paymentDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: scale(21),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scale(17.5),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: '#101828',
  },
  headerSpacer: {
    width: scale(28),
    height: 0,
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: scale(21),
    gap: verticalScale(21),
    paddingBottom: verticalScale(40),
  },

  // Primary Method Card
  primaryMethodCard: {
    backgroundColor: '#155DFC',
    borderRadius: scale(14),
    height: scale(213.5),
    overflow: 'hidden',
    shadowColor: '#155DFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
    marginTop: verticalScale(21),
  },
  primaryMethodCardUpi: {
    backgroundColor: '#32C96A',
    shadowColor: '#32C96A',
  },
  decorativeCircle1: {
    position: 'absolute',
    right: scale(-35),
    top: scale(-35),
    width: scale(112),
    height: scale(112),
    borderRadius: scale(56),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    left: scale(-35),
    bottom: scale(-19.5),
    width: scale(84),
    height: scale(84),
    borderRadius: scale(42),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryMethodTop: {
    position: 'absolute',
    top: scale(21),
    left: scale(21),
    right: scale(21),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  primaryMethodLeft: {
    flexDirection: 'column',
    gap: verticalScale(4),
    flex: 1,
  },
  primaryMethodLabel: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#FFFFFF',
  },
  primaryMethodTitle: {
    fontSize: scale(17.5),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: '#FFFFFF',
  },
  primaryMethodIcon: {
    width: scale(28),
    height: scale(28),
  },
  primaryMethodMiddle: {
    position: 'absolute',
    top: scale(94.5),
    left: scale(21),
    right: scale(21),
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  primaryMethodFieldLabel: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    letterSpacing: 0.05,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  primaryMethodFieldValue: {
    fontSize: scale(17.5),
    fontWeight: '400',
    lineHeight: scale(24.5),
    letterSpacing: 0.1,
    color: '#FFFFFF',
    fontFamily: 'Consolas',
  },
  primaryMethodBottom: {
    position: 'absolute',
    bottom: scale(21),
    left: scale(21),
    right: scale(21),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  accountHolderSection: {
    flexDirection: 'column',
    flex: 1,
  },
  accountHolderName: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(21),
    color: '#FFFFFF',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4), // Fixed: 5.25 → 4 (8px spacing system)
    paddingHorizontal: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
    height: scale(21),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(21),
  },
  verifiedText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(14),
    color: '#FFFFFF',
    height: scale(14),
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoText: {
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#364153',
    flex: 1,
  },

  // Button Section
  buttonSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(10.5),
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: scale(44),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  changeButtonText: {
    fontSize: scale(12.25),
    fontWeight: '700',
    lineHeight: scale(17.5),
    color: '#364153',
    textAlign: 'center',
    width: scale(144),
    height: scale(18),
  },
  securityNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(8),
  },
  securityText: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#6B7280',
    width: scale(223.33),
    height: scale(14),
  },
});

export default paymentDetailsStyles;

