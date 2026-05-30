/**
 * Profile Screen Styles
 * Styles for profile screen, rider card, settings rows, and stats
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const profileStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },

  // Header styles
  header: {
    backgroundColor: Theme.colors.white,
    paddingHorizontal: scale(21),
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
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
    height: scale(28),
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(80),
  },

  // Rider card styles
  riderCard: {
    alignSelf: 'stretch',
    gap: verticalScale(14),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: Theme.colors.primaryMedium,
    borderRadius: Theme.borderRadius.md,
  },
  riderCardTop: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: scale(16),
  },
  avatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: Theme.colors.white,
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primaryLight,
  },
  avatarInitials: {
    fontSize: scale(24),
    fontWeight: '700',
    lineHeight: scale(28),
    color: Theme.colors.primaryMedium,
  },
  riderInfo: {
    flex: 1,
    gap: verticalScale(8),
    justifyContent: 'center',
  },
  riderName: {
    fontSize: scale(17.5),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: Theme.colors.textDark,
  },
  riderId: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: Theme.colors.textGrey,
  },
  riderStats: {
    flexDirection: 'row',
    gap: scale(12),
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(12),
  },
  statText: {
    fontSize: scale(12.25),
    fontWeight: '600',
    lineHeight: scale(17.5),
    color: Theme.colors.textDark,
  },

  // Contact section
  contactDivider: {
    alignSelf: 'stretch',
    height: 2,
    backgroundColor: Theme.colors.infoBoxBg,
  },
  contactSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(7),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  contactText: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: Theme.colors.textGrey,
  },

  // Settings section
  settingsSection: {
    gap: verticalScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },

  // Performance stats section
  statsSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  statsSectionTitle: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(23.625),
    color: Theme.colors.textDark,
  },
  statsGrid: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    height: verticalScale(240),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  statCard: {
    flex: 1,
    flexDirection: 'column',
    gap: verticalScale(8),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.small,
  },
  statValue: {
    fontSize: scale(21),
    fontWeight: '700',
    lineHeight: scale(31.5),
    color: Theme.colors.primaryMedium,
  },
  statLabel: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: Theme.colors.textGrey,
  },

  // Logout section
  logoutSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(24),
    paddingHorizontal: scale(16),
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(8),
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(136), // Fixed: 137 → 136 (8px spacing system)
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FFC9C9',
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.small,
  },
  logoutText: {
    fontSize: scale(12.25),
    fontWeight: '700',
    lineHeight: scale(17.5),
    color: Theme.colors.error,
    textAlign: 'center',
  },

  // Footer
  footer: {
    paddingVertical: verticalScale(8),
  },
  footerText: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: Theme.colors.textLight,
    textAlign: 'center',
  },

  // Badge styles
  verifiedBadge: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: Theme.borderRadius.lg,
    height: scale(21),
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: scale(12),
    fontWeight: '600',
    lineHeight: scale(14),
    color: Theme.colors.primaryMedium,
  },
  pendingBadge: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
    backgroundColor: '#F3F4F6',
    borderRadius: Theme.borderRadius.lg,
    height: scale(21),
    justifyContent: 'center',
  },
  pendingText: {
    fontSize: scale(12),
    fontWeight: '600',
    lineHeight: scale(14),
    color: '#6B7280',
  },
  floatingCashBadge: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: Theme.borderRadius.lg,
    height: scale(21),
    justifyContent: 'center',
  },
  floatingCashText: {
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(14),
    color: Theme.colors.primaryMedium,
  },
});

export default profileStyles;

