/**
 * Cash Out Success Toast Component
 * Small bottom popup showing cash out success
 * Matches Figma design exactly
 */

import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { scale, verticalScale } from '../utils/responsive';
import Text from './common/Text';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface CashOutSuccessToastProps {
  visible: boolean;
  amount: string;
  onHide: () => void;
  duration?: number;
}

export default function CashOutSuccessToast({
  visible,
  amount,
  onHide,
  duration = 3000,
}: CashOutSuccessToastProps) {
  const translateY = React.useRef(new Animated.Value(100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircleIcon size={scale(24)} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text variant="body" style={styles.title}>
            Cash Out Successful!
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            ₹{amount} will be transferred within 1-2 business days
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: verticalScale(80), // Above bottom tab bar
    left: scale(16),
    right: scale(16),
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    backgroundColor: '#237227',
    borderRadius: scale(12),
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: verticalScale(2),
  },
  title: {
    fontSize: scale(14),
    fontWeight: '700',
    lineHeight: scale(20),
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: scale(11),
    fontWeight: '400',
    lineHeight: scale(16),
    color: 'rgba(255, 255, 255, 0.9)',
  },
});






