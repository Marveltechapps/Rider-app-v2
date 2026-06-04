/**
 * Delivery Complete Screen Component
 * Success screen shown after order delivery is completed
 * Matches Figma design exactly
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, BackHandler, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import Text from '../components/common/Text';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import CheckmarkIcon from '../components/icons/CheckmarkIcon';
import RupeeIcon from '../components/icons/RupeeIcon';
import { Theme } from '../constants/Theme';
import { clearActiveOrderCache, useActiveOrder } from '../hooks/useActiveOrder';
import deliveryCompleteStyles from '../styles/deliveryCompleteStyles';
import { getOrderDistanceLabel } from '../utils/fleetMapCoords';
import { goBackOrReplace } from '../utils/navigation/safeBack';
import { scale, verticalScale } from '../utils/responsive';

interface DeliveryCompleteScreenProps {
  orderId?: string;
  estimatedPayout?: string;
  distance?: string;
}

export default function DeliveryCompleteScreen(props: DeliveryCompleteScreenProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const orderId = Array.isArray(props.orderId) ? props.orderId[0] : props.orderId || '';
  const { order, isLoading } = useActiveOrder(orderId);

  const estimatedPayout =
    order?.estimatedPayout ??
    order?.pricing?.deliveryFee ??
    (props.estimatedPayout ? parseFloat(String(props.estimatedPayout)) : 0);
  const distance = getOrderDistanceLabel(order) || props.distance || '';
  const etaMinutes = order?.metadata?.etaMinutes;
  const totalTime = etaMinutes ? `${etaMinutes}m` : '';

  // Animation values for checkmark
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate circle appearing
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After circle appears, animate checkmark
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.spring(checkmarkScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkOpacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [scaleAnim, opacityAnim, checkmarkScaleAnim, checkmarkOpacityAnim]);

  const handleBackToHome = useCallback(() => {
    if (orderId) {
      clearActiveOrderCache(queryClient, orderId);
    }
    try {
      goBackOrReplace(router, '/(tabs)');
    } catch {
      router.replace('/(tabs)');
    }
  }, [router, queryClient, orderId]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackToHome();
      return true;
    });
    return () => sub.remove();
  }, [handleBackToHome]);

  return (
    <SafeAreaView style={deliveryCompleteStyles.container} edges={['top', 'bottom']}>
      <View style={deliveryCompleteStyles.mainContainer}>
        {/* Decorative Background Circles */}
        <View style={deliveryCompleteStyles.backgroundCircles}>
          <View style={deliveryCompleteStyles.circle1} />
          <View style={deliveryCompleteStyles.circle2} />
        </View>

        {/* Main Content */}
        <View style={deliveryCompleteStyles.content}>
        {/* Success Checkmark Icon */}
        <View style={deliveryCompleteStyles.checkmarkContainer}>
          <Animated.View
            style={[
              deliveryCompleteStyles.checkmarkCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ scale: checkmarkScaleAnim }],
                opacity: checkmarkOpacityAnim,
              }}
            >
              <CheckmarkIcon size={scale(42)} color={Theme.colors.primaryMedium} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Title */}
        <Text variant="h1" color={Theme.colors.white} style={deliveryCompleteStyles.title}>
          Order Delivered!
        </Text>

        {/* Subtitle */}
        <Text variant="body" color="rgba(255, 255, 255, 0.8)" style={deliveryCompleteStyles.subtitle}>
          {isLoading ? 'Loading…' : `Order ${order?.orderNumber || orderId} completed`}
        </Text>

        {/* Earnings Card */}
        <View style={deliveryCompleteStyles.earningsCard}>
          {/* You Earned Label */}
          <Text variant="caption" color="#99A1AF" style={deliveryCompleteStyles.earnedLabel}>
            YOU EARNED
          </Text>

          {/* Amount */}
          <View style={deliveryCompleteStyles.amountRow}>
            <RupeeIcon size={scale(28)} color="#101828" />
            <Text variant="h1" color="#101828" style={deliveryCompleteStyles.amountText}>
              {estimatedPayout}
            </Text>
          </View>

          {/* Incentive Badge — only when backend provides incentive data */}
          {order?.pricing?.discount ? (
            <>
              <View style={deliveryCompleteStyles.divider} />
              <View style={deliveryCompleteStyles.incentiveRow}>
                <View style={deliveryCompleteStyles.incentiveBadge}>
                  <View style={deliveryCompleteStyles.incentiveIconContainer}>
                    <CheckCircleIcon size={scale(14)} color={Theme.colors.primaryMedium} />
                  </View>
                  <Text variant="bodySm" color="#4A5565" style={deliveryCompleteStyles.incentiveLabel}>
                    Discount applied
                  </Text>
                </View>
                <Text variant="bodySm" color={Theme.colors.primaryMedium} style={deliveryCompleteStyles.incentiveAmount}>
                  ₹{order.pricing.discount}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* Info Cards */}
        {(totalTime || distance) ? (
        <View style={deliveryCompleteStyles.infoCardsRow}>
          {totalTime ? (
          <View style={deliveryCompleteStyles.infoCard}>
            <Text variant="caption" color="rgba(255, 255, 255, 0.6)" style={deliveryCompleteStyles.infoLabel}>
              ETA
            </Text>
            <Text variant="h3" color={Theme.colors.white} style={deliveryCompleteStyles.infoValue}>
              {totalTime}
            </Text>
          </View>
          ) : null}
          {distance ? (
          <View style={deliveryCompleteStyles.infoCard}>
            <Text variant="caption" color="rgba(255, 255, 255, 0.6)" style={deliveryCompleteStyles.infoLabel}>
              Distance
            </Text>
            <Text variant="h3" color={Theme.colors.white} style={deliveryCompleteStyles.infoValue}>
              {distance}
            </Text>
          </View>
          ) : null}
        </View>
        ) : null}
      </View>

        <View
          style={[
            deliveryCompleteStyles.bottomFooter,
            { paddingBottom: Math.max(insets.bottom, verticalScale(12)) },
          ]}
        >
          <TouchableOpacity
            style={deliveryCompleteStyles.homeButton}
            onPress={handleBackToHome}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <Text variant="body" color={Theme.colors.primaryMedium} style={deliveryCompleteStyles.homeButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
