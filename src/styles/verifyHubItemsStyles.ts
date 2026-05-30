/**
 * Verify Hub Items Screen Styles
 * Pixel-perfect styles matching Figma design
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const verifyHubItemsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: Theme.colors.white,
    paddingBottom: verticalScale(12),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10.5),
    width: '100%',
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(12),
  },
  progressBarContainer: {
    flex: 1,
    height: scale(7),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(9999),
    overflow: 'hidden',
    minWidth: 0, // Allow flex to shrink if needed
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#32C96A',
    borderRadius: scale(9999),
  },
  progressText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
    color: '#6A7282',
    flexShrink: 0, // Prevent text from shrinking
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    gap: scale(10.5),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    paddingHorizontal: scale(14),
    paddingVertical: scale(0),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: scale(56),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    width: scale(21),
    height: scale(21),
    borderRadius: scale(6.75),
    borderWidth: 2,
    borderColor: '#D1D5DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#32C96A',
    backgroundColor: '#32C96A',
  },
  itemName: {
    flex: 1,
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
    color: '#364153',
  },
  quantityPill: {
    paddingVertical: scale(3.5),
    paddingHorizontal: scale(7),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(6.75),
    minWidth: scale(25.86),
    height: scale(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '700',
    color: '#4A5565',
  },
  bottomButtonContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(0),
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  bottomButton: {
    width: '100%',
    height: scale(56),
    backgroundColor: '#32C96A',
    borderRadius: scale(9999),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    position: 'relative',
    overflow: 'hidden',
  },
  bottomButtonDisabled: {
    opacity: 0.5,
  },
  bottomButtonLeftCircle: {
    position: 'absolute',
    left: 0,
    width: scale(56),
    height: scale(56),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    color: Theme.colors.white,
    opacity: 0.9,
  },
  bottomButtonRightIcon: {
    position: 'absolute',
    right: scale(3.5),
    width: scale(49),
    height: scale(49),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(24.5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default verifyHubItemsStyles;

