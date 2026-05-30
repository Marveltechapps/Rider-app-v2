/**
 * Accepted Order Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const acceptedOrderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  topBackButton: {
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    width: scale(44),
    height: scale(44),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  mapContainer: {
    width: '100%',
    flex: 1,
    minHeight: verticalScale(300),
    backgroundColor: Theme.colors.gray200,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hubMarker: {
    position: 'absolute',
    top: verticalScale(84),
    right: scale(69),
    width: scale(42),
    height: scale(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubMarkerImage: {
    width: scale(42),
    height: scale(42),
  },
  riderMarker: {
    position: 'absolute',
    top: verticalScale(125.5),
    left: scale(195.5),
    width: scale(49),
    height: scale(49),
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderMarkerPulse: {
    position: 'absolute',
    width: scale(76.12),
    height: scale(76.12),
    borderRadius: scale(38.06),
    backgroundColor: 'rgba(50, 201, 106, 0.2)',
    opacity: 0.91,
  },
  riderMarkerLabel: {
    position: 'absolute',
    top: verticalScale(-35),
    left: scale(-11.69),
    backgroundColor: '#000000',
    borderRadius: scale(8.75),
    paddingVertical: scale(4), // Fixed: 3.5 → 4 (8px spacing system)
    paddingHorizontal: scale(8), // Fixed: 7 → 8 (8px spacing system)
  },
  riderMarkerText: {
    fontSize: scale(12),
    lineHeight: scale(15),
    fontWeight: '700',
  },
  riderMarkerImage: {
    width: scale(49),
    height: scale(49),
  },
  locationButton: {
    position: 'absolute',
    top: verticalScale(76),
    left: scale(16),
    width: scale(44),
    height: scale(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: scale(22),
    ...Theme.shadows.medium,
    zIndex: 20,
  },
  locationButtonImage: {
    width: scale(17.5),
    height: scale(17.5),
  },
  etaBadge: {
    position: 'absolute',
    top: verticalScale(15),
    right: scale(16),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
    gap: scale(4), // Fixed: 2 → 4 (8px spacing system)
    ...Theme.shadows.small,
  },
  etaLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  etaTime: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: scale(21),
    borderTopRightRadius: scale(21),
    ...Theme.shadows.large,
  },
  sheetHandle: {
    width: '100%',
    alignItems: 'center',
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(12),
  },
  sheetHandleImage: {
    width: scale(42),
    height: scale(5.25),
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(100),
    gap: verticalScale(12),
  },
  hubInfoSection: {
    flexDirection: 'row',
    gap: scale(12),
    alignItems: 'flex-start',
    width: '100%',
  },
  hubIconContainer: {
    width: scale(49),
    height: scale(49),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubIcon: {
    width: scale(24.5),
    height: scale(24.5),
  },
  hubInfo: {
    flex: 1,
    gap: scale(4),
    marginRight: scale(8), // Add margin to prevent overlap with call button
  },
  hubName: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  hubAddress: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  dispatchBayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: scale(0),
    paddingHorizontal: scale(12), // Fixed: 10.5 → 12 (8px spacing system)
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderRadius: scale(9999),
    alignSelf: 'flex-start',
    height: scale(28),
  },
  dispatchBayIcon: {
    width: scale(14),
    height: scale(14),
  },
  dispatchBayText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  callButton: {
    width: scale(49),
    height: scale(49),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(24.5),
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
    flexShrink: 0, // Prevent button from shrinking
  },
  callButtonImage: {
    width: scale(24.5),
    height: scale(24.5),
  },
  orderIdSection: {
    padding: scale(12),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(8),
    gap: scale(4),
  },
  orderIdLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  orderIdValue: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '400',
    fontFamily: 'Consolas',
  },
  itemsSection: {
    gap: scale(12),
  },
  itemsTitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderGrey,
  },
  orderItemName: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
    textAlign: 'right',
  },
  orderItemSeparator: {
    height: 0,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(12),
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButton: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(9999),
    height: scale(56),
    overflow: 'hidden',
  },
  swipeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  swipeButtonOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(9999),
  },
  swipeButtonCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    zIndex: 1,
  },
  swipeButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    color: Theme.colors.white,
  },
  swipeArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeButtonCircleContainer: {
    position: 'absolute',
    left: scale(3.5),
    top: scale(3.5),
    zIndex: 2,
  },
  swipeButtonCircle: {
    width: scale(49),
    height: scale(49),
    borderRadius: scale(24.5),
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  swipeButtonCircleImage: {
    width: scale(21),
    height: scale(17.5),
    opacity: 0.5, // Match Figma icon opacity
  },
});

export default acceptedOrderStyles;

