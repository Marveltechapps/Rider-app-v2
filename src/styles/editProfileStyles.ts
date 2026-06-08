/**
 * Edit Profile Screen Styles
 * Styles for Edit Profile screen
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const editProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(21),
    paddingBottom: verticalScale(1),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: '#F3F4F6',
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
    width: scale(42),
    height: 0,
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: scale(21),
    paddingBottom: verticalScale(40),
    gap: verticalScale(28),
  },

  // Profile Photo Section
  photoSection: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: verticalScale(12),
    paddingTop: verticalScale(21),
  },
  photoContainer: {
    width: scale(112),
    height: scale(112),
    borderRadius: scale(56), // Round shape
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#9EFFC2',
    backgroundColor: '#FFFFFF',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(24),
    backgroundColor: Theme.colors.gray200, // Secondary button background
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    // No shadow for secondary buttons
  },
  uploadButtonText: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
    color: Theme.colors.primary, // Secondary button text color
    textAlign: 'center',
  },
  photoLabel: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(17.5),
    color: '#6A7282',
    textAlign: 'center',
  },

  // Form Container
  formContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(12),
  },

  // Save Button
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    backgroundColor: '#237227',
    borderRadius: scale(8),
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginTop: verticalScale(16),
  },
  saveButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  submitErrorBanner: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    backgroundColor: '#FEE2E2',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: verticalScale(4),
  },
  submitErrorText: {
    fontSize: scale(13),
    lineHeight: scale(18),
    color: '#B91C1C',
    textAlign: 'center',
  },
});

export default editProfileStyles;

