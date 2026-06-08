/**
 * Payment Details (Bank Details) screen styles
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const paymentDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(40),
    gap: verticalScale(20),
    alignItems: 'stretch',
  },

  cardsStack: {
    gap: verticalScale(16),
    alignSelf: 'stretch',
  },

  pageMetaText: {
    color: '#6A7282',
    textAlign: 'center',
    marginTop: verticalScale(4),
  },

  methodCard: {
    borderRadius: scale(14),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(18),
    gap: verticalScale(12),
    overflow: 'hidden',
    alignSelf: 'stretch',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  methodCardBank: {
    backgroundColor: '#155DFC',
    shadowColor: '#155DFC',
  },
  methodCardUpi: {
    backgroundColor: '#237227',
    shadowColor: '#237227',
  },
  methodCardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    minWidth: 0,
  },
  methodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  detailRow: {
    gap: verticalScale(4),
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  primaryMethodCard: {
    backgroundColor: '#155DFC',
    borderRadius: scale(14),
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  primaryMethodCardEmpty: {
    backgroundColor: '#4B5563',
    paddingVertical: verticalScale(24),
    shadowColor: '#000',
  },
  emptyCardContent: {
    paddingHorizontal: scale(20),
    gap: verticalScale(12),
  },
  emptyCardTitle: {
    color: '#FFFFFF',
  },
  emptyCardBody: {
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: scale(21),
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(21),
    flexShrink: 0,
  },
  verifiedText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(16),
    color: '#FFFFFF',
  },

  actionRow: {
    flexDirection: 'row',
    gap: scale(12),
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primaryActionButton: {
    flex: 1,
    minHeight: scale(48),
    backgroundColor: '#237227',
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryActionButtonText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryActionButton: {
    flex: 1,
    minHeight: scale(48),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryActionButtonText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#364153',
    textAlign: 'center',
  },
});

export default paymentDetailsStyles;
