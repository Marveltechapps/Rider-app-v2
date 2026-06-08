/**
 * Payment Issues Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const paymentIssuesStyles = StyleSheet.create({
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
  topicsContainer: {
    flexDirection: 'column',
    gap: verticalScale(12),
  },
  topicCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  topicCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  topicIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flexDirection: 'column',
    gap: verticalScale(4),
    flex: 1,
  },
  topicTitle: {
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(22),
  },
  topicDescription: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(17),
  },
});

export default paymentIssuesStyles;


