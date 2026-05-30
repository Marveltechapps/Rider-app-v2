/**
 * Handover Order Screen Component
 * Screen for verifying OTP, collecting payment, and completing delivery
 * Matches Figma design exactly
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Text from '../components/common/Text';
import CallIcon from '../components/icons/CallIcon';
import CameraIcon from '../components/icons/CameraIcon';
import CashIcon from '../components/icons/CashIcon';
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import QRIcon from '../components/icons/QRIcon';
import RightArrowIcon from '../components/icons/RightArrowIcon';
import RupeeIcon from '../components/icons/RupeeIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import handoverOrderStyles from '../styles/handoverOrderStyles';
import { scale } from '../utils/responsive';
import SwipeToAccept from '../components/SwipeToAccept';
import { getOrder, markCodCollected, getUpiIntent, uploadDeliveryProofPhoto, deliverOrder, sendDeliveryOtp, verifyDeliveryOtp, type BackendOrder } from '../api/orders';

interface HandoverOrderScreenProps {
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  estimatedPayout?: string;
  items?: string;
}

export default function HandoverOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const isMountedRef = useRef(true);
  const otpInputRef = useRef<TextInput>(null);

  // Extract params
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : (params.orderId as string) || '';
  const fallbackCustomerName = Array.isArray(params.customerName) ? params.customerName[0] : (params.customerName as string) || 'Customer';
  const fallbackCustomerPhone = Array.isArray(params.customerPhone) ? params.customerPhone[0] : (params.customerPhone as string) || '';
  const fallbackEstimatedPayout = Array.isArray(params.estimatedPayout) ? params.estimatedPayout[0] : (params.estimatedPayout as string) || '0';
  const itemsParam = Array.isArray(params.items) ? params.items[0] : (params.items as string | undefined);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const [busyAction, setBusyAction] = useState<'qr' | 'cash' | 'photo' | 'deliver' | 'sendOtp' | 'verifyOtp' | null>(null);

  const { data: orderRes, isLoading: orderLoading, refetch: refetchOrder } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId && orderId.length > 10,
  });

  const order: BackendOrder | undefined = orderRes?.order;
  const backendPhone = order?.customerPhoneNumber ? order.customerPhoneNumber.replace(/\D/g, '') : '';
  const customerName = fallbackCustomerName;
  const customerPhone = backendPhone ? `+91 ${backendPhone}` : fallbackCustomerPhone;
  const fallbackOtpDigits = fallbackCustomerPhone ? fallbackCustomerPhone.replace(/\D/g, '').slice(-10) : '';
  const otpTargetDigits = backendPhone || fallbackOtpDigits;
  const orderItems = order?.items ?? [];
  const totalItems = itemsParam ? parseInt(itemsParam, 10) : orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const paymentMethod = (order?.payment?.method || 'cod') as NonNullable<BackendOrder['payment']>['method'];
  const paymentStatus = (order?.payment?.status || 'pending') as NonNullable<BackendOrder['payment']>['status'];
  const orderTotalRaw = order?.pricing?.total ?? order?.payment?.amount ?? 0;
  const orderTotal = Number.isFinite(Number(orderTotalRaw)) ? Number(orderTotalRaw) : 0;
  const payableAmount = orderTotal;

  // Some backends may label online-paid orders as COD but with 0 collectible amount.
  // Treat COD as "collectable" only when there is a positive amount to collect.
  const isCollectableCod = paymentMethod === 'cod' && orderTotal > 0;
  const isPaid = paymentStatus === 'completed';
  const showPaidOnly = isPaid && !isCollectableCod;
  const canProceed = otpVerified && isPaid;

  useEffect(() => {
    isMountedRef.current = true;
    console.log('HandoverOrderScreen - Received params:', params);
    
    // Request camera permissions on mount
    (async () => {
      if (!isMountedRef.current) return;
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted' && isMountedRef.current) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take delivery photos.',
          [{ text: 'OK' }]
        );
      }
    })();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [params]);

  const handleBack = useCallback(() => {
    if (!isMountedRef.current) return;
    try {
      router.back();
    } catch (error) {
      console.error('Error handling back press:', error);
    }
  }, [router]);

  const handleCallCustomer = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      console.log('Call customer');
      const dial = customerPhone.replace(/\D/g, '');
      const url = `tel:${dial}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen && isMountedRef.current) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening phone dialer:', error);
    }
  }, [customerPhone]);

  const handleOtpChange = useCallback((text: string) => {
    if (!isMountedRef.current) return;
    // Only allow numeric input, max 4 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
    setOtp(numericText);
    setOtpError(false);
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      setBusyAction('sendOtp');
      const res = await sendDeliveryOtp(orderId, otpTargetDigits ? { mobileNumber: otpTargetDigits } : undefined);
      if (isMountedRef.current) {
        const to = otpTargetDigits ? `+91 ${otpTargetDigits}` : 'the customer’s phone number';
        const expiry = typeof res?.expiresInSec === 'number' ? `\nValid for ${Math.round(res.expiresInSec / 60)} minutes.` : '';
        Alert.alert('OTP Sent', `OTP was sent to ${to}.${expiry}`);
      }
    } catch (e: any) {
      Alert.alert('Unable to send OTP', e?.message || 'Please try again.');
    } finally {
      if (isMountedRef.current) setBusyAction(null);
    }
  }, [orderId, otpTargetDigits]);

  const handleVerifyOtp = useCallback(async (otpValue: string) => {
    if (!isMountedRef.current || !orderId) return;
    if (otpValue.length !== 4) return;
    try {
      setBusyAction('verifyOtp');
      const res = await verifyDeliveryOtp(orderId, otpValue);
      if (!isMountedRef.current) return;
      if (res.verified) {
        setOtpVerified(true);
        setOtpError(false);
      } else {
        setOtpVerified(false);
        setOtpError(true);
      }
    } catch (e: any) {
      if (!isMountedRef.current) return;
      setOtpVerified(false);
      setOtpError(true);
    } finally {
      if (isMountedRef.current) setBusyAction(null);
    }
  }, [orderId]);

  // Auto-verify OTP when 4 digits entered
  useEffect(() => {
    if (otp.length === 4 && orderId) {
      handleVerifyOtp(otp);
    } else {
      setOtpError(false);
      setOtpVerified(false);
    }
  }, [otp, orderId, handleVerifyOtp]);

  const handleShowQR = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      setBusyAction('qr');
      const res = await getUpiIntent(orderId);
      const canOpen = await Linking.canOpenURL(res.upiUri);
      if (canOpen) {
        await Linking.openURL(res.upiUri);
      } else {
        Alert.alert('UPI not available', 'No UPI app found to open this payment link.');
      }
    } catch (e: any) {
      Alert.alert('Unable to show QR', e?.message || 'Please try again.');
    } finally {
      setBusyAction(null);
    }
  }, [orderId]);

  const handleCashCollected = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      setBusyAction('cash');
      await markCodCollected(orderId);
      await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      await refetchOrder();
    } catch (e: any) {
      Alert.alert('Unable to update payment', e?.message || 'Please try again.');
    } finally {
      setBusyAction(null);
    }
  }, [orderId, queryClient, refetchOrder]);

  const handleTakePhoto = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      // Check camera permissions
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      
      if (status !== 'granted') {
        // Request permission
        const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (newStatus !== 'granted' && isMountedRef.current) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take delivery photos. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });
      
      if (!result.canceled && isMountedRef.current && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        setHasPhoto(true);
        setUploadedPhotoUrl(null);
        console.log('Photo captured:', asset.uri);

        // Upload immediately so delivery can be completed with a URL proof.
        setBusyAction('photo');
        const uploadRes = await uploadDeliveryProofPhoto(orderId, { uri: asset.uri, name: 'delivery-proof.jpg', type: 'image/jpeg' });
        if (isMountedRef.current) {
          setUploadedPhotoUrl(uploadRes.url);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      if (isMountedRef.current) {
        Alert.alert(
          'Error',
          'Failed to take photo. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
    finally {
      if (isMountedRef.current) setBusyAction(null);
    }
  }, []);

  const handleDeliver = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      setBusyAction('deliver');
      const proof =
        uploadedPhotoUrl
          ? { type: 'photo' as const, value: uploadedPhotoUrl }
          : otp
            ? { type: 'otp' as const, value: otp }
            : undefined;
      await deliverOrder(orderId, proof);
      router.replace({
        pathname: '/delivery-complete',
        params: {
          orderId,
          customerName: String(customerName || 'Customer').split(' ')[0],
          estimatedPayout: String(order?.pricing?.deliveryFee ?? fallbackEstimatedPayout),
          incentive: '0',
          totalTime: '—',
          distance: '—',
        },
      });
    } catch (e: any) {
      Alert.alert('Delivery failed', e?.message || 'Please try again.');
    } finally {
      setBusyAction(null);
    }
  }, [customerName, fallbackEstimatedPayout, order?.pricing?.deliveryFee, orderId, otp, router, uploadedPhotoUrl]);

  const handleOtpBoxPress = useCallback((index: number) => {
    if (!isMountedRef.current) return;
    // Focus on the next empty box or the box that was clicked
    const targetIndex = otp.length < 4 ? otp.length : index;
    setFocusedOtpIndex(targetIndex);
    otpInputRef.current?.focus();
  }, [otp.length]);

  const renderOtpBox = (index: number) => {
    const digit = otp[index] || '';
    const isFocused = focusedOtpIndex === index || (focusedOtpIndex === null && index === otp.length);
    const isLast = index === 3;

    return (
      <TouchableOpacity
        key={index}
        style={[
          handoverOrderStyles.otpInputBox,
          isLast && handoverOrderStyles.otpInputBoxLast,
          isFocused && handoverOrderStyles.otpInputBoxFocused,
        ]}
        onPress={() => handleOtpBoxPress(index)}
        activeOpacity={0.7}
      >
        <Text variant="body" color="#101828" style={handoverOrderStyles.otpInputText}>
          {digit}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={handoverOrderStyles.orderItem}>
      <Text variant="bodySm" color="#101828" style={handoverOrderStyles.orderItemName}>
        {item.productName || item.skuId}
      </Text>
      <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.orderItemQuantity}>
        x{item.quantity}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={handoverOrderStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Handover Order"
        subtitle="Verify OTP to complete delivery"
        onBack={handleBack}
      />

      {/* Content */}
      <ScrollView
        style={handoverOrderStyles.content}
        contentContainerStyle={{ gap: scale(24) }}
        showsVerticalScrollIndicator={false}
      >
        {orderLoading ? (
          <View style={{ paddingVertical: scale(12), alignItems: 'center' }}>
            <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
          </View>
        ) : null}

        {/* Customer Card */}
        <View style={handoverOrderStyles.customerCard}>
          <View style={handoverOrderStyles.customerAvatarContainer}>
            <CustomerAvatarIcon
              size={scale(28)}
              color={Theme.colors.primaryMedium}
            />
          </View>
          <View style={handoverOrderStyles.customerInfo}>
            <Text variant="h3" color="#101828" style={handoverOrderStyles.customerName}>
              {customerName}
            </Text>
            <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.customerPhone}>
              {customerPhone}
            </Text>
          </View>
          <TouchableOpacity
            style={handoverOrderStyles.callButton}
            onPress={handleCallCustomer}
            activeOpacity={0.8}
          >
            <CallIcon size={scale(16)} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* OTP Section */}
        <View style={handoverOrderStyles.otpSection}>
          <View style={handoverOrderStyles.otpSectionHeader}>
            <View style={handoverOrderStyles.otpTitleRow}>
              <Text variant="h3" color="#101828" style={handoverOrderStyles.otpSectionTitle}>
                Enter Delivery OTP
              </Text>
              <TouchableOpacity
                style={handoverOrderStyles.sendOtpButton}
                onPress={handleSendOtp}
                activeOpacity={0.8}
                disabled={busyAction === 'sendOtp' || otpTargetDigits.length !== 10}
              >
                <Text variant="bodySm" color="#0A0A0A" style={handoverOrderStyles.sendOtpButtonText}>
                  {busyAction === 'sendOtp' ? 'Sending…' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.otpSectionSubtitle}>
              Ask customer for 4-digit OTP
            </Text>
          </View>
          <View style={handoverOrderStyles.otpInputContainer}>
            {[0, 1, 2, 3].map(renderOtpBox)}
          </View>
          {/* Hidden TextInput for OTP */}
          <TextInput
            ref={otpInputRef}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={4}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            onFocus={() => setFocusedOtpIndex(otp.length)}
            onBlur={() => setFocusedOtpIndex(null)}
          />
          {/* Error Banner */}
          {otpError && (
            <View style={handoverOrderStyles.otpErrorBanner}>
              <View style={handoverOrderStyles.otpErrorIcon}>
                <Text variant="caption" color={Theme.colors.white} style={handoverOrderStyles.otpErrorIconText}>
                  ✕
                </Text>
              </View>
              <Text variant="bodySm" color="#E7000B" style={handoverOrderStyles.otpErrorText}>
                Invalid OTP. Please try again.
              </Text>
            </View>
          )}
        </View>

        {/* Payment Details Section */}
        <View style={handoverOrderStyles.paymentSection}>
          <View style={handoverOrderStyles.paymentSectionHeader}>
            <Text variant="h3" color="#101828" style={handoverOrderStyles.paymentSectionTitle}>
              Payment Details
            </Text>
          </View>
          <View style={handoverOrderStyles.paymentCard}>
            {showPaidOnly ? (
              <View style={handoverOrderStyles.paymentPaidOnlyRow}>
                <View
                  style={[
                    handoverOrderStyles.paymentStatusBadge,
                    handoverOrderStyles.paymentStatusBadgePaid,
                  ]}
                >
                  <Text
                    variant="caption"
                    color="#32C96A"
                    style={[
                      handoverOrderStyles.paymentStatusText,
                      handoverOrderStyles.paymentStatusTextPaid,
                    ]}
                  >
                    PAID
                  </Text>
                </View>
              </View>
            ) : isCollectableCod ? (
              <>
                <View style={handoverOrderStyles.paymentAmountRow}>
                  <View style={handoverOrderStyles.paymentAmountLeft}>
                    <Text variant="caption" color="#6A7282" style={handoverOrderStyles.paymentAmountLabel}>
                      Amount to Collect
                    </Text>
                    <View style={handoverOrderStyles.paymentAmountValue}>
                      <RupeeIcon size={scale(17.5)} color="#101828" />
                      <Text variant="h2" color="#101828" style={handoverOrderStyles.paymentAmountText}>
                        {orderTotal}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      handoverOrderStyles.paymentStatusBadge,
                      paymentStatus === 'pending'
                        ? handoverOrderStyles.paymentStatusBadgePending
                        : handoverOrderStyles.paymentStatusBadgePaid,
                    ]}
                  >
                    <Text
                      variant="caption"
                      color={paymentStatus === 'pending' ? '#F54900' : '#32C96A'}
                      style={[
                        handoverOrderStyles.paymentStatusText,
                        paymentStatus === 'pending'
                          ? handoverOrderStyles.paymentStatusTextPending
                          : handoverOrderStyles.paymentStatusTextPaid,
                      ]}
                    >
                      {paymentStatus === 'pending' ? 'PENDING' : 'PAID'}
                    </Text>
                  </View>
                </View>
                <View style={handoverOrderStyles.paymentButtonsRow}>
                  <TouchableOpacity
                    style={handoverOrderStyles.showQRButton}
                    onPress={handleShowQR}
                    activeOpacity={0.7}
                    disabled={busyAction === 'qr'}
                  >
                    <QRIcon size={scale(14)} color="#0A0A0A" />
                    <Text variant="bodySm" color="#0A0A0A" style={handoverOrderStyles.showQRButtonText}>
                      {busyAction === 'qr' ? 'Loading…' : 'Show QR'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={handoverOrderStyles.cashCollectedButton}
                    onPress={handleCashCollected}
                    activeOpacity={0.8}
                    disabled={busyAction === 'cash' || paymentStatus === 'completed'}
                  >
                    <CashIcon size={scale(14)} color={Theme.colors.white} />
                    <Text variant="bodySm" color={Theme.colors.white} style={handoverOrderStyles.cashCollectedButtonText}>
                      {paymentStatus === 'completed' ? 'Collected' : busyAction === 'cash' ? 'Saving…' : 'Cash Collected'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={handoverOrderStyles.paymentPrepaidRow}>
                  <View style={handoverOrderStyles.paymentPrepaidLeft}>
                    <Text variant="caption" color="#6A7282" style={handoverOrderStyles.paymentPrepaidLabel}>
                      Order Amount
                    </Text>
                    <View style={handoverOrderStyles.paymentPrepaidValue}>
                      <RupeeIcon size={scale(14)} color="#101828" />
                      <Text variant="body" color="#101828" style={handoverOrderStyles.paymentPrepaidText}>
                        {payableAmount}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={handoverOrderStyles.paymentPrepaidStatusRow}>
                  <Text variant="caption" color="#6A7282" style={handoverOrderStyles.paymentPrepaidStatusLabel}>
                    Payment Status
                  </Text>
                  <View style={handoverOrderStyles.paymentPrepaidStatusBadge}>
                    <View style={handoverOrderStyles.paymentPrepaidStatusDot} />
                    <Text variant="caption" color="#32C96A" style={handoverOrderStyles.paymentPrepaidStatusText}>
                      {paymentStatus === 'completed' ? 'PAID ONLINE' : 'PENDING'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Delivery Proof Section */}
        <View style={handoverOrderStyles.deliveryProofSection}>
          <Text variant="h3" color="#101828" style={handoverOrderStyles.deliveryProofTitle}>
            Delivery Proof
          </Text>
          <TouchableOpacity
            style={[
              handoverOrderStyles.deliveryProofCard,
              hasPhoto && handoverOrderStyles.deliveryProofCardWithPhoto,
            ]}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            {hasPhoto && photoUri ? (
              <>
                <Image
                  source={{ uri: photoUri }}
                  style={handoverOrderStyles.deliveryProofPhoto}
                  resizeMode="cover"
                />
                <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.deliveryProofText}>
                  Photo captured
                </Text>
              </>
            ) : (
              <>
                <View style={handoverOrderStyles.deliveryProofIcon}>
                  <CameraIcon size={scale(21)} color="#6A7282" />
                </View>
                <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.deliveryProofText}>
                  Tap to take photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Order Items Section */}
        <View style={handoverOrderStyles.itemsSection}>
          <Text variant="h3" color="#101828" style={handoverOrderStyles.itemsTitle}>
            Order Items ({totalItems})
          </Text>
          <View style={handoverOrderStyles.itemsCard}>
            <FlatList
              data={orderItems}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => (item as any)._id ?? `${(item as any).skuId ?? 'item'}-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={handoverOrderStyles.orderItemSeparator} />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={handoverOrderStyles.bottomButtonContainer}>
        <SwipeToAccept
          label={busyAction === 'deliver' ? 'Delivering…' : isCollectableCod ? 'Collect Payment to Deliver' : 'Swipe to Deliver'}
          onAccepted={handleDeliver}
          threshold={0.8}
          disabled={!canProceed || busyAction != null}
        />
      </View>
    </SafeAreaView>
  );
}

