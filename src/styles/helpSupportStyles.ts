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
  liveChatButtonWrap: {
    flex: 1,
    position: 'relative',
  },
  liveChatUnreadBadge: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    minWidth: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(5),
    zIndex: 1,
  },
  liveChatUnreadText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#FFFFFF',
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
    gap: verticalScale(16),
    paddingVertical: verticalScale(20),
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
  contactList: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
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
    gap: scale(14),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
    minHeight: scale(72),
  },
  contactIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  contactInfo: {
    flexDirection: 'column',
    gap: verticalScale(4),
    flex: 1,
    minWidth: 0,
    paddingRight: scale(4),
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
  topicCardChevron: {
    flexShrink: 0,
    marginLeft: scale(8),
  },
});

export default helpSupportStyles;

