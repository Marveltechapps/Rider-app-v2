/**
 * Delivery Complete Screen Component
 * Success screen shown after order delivery is completed
 * Matches Figma design exactly
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import CheckmarkIcon from '../components/icons/CheckmarkIcon';
import RupeeIcon from '../components/icons/RupeeIcon';
import { Theme } from '../constants/Theme';
import deliveryCompleteStyles from '../styles/deliveryCompleteStyles';
import { scale } from '../utils/responsive';

interface DeliveryCompleteScreenProps {
  orderId?: string;
  customerName?: string;
  estimatedPayout?: string;
  incentive?: string;
  totalTime?: string;
  distance?: string;
}

export default function DeliveryCompleteScreen(props: DeliveryCompleteScreenProps = {}) {
  const router = useRouter();

  const orderId = Array.isArray(props.orderId) ? props.orderId[0] : props.orderId || 'ORD240001';
  const customerName = Array.isArray(props.customerName) ? props.customerName[0] : props.customerName || 'Rajesh';
  const estimatedPayout = Array.isArray(props.estimatedPayout) ? props.estimatedPayout[0] : props.estimatedPayout || '65';
  const incentive = Array.isArray(props.incentive) ? props.incentive[0] : props.incentive || '15';
  const totalTime = Array.isArray(props.totalTime) ? props.totalTime[0] : props.totalTime || '24m';
  const distance = Array.isArray(props.distance) ? props.distance[0] : props.distance || '4.1 km';

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
    try {
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error navigating to home:', error);
    }
  }, [router]);

  return (
    <SafeAreaView style={deliveryCompleteStyles.container} edges={['top', 'bottom']}>
      <View style={deliveryCompleteStyles.mainContainer}>
        {/* Top Header - Back to Home Button */}
        <View style={deliveryCompleteStyles.topHeader}>
          <TouchableOpacity
            style={deliveryCompleteStyles.homeButton}
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <Text variant="body" color={Theme.colors.primaryMedium} style={deliveryCompleteStyles.homeButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

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
          Great job, {customerName}!
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

          {/* Divider */}
          <View style={deliveryCompleteStyles.divider} />

          {/* Incentive Badge */}
          <View style={deliveryCompleteStyles.incentiveRow}>
            <View style={deliveryCompleteStyles.incentiveBadge}>
              <View style={deliveryCompleteStyles.incentiveIconContainer}>
                <CheckCircleIcon size={scale(14)} color={Theme.colors.primaryMedium} />
              </View>
              <Text variant="bodySm" color="#4A5565" style={deliveryCompleteStyles.incentiveLabel}>
                Incentive
              </Text>
            </View>
            <Text variant="bodySm" color={Theme.colors.primaryMedium} style={deliveryCompleteStyles.incentiveAmount}>
              + ₹{incentive}
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={deliveryCompleteStyles.infoCardsRow}>
          <View style={deliveryCompleteStyles.infoCard}>
            <Text variant="caption" color="rgba(255, 255, 255, 0.6)" style={deliveryCompleteStyles.infoLabel}>
              Total Time
            </Text>
            <Text variant="h3" color={Theme.colors.white} style={deliveryCompleteStyles.infoValue}>
              {totalTime}
            </Text>
          </View>
          <View style={deliveryCompleteStyles.infoCard}>
            <Text variant="caption" color="rgba(255, 255, 255, 0.6)" style={deliveryCompleteStyles.infoLabel}>
              Distance
            </Text>
            <Text variant="h3" color={Theme.colors.white} style={deliveryCompleteStyles.infoValue}>
              {distance}
            </Text>
          </View>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
}
