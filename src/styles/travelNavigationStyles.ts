/**
 * Travel / customer navigation screens — map + non-overlapping footer.
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { centeredIconButton } from './iconButtonStyles';
import { scale, verticalScale } from '../utils/responsive';

const travelNavigationStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mapSection: {
    flex: 1,
    minHeight: verticalScale(220),
    backgroundColor: Theme.colors.gray200,
    position: 'relative',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  journeyBanner: {
    position: 'absolute',
    left: scale(16),
    right: scale(16),
    bottom: scale(12),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(14),
    gap: scale(4),
    ...Theme.shadows.medium,
  },
  journeyRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(4),
  },
  journeyDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  journeyLine: {
    flex: 1,
    height: 2,
    backgroundColor: Theme.colors.borderGrey,
    marginHorizontal: scale(4),
  },
  footer: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: scale(21),
    borderTopRightRadius: scale(21),
    ...Theme.shadows.large,
  },
  destinationCard: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(12),
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  destinationInfo: {
    flex: 1,
    minWidth: 0,
    gap: scale(4),
  },
  destinationActions: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  destinationCallButton: {
    ...centeredIconButton(48),
    backgroundColor: Theme.colors.primaryMedium,
  },
  destinationCallIconInner: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    paddingVertical: scale(12),
    borderRadius: scale(12),
    backgroundColor: Theme.colors.primaryMedium,
  },
  arrivalActionSection: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    alignItems: 'center',
  },
  arrivalActionWrap: {
    width: '100%',
    maxWidth: scale(340),
    alignItems: 'center',
  },
  arrivalPrimaryButton: {
    width: '100%',
  },
  arrivalTooltip: {
    width: '100%',
    marginBottom: scale(10),
    backgroundColor: Theme.colors.textDark,
    borderRadius: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(14),
    ...Theme.shadows.medium,
  },
  arrivalTooltipText: {
    textAlign: 'center',
    color: Theme.colors.white,
  },
});

export default travelNavigationStyles;
