/**
 * Chat Screen Styles
 * Live chat — input row (message left, send right)
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  keyboardView: {
    flex: 1,
  },

  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    gap: verticalScale(12),
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },

  messageWrapper: {
    maxWidth: '82%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  supportMessageWrapper: {
    alignSelf: 'flex-start',
  },

  messageBubble: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderRadius: scale(16),
  },
  userBubble: {
    backgroundColor: Theme.colors.primaryMedium,
    borderTopRightRadius: scale(4),
  },
  supportBubble: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: scale(4),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
  },

  userMessageText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Theme.colors.white,
  },
  supportMessageText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Theme.colors.textDark,
  },
  userTimestamp: {
    fontSize: scale(10),
    marginTop: verticalScale(4),
    color: 'rgba(255, 255, 255, 0.75)',
  },
  supportTimestamp: {
    fontSize: scale(10),
    marginTop: verticalScale(4),
    color: Theme.colors.textGrey,
  },

  inputContainer: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(12),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  textInput: {
    flex: 1,
    minHeight: scale(44),
    maxHeight: scale(120),
    fontSize: scale(14),
    lineHeight: scale(20),
    color: Theme.colors.textDark,
    backgroundColor: Theme.colors.backgroundLight,
    borderRadius: scale(22),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    textAlignVertical: 'center',
  },
  sendButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: Theme.colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.gray200,
  },
});

export default chatStyles;
