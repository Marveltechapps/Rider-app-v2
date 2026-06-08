/**
 * Update Payment Details Screen Styles
 * Matches Figma design exactly
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';

const updatePaymentStyles = StyleSheet.create({
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
    gap: scale(39.03125),
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
    paddingTop: 20,
    paddingHorizontal: scale(21),
    gap: verticalScale(20),
    alignItems: 'stretch',
    paddingBottom: verticalScale(96),
  },

  // Tab Container
  tabContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(24),
    paddingTop: verticalScale(12),
  },
  formPanel: {
    flexDirection: 'column',
    gap: verticalScale(14),
    alignSelf: 'stretch',
    width: '100%',
  },
  formContent: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(16),
  },

  ifscHelpLink: {
    alignSelf: 'flex-start',
    marginTop: verticalScale(-8),
  },
  ifscHelpLinkText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyUpiButton: {
    alignSelf: 'stretch',
    minHeight: scale(40),
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  verifyUpiButtonText: {
    fontWeight: '700',
    color: '#237227',
    textAlign: 'center',
  },

  // Verification Note
  verificationNote: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#237227',
  },

  // Save Button
  submitErrorBanner: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: scale(12),
  },
  submitErrorText: {
    textAlign: 'center',
    lineHeight: scale(20),
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(20),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(16),
    backgroundColor: '#237227',
    borderRadius: scale(8),
    height: scale(42),
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginTop: verticalScale(7),
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
    flexShrink: 1,
  },
});

export default updatePaymentStyles;

