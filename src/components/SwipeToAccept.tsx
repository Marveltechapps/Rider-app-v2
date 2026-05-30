/**
 * SwipeToAccept Component
 * Reusable swipe-to-accept slider component
 * Matches Figma design: width 315px, height 56px
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Theme } from '../constants/Theme';
import { scale } from '../utils/responsive';
import SwipeArrowIcon from './icons/SwipeArrowIcon';

export interface SwipeToAcceptProps {
  /** Label text to display (default: "Swipe to Accept") */
  label?: string;
  /** Callback when swipe threshold is reached */
  onAccepted: () => void;
  /** Custom track style */
  trackStyle?: ViewStyle;
  /** Custom thumb style */
  thumbStyle?: ViewStyle;
  /** Threshold percentage (0-1) to trigger accept (default: 0.8) */
  threshold?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
  /**
   * Auto-reset slider back to start after a successful swipe.
   * Keeps the UI usable when navigating away and coming back to the same screen instance.
   */
  autoResetMs?: number;
  /** Variant: "default" = green track, "light" = white track (call/attention style) */
  variant?: 'default' | 'light';
}

const CIRCLE_SIZE = 49;
const CIRCLE_PADDING = 3.5;
const BUTTON_HEIGHT = 56;
const DEFAULT_THRESHOLD = 0.8; // 80%

export default function SwipeToAccept({
  label = 'Swipe to Accept',
  onAccepted,
  trackStyle,
  thumbStyle,
  threshold = DEFAULT_THRESHOLD,
  disabled = false,
  autoResetMs = 500,
  variant = 'default',
}: SwipeToAcceptProps) {
  const isLight = variant === 'light';
  const trackBg = isLight ? '#FFFFFF' : Theme.colors.primaryMedium;
  const trackBorderColor = isLight ? Theme.colors.borderGrey : 'transparent';
  const textColor = isLight ? Theme.colors.textDark : Theme.colors.white;
  const thumbIconColor = isLight ? Theme.colors.primaryMedium : Theme.colors.primaryMedium;
  const translateX = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  const isAccepted = useSharedValue(false);
  const isDragging = useSharedValue(false);
  const isMountedRef = useRef(true);

  // Reset position when component mounts or becomes enabled
  useEffect(() => {
    isMountedRef.current = true;
    translateX.value = 0;
    isAccepted.value = false;
    isDragging.value = false;

    return () => {
      isMountedRef.current = false;
    };
  }, [disabled]);

  // Safe callback wrapper to prevent crashes
  const handleAccepted = useCallback(() => {
    if (!isMountedRef.current || isAccepted.value) {
      return;
    }

    try {
      isAccepted.value = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Brief delay so success haptic/state is visible; navigation is deferred by caller via InteractionManager
      setTimeout(() => {
        if (isMountedRef.current) {
          onAccepted();
        }
      }, 150);

      // Important: auto-reset so coming "back" doesn't leave the slider stuck in accepted state.
      if (autoResetMs >= 0) {
        setTimeout(() => {
          if (!isMountedRef.current) return;
          translateX.value = withTiming(0, { duration: 220 });
          isAccepted.value = false;
          isDragging.value = false;
        }, autoResetMs);
      }
    } catch (error) {
      console.error('Error in handleAccepted:', error);
      // Still call onAccepted even if haptics fail
      if (isMountedRef.current) {
        onAccepted();
      }
    }
  }, [autoResetMs, onAccepted]);

  const panGesture = Gesture.Pan()
    // Note: `.enabled()` is not reactive to shared values; gate in callbacks instead.
    .enabled(!disabled)
    // Be permissive enough to work inside ScrollViews while still preferring horizontal intent.
    .activeOffsetX([10, Infinity])
    .failOffsetY([-60, 60])
    .minDistance(10)
    .onStart(() => {
      if (disabled || isAccepted.value || !isMountedRef.current) return;
      
      try {
        isDragging.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Silently handle haptic errors
        isDragging.value = true;
      }
    })
    .onUpdate((event) => {
      if (disabled || isAccepted.value || !isMountedRef.current) {
        translateX.value = 0;
        return;
      }

      // Constrain movement between 0 and maxTranslate
      try {
        const maxTranslate = trackWidth.value - CIRCLE_SIZE - CIRCLE_PADDING * 2;
        if (maxTranslate > 0 && event.translationX >= 0) {
          translateX.value = Math.max(0, Math.min(maxTranslate, event.translationX));
        }
      } catch (error) {
        // Silently handle any errors
        translateX.value = 0;
      }
    })
    .onEnd((event) => {
      if (!isMountedRef.current) {
        translateX.value = 0;
        return;
      }
      
      try {
        isDragging.value = false;
        
        if (disabled || isAccepted.value) {
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });
          return;
        }

        const maxTranslate = trackWidth.value - CIRCLE_SIZE - CIRCLE_PADDING * 2;
        if (maxTranslate <= 0) {
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });
          return;
        }

        const swipeProgress = translateX.value / maxTranslate;

        // Check if threshold is reached (default 80%)
        if (swipeProgress >= threshold || event.velocityX > 600) {
          // Animate to the end
          translateX.value = withSpring(maxTranslate, {
            damping: 15,
            stiffness: 150,
          }, () => {
            if (isMountedRef.current) {
              runOnJS(handleAccepted)();
            }
          });
        } else {
          // Spring back to start
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });
        }
      } catch (error) {
        // Reset on any error
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  // Allow the swipe gesture to cooperate with native scroll gestures.
  // This avoids the "dead swipe" feeling when the finger has slight vertical drift.
  const composedGesture = Gesture.Simultaneous(panGesture, Gesture.Native());

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const progress = translateX.value / (trackWidth.value || 1);
    return {
      opacity: withTiming(isLight ? 0.1 + progress * 0.25 : 0.2 + progress * 0.3, { duration: 100 }),
      width: withTiming(CIRCLE_SIZE + CIRCLE_PADDING * 2 + translateX.value, { duration: 100 }),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const progress = translateX.value / (trackWidth.value || 1);
    // Light: fade to more visible; default: fade as before
    const startOpacity = isLight ? 0.7 : 0.569;
    const endOpacity = isLight ? 0.4 : 0.27;
    return {
      opacity: withTiming(startOpacity - progress * (startOpacity - endOpacity), { duration: 100 }),
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          {
            backgroundColor: trackBg,
            borderWidth: isLight ? 1 : 0,
            borderColor: trackBorderColor,
            borderRadius: scale(9999),
            height: scale(BUTTON_HEIGHT),
            width: '100%',
            maxWidth: scale(315), // Match Figma design max width
            overflow: 'hidden',
          },
          trackStyle,
        ]}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (width > 0) {
            trackWidth.value = width;
          }
        }}
        collapsable={false}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Swipeable circle - starts on LEFT */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: scale(CIRCLE_PADDING),
                top: scale(CIRCLE_PADDING),
                zIndex: 2,
              },
              circleAnimatedStyle,
            ]}
            pointerEvents="box-none"
          >
            <View
              style={[
                {
                  width: scale(CIRCLE_SIZE),
                  height: scale(CIRCLE_SIZE),
                  borderRadius: scale(24.5),
                  backgroundColor: Theme.colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...Theme.shadows.small,
                },
                thumbStyle,
              ]}
              pointerEvents="none"
            >
              <SwipeArrowIcon size={scale(21)} color={thumbIconColor} />
            </View>
          </Animated.View>

          {/* Progress overlay */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                backgroundColor: isLight ? 'rgba(50, 201, 106, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: scale(9999),
              },
              overlayAnimatedStyle,
            ]}
          />

          {/* Center text */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
            pointerEvents="none"
          >
            <Animated.Text
              style={[
                {
                  fontSize: scale(15.75),
                  lineHeight: scale(24.5),
                  fontWeight: '700',
                  color: textColor,
                  fontFamily: 'Arial', // Match Figma font
                },
                textAnimatedStyle,
              ]}
            >
              {label}
            </Animated.Text>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

