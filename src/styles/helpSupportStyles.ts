/**
 * Help & Support Screen Styles
 * Styles for Help & Support screen
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const helpSupportStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: scale(21),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
    gap: verticalScale(28),
  },

  // Quick Action Buttons
  quickActions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: scale(12),
  },
  liveChatButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: '#32C96A',
    borderRadius: scale(8),
    shadowColor: '#32C96A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    minHeight: scale(100),
  },
  liveChatText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    backgroundColor: '#FB2C36',
    borderRadius: scale(8),
    shadowColor: '#FB2C36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    minHeight: scale(100),
  },
  emergencyIcon: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIconText: {
    fontSize: scale(20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emergencyText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Contact Support Section
  contactSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
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
  sectionTitle: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24),
    color: '#101828',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(16),
    paddingHorizontal: scale(14),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12.75),
    height: scale(42),
  },
  contactIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'column',
    gap: verticalScale(1.75),
    flex: 1,
  },
  contactLabel: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
  },
  contactValue: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#6A7282',
  },

  // Browse Help Topics Section
  topicsSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(16),
  },
  topicCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: verticalScale(16),
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
  topicCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  topicIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(12.75),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flexDirection: 'column',
    gap: verticalScale(1.75),
    flex: 1,
  },
  topicTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: '#101828',
  },
  topicDescription: {
    fontSize: scale(10.5),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#6A7282',
  },
  topicCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    width: scale(48.05),
    height: scale(17.5),
  },
  articleCount: {
    flexDirection: 'column',
    paddingTop: verticalScale(1.75),
    paddingHorizontal: scale(8.75),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(100),
    flex: 1,
    height: scale(17.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleCountText: {
    fontSize: scale(10.5),
    fontWeight: '700',
    lineHeight: scale(14),
    color: '#4A5565',
    textAlign: 'center',
  },
});

export default helpSupportStyles;

