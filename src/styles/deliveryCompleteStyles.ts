/**
 * Delivery Complete Screen Styles
 * Pixel-perfect styles matching Figma design
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const deliveryCompleteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.primaryMedium, // #32C96A
  },
  topHeader: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: scale(21),
    paddingVertical: verticalScale(12),
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  circle1: {
    position: 'absolute',
    width: scale(224),
    height: scale(224),
    borderRadius: scale(112),
    borderWidth: scale(40),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    left: scale(-40.19),
    top: verticalScale(-90.39),
  },
  circle2: {
    position: 'absolute',
    width: scale(280),
    height: scale(280),
    borderRadius: scale(140),
    borderWidth: scale(60),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    right: scale(-40.19),
    bottom: verticalScale(-90.39),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(33),
    gap: verticalScale(24),
    width: '100%',
  },
  checkmarkContainer: {
    width: scale(84),
    height: scale(84),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: scale(84),
    height: scale(84),
    borderRadius: scale(42),
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
  },
  title: {
    fontSize: scale(26.25),
    lineHeight: scale(31.5), // 26.25 * 1.2
    fontWeight: '700',
    color: Theme.colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  earningsCard: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    padding: scale(21),
    gap: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
  earnedLabel: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: scale(0.61), // 5% of 12.25
    textTransform: 'uppercase',
    color: '#99A1AF',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(7),
  },
  amountText: {
    fontSize: scale(42),
    lineHeight: scale(42), // 42 * 1
    fontWeight: '700',
    letterSpacing: scale(-1.05), // -2.5% of 42
    color: '#101828',
  },
  divider: {
    width: '100%',
    height: scale(1),
    backgroundColor: '#F3F4F6',
  },
  incentiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incentiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
  },
  incentiveIconContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incentiveLabel: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
    color: '#4A5565',
  },
  incentiveAmount: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
    color: Theme.colors.primaryMedium,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    gap: scale(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  infoValue: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5), // 17.5 * 1.4
    fontWeight: '700',
    textAlign: 'center',
    color: Theme.colors.white,
  },
  homeButton: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  homeButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
    color: Theme.colors.primaryMedium,
  },
});

export default deliveryCompleteStyles;
