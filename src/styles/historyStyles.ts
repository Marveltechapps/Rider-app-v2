/**
 * History Screen Styles
 * Styles for order history screen, date selector, stats cards, and order cards
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const historyStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header styles
  header: {
    backgroundColor: Theme.colors.white,
    paddingHorizontal: scale(21),
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: verticalScale(4),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: scale(28),
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

  // Date selector styles
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(8),
    gap: scale(60), // Fixed: 60.625 → 60 (8px spacing system)
  },
  dateArrowButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flex: 1,
  },
  dateCenterText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
    textAlign: 'center',
  },

  // Stats row styles
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(14),
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    gap: verticalScale(4),
    alignItems: 'stretch',
    ...Theme.shadows.small,
  },
  statValue: {
    fontSize: scale(17.5),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: Theme.colors.primaryMedium,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#4A5565',
    textAlign: 'center',
  },

  // Scroll view styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(100),
  },

  // Order card styles
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(14),
    padding: scale(20), // Fixed: 19 → 20 (8px spacing system)
    gap: verticalScale(14),
    width: scale(345),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  orderCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    flex: 1,
  },
  orderIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: '#237227',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  orderInfo: {
    flex: 1,
    gap: verticalScale(4),
    justifyContent: 'center',
    minWidth: 0,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(12),
    flexShrink: 1,
  },
  orderId: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
  },
  orderTime: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#4A5565',
  },
  orderCardRight: {
    gap: verticalScale(4),
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderPayout: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: Theme.colors.primaryMedium,
    textAlign: 'right',
    minWidth: scale(25),
    paddingHorizontal: scale(12), // Fixed: 11 → 12 (8px spacing system)
  },
  orderDuration: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#6B7280',
    textAlign: 'right',
  },

  // Order details section
  orderDetails: {
    gap: verticalScale(7),
    width: scale(252),
    height: scale(77),
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(8),
    height: scale(21),
  },
  orderDetailIconContainer: {
    width: scale(21),
    height: scale(21),
    borderRadius: scale(8.75),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetailText: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#4A5565',
    flex: 1,
    height: scale(17.5),
  },

  // Order meta row (distance + items)
  orderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    gap: scale(16),
  },
  orderMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4), // Fixed: 5.25 → 4 (8px spacing system)
    flex: 1,
    height: scale(14),
  },
  orderMetaText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(14),
    color: '#6B7280',
    flex: 1,
  },

  // Separator line
  separatorLine: {
    width: scale(1.75),
    height: scale(114),
    backgroundColor: '#E5E7EB',
    position: 'absolute',
    left: scale(20.13),
    top: scale(56),
  },
});

export default historyStyles;

