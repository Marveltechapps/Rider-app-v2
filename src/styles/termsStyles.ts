/**
 * Terms and Conditions Screen Styles
 * Styles for Terms & Conditions screen
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const termsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  headerSpacer: {
    width: scale(28),
    height: 0,
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: 0,
    paddingBottom: verticalScale(40),
  },

  // Update info
  updateInfo: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#F0F9FF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  updateText: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6A7282',
  },

  // Sections
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24),
    color: '#101828',
    marginBottom: verticalScale(12),
  },
  paragraph: {
    fontSize: scale(13),
    fontWeight: '400',
    lineHeight: scale(20),
    color: '#364153',
    marginBottom: verticalScale(12),
  },

  // Bullet lists
  bulletList: {
    marginTop: verticalScale(8),
    gap: verticalScale(8),
  },
  bulletPoint: {
    fontSize: scale(13),
    fontWeight: '400',
    lineHeight: scale(20),
    color: '#364153',
    paddingLeft: scale(8),
  },

  // Contact section
  contactSection: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(32),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactText: {
    fontSize: scale(14),
    fontWeight: '600',
    lineHeight: scale(21),
    color: '#32C96A',
    marginTop: verticalScale(8),
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  footerText: {
    fontSize: scale(11),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default termsStyles;

