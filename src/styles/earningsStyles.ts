/**
 * Earnings Screen Styles
 * Pixel-perfect styles matching Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const earningsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 12,
    paddingBottom: 12,
    gap: verticalScale(4),
  },
  tabsContainer: {
    paddingLeft: scale(16),
    paddingRight: scale(21),
    paddingTop: verticalScale(4),
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
    lineHeight: scale(24.5), // 17.5 * 1.4
    fontWeight: '700',
    color: '#101828',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(120), // Increased space for bottom tab bar to prevent overlap
    gap: scale(20),
  },
  // Total Earnings Card
  earningsCard: {
    borderRadius: scale(8),
    paddingVertical: scale(20),
    paddingHorizontal: scale(16),
    gap: scale(8),
    // Shadow: 0px 4px 6px -4px rgba(35, 114, 39, 0.2), 0px 10px 15px -3px rgba(35, 114, 39, 0.2)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  earningsLabel: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '400',
    color: '#0A0A0A',
  },
  earningsAmount: {
    fontSize: scale(31.5),
    lineHeight: scale(35), // 31.5 * 1.1111111111111112
    fontWeight: '700',
    color: '#111111',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
  },
  statItem: {
    flexDirection: 'column',
    gap: scale(4),
  },
  statLabel: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '400',
    color: '#0A0A0A',
  },
  statValue: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '700',
    color: '#111111',
  },
  // Section styles
  section: {
    gap: scale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
    color: '#101828',
  },
  sectionIcon: {
    width: scale(17.5),
    height: scale(17.5),
  },
  // Active Incentives
  incentivesList: {
    flexDirection: 'column',
    gap: scale(8),
  },
  incentiveSeparator: {
    height: scale(20),
  },
  incentiveCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
    paddingVertical: scale(20),
    paddingHorizontal: scale(16),
    gap: scale(8),
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  incentiveCardUnlocked: {
    backgroundColor: '#EFF8F4',
    borderColor: '#82FFB0',
  },
  incentiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incentiveLeft: {
    flexDirection: 'column',
    gap: scale(4),
    flex: 1,
  },
  incentiveTitle: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '400',
    color: '#101828',
  },
  incentiveSubtitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '400',
    color: '#4A5565',
  },
  incentiveReward: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '700',
    color: Theme.colors.primaryMedium,
  },
  incentiveRewardUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    flexShrink: 0,
  },
  incentiveStatus: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    color: Theme.colors.primaryMedium,
  },
  progressBarContainer: {
    width: '100%',
    height: scale(7),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(9999),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(9999),
  },
  progressText: {
    fontSize: scale(12),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    fontWeight: '400',
    color: '#6B7280',
    width: scale(85),
  },
  // Cash Out Button
  cashOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    gap: scale(16),
    // Shadow: 0px 4px 6px -4px rgba(35, 114, 39, 0.2), 0px 10px 15px -3px rgba(35, 114, 39, 0.2)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cashOutButtonText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '700',
    color: Theme.colors.white,
    textAlign: 'center',
  },
  cashOutButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Withdrawal Limit Card
  withdrawalLimitCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  withdrawalLimitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
  },
  withdrawalLimitLeft: {
    flexDirection: 'row',
    gap: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
    flex: 1,
    alignItems: 'flex-start',
  },
  withdrawalLimitIconContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: verticalScale(2), // Align with first line of text
  },
  withdrawalLimitText: {
    flexDirection: 'column',
    gap: verticalScale(4),
    flex: 1,
    minWidth: 0,
  },
  withdrawalLimitTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(20),
    color: '#101828',
  },
  withdrawalLimitSubtitle: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6A7282',
  },
  withdrawalLimitBadge: {
    flexDirection: 'row',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    borderRadius: scale(8.75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawalLimitBadgeText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(14),
    color: Theme.colors.primaryMedium,
    textAlign: 'center',
  },
  // Weekly Breakdown Card
  weeklyBreakdownCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(14),
    paddingTop: scale(16),
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
    gap: scale(20),
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  weeklyBreakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyBreakdownTitleContainer: {
    flexDirection: 'column',
    gap: scale(4),
    flex: 1,
  },
  weeklyBreakdownTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(23.63), // 15.75 * 1.5
    fontWeight: '700',
    color: '#101828',
  },
  weeklyBreakdownDate: {
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '400',
    color: '#4A5565',
  },
  calendarIconButton: {
    width: scale(44), // Increased for better touch target
    height: scale(44),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(12), // Fixed: 10 → 12 (8px spacing system)
  },
  // Payout History
  payoutSeparator: {
    height: scale(8),
  },
  payoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
    padding: scale(20),
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    flex: 1,
  },
  payoutIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(12.75),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutInfo: {
    flexDirection: 'column',
    gap: scale(4),
  },
  payoutId: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '400',
    color: '#101828',
  },
  payoutDate: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '400',
    color: '#6B7280',
  },
  payoutRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: scale(4),
  },
  payoutAmount: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontWeight: '700',
    color: '#101828',
    textAlign: 'right',
  },
  payoutStatus: {
    fontSize: scale(12),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    fontWeight: '400',
    color: Theme.colors.primaryMedium,
    textAlign: 'right',
  },
});

export default earningsStyles;

