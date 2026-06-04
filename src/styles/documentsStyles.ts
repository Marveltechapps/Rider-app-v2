/**
 * Documents Screen Styles
 * Styles for My Documents and Document Status Detail screens
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const documentsStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header styles
  header: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(16),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scale(17.5),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: '#101828',
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: verticalScale(0), // 20px top padding below header
    paddingBottom: verticalScale(100),
  },

  // Document status card (green)
  statusCard: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(8),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: '#32C96A',
    borderRadius: scale(8),
    shadowColor: '#32C96A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(8),
  },
  statusCardIcon: {
    width: scale(21),
    height: scale(21),
  },
  statusCardTitle: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: '#FFFFFF',
    flex: 1,
  },
  statusCounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(68), // Fixed: 66.59 → 68 (8px spacing system)
  },
  statusCountItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  statusCountText: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(21),
    color: '#FFFFFF',
  },
  statusCardHeadline: {
    fontSize: scale(16),
    fontWeight: '700',
    lineHeight: scale(22),
    color: '#FFFFFF',
  },
  statusSummaryGrid: {
    alignSelf: 'stretch',
    gap: verticalScale(6),
    marginTop: verticalScale(4),
  },
  statusSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSummaryLabel: {
    fontSize: scale(12),
    color: 'rgba(255, 255, 255, 0.85)',
  },
  statusSummaryValue: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    alignSelf: 'stretch',
    height: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: scale(100),
    overflow: 'hidden',
    marginTop: verticalScale(8),
  },
  progressBarFill: {
    height: scale(8),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(100),
    minWidth: 0,
  },
  progressPercentLabel: {
    fontSize: scale(12),
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: verticalScale(4),
  },

  // Document list section
  documentsSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(14),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    height: verticalScale(766),
  },

  // Document card
  documentCard: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  documentCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: scale(76), // Fixed: 76.296875 → 76 (8px spacing system)
  },
  documentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
    flex: 1,
    height: scale(42),
  },
  documentIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(12.75),
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flexDirection: 'column',
    gap: verticalScale(4),
    flex: 1,
    minWidth: 0, // Allows text to shrink properly
  },
  documentName: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
  },
  documentUpdated: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#6B7280',
    flexShrink: 1, // Allows text to shrink if needed
  },
  documentFileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(100), // Fixed: 98.765625 → 100 (8px spacing system)
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(8),
  },
  documentFileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flex: 1,
    height: scale(17.5),
  },
  documentFileName: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#4A5565',
    flex: 1,
  },

  // Status badges
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4), // Fixed: 5.25 → 4 (8px spacing system)
    paddingHorizontal: scale(8), // Fixed: 8.75 → 8 (8px spacing system)
    height: scale(21),
    borderRadius: scale(100),
    justifyContent: 'center',
  },
  statusBadgeVerified: {
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    minWidth: scale(72),
  },
  statusBadgePending: {
    backgroundColor: '#FFF7ED',
    minWidth: scale(72),
  },
  statusBadgeExpired: {
    backgroundColor: '#FEF2F2',
    minWidth: scale(72),
  },
  statusBadgeUnderReview: {
    backgroundColor: 'rgba(21, 93, 252, 0.1)',
    minWidth: scale(88),
    paddingHorizontal: scale(8),
  },
  statusBadgeRejected: {
    backgroundColor: '#FEF2F2',
    minWidth: scale(72),
  },
  statusBadgeIcon: {
    width: scale(10.5),
    height: scale(10.5),
  },
  statusBadgeText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(14),
    textTransform: 'capitalize',
    height: scale(14),
  },
  statusTextVerified: {
    color: '#32C96A',
  },
  statusTextPending: {
    color: '#FF6900',
  },
  statusTextExpired: {
    color: '#FB2C36',
  },
  statusTextUnderReview: {
    color: '#155DFC',
  },
  statusTextRejected: {
    color: '#FB2C36',
  },

  // Segmented control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8),
    padding: scale(4),
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
  },
  segment: {
    flex: 1,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#32C96A',
  },
  segmentInactive: {
    backgroundColor: 'transparent',
  },
  segmentText: {
    fontSize: scale(12.25),
    fontWeight: '600',
    lineHeight: scale(17.5),
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    color: '#4A5565',
  },

  // Empty state
  emptyState: {
    paddingVertical: verticalScale(60),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  emptyStateText: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(21),
    color: '#4A5565',
    textAlign: 'center',
  },

  // Info section
  infoSection: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#F0F9FF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
    marginBottom: verticalScale(8),
  },
  infoText: {
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#4A5565',
    marginBottom: verticalScale(6),
  },
});

export default documentsStyles;

