/**
 * Chat Screen Styles
 * Modern chat interface styles
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

  // Messages Container
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    gap: verticalScale(12),
  },

  // Agent Info Card
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    marginBottom: verticalScale(8),
  },
  agentAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  agentName: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(21),
  },
  agentStatus: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(17.5),
  },

  // Message Wrapper
  messageWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
  },

  // Message Bubble
  messageBubble: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderRadius: scale(16),
    gap: verticalScale(4),
  },
  messageBubbleSupport: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: scale(4),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
  },
  messageBubbleUser: {
    backgroundColor: Theme.colors.primaryMedium,
    borderTopRightRadius: scale(4),
  },

  // Message Text
  messageText: {
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(20),
  },
  messageTextSupport: {
    color: Theme.colors.textDark,
  },
  messageTextUser: {
    color: Theme.colors.white,
  },

  // Message Time
  messageTime: {
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(14),
    marginTop: verticalScale(2),
  },
  messageTimeSupport: {
    color: Theme.colors.textGrey,
  },
  messageTimeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: verticalScale(4),
  },
  typingDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: Theme.colors.textGrey,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },

  // Input Container
  inputContainer: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: scale(12),
    backgroundColor: Theme.colors.backgroundLight,
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    minHeight: scale(48),
    maxHeight: scale(120),
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(20),
    color: Theme.colors.textDark,
    paddingVertical: verticalScale(8),
    maxHeight: scale(104),
  },
  sendButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: Theme.colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.gray200,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default chatStyles;


