/**
 * Payment FAQ Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const paymentFAQStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
  },
  faqsContainer: {
    flexDirection: 'column',
    gap: verticalScale(12),
  },
  faqCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  faqQuestionText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(20),
    flex: 1,
  },
  chevronContainer: {
    transform: [{ rotate: '-90deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    paddingTop: 0,
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(16),
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
  },
  faqAnswerText: {
    fontSize: scale(13),
    fontWeight: '400',
    lineHeight: scale(20),
  },
});

export default paymentFAQStyles;


