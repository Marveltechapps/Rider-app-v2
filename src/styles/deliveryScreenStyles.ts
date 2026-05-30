/**
 * Delivery Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const deliveryScreenStyles = StyleSheet.create({
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
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  etaBadge: {
    position: 'absolute',
    top: verticalScale(15),
    right: scale(16),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
    gap: scale(4),
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
  sheetContent: {
    flex: 1,
  },
  sheetContentContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(100),
    gap: verticalScale(12),
  },
  customerInfoSection: {
    flexDirection: 'row',
    gap: scale(12),
    alignItems: 'flex-start',
    width: '100%',
  },
  customerAvatarContainer: {
    width: scale(49),
    height: scale(49),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
    gap: scale(4),
    marginRight: scale(8),
  },
  customerName: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  customerAddress: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  callButton: {
    width: scale(48),
    height: scale(48),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
    flexShrink: 0,
  },
  orderInfoCards: {
    flexDirection: 'row',
    gap: scale(12),
  },
  orderInfoCard: {
    flex: 1,
    padding: scale(12),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(8),
    gap: scale(4),
  },
  orderInfoLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  orderInfoValue: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '400',
    fontFamily: 'Consolas',
  },
  orderInfoValueBold: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
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
});

export default deliveryScreenStyles;
