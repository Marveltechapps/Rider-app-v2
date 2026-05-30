/**
 * Deposit Cash Screen Component
 * Screen for depositing cash via UPI or Net Banking
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowUpRightIcon from '../components/icons/ArrowUpRightIcon';
import BackIconSmall from '../components/icons/BackIconSmall';
import CashDepositMethodIcon from '../components/icons/CashDepositMethodIcon';
import InfoIcon from '../components/icons/InfoIcon';
import UPIIcon from '../components/icons/UPIIcon';
import { Theme } from '../constants/Theme';
import { useConfigWithDefaults } from '../contexts';
import { scale, verticalScale } from '../utils/responsive';

export default function DepositCashScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const MAX_AMOUNT = config.depositMaxAmount;
  const [amount, setAmount] = useState<string>('0');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'cash'>('upi');

  const handlePayFullAmount = () => {
    setAmount(MAX_AMOUNT.toString());
  };

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except decimal
    const numericText = text.replace(/[^0-9.]/g, '');
    
    // Parse as number and check if it exceeds max
    const numValue = parseFloat(numericText) || 0;
    if (numValue > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT.toString());
    } else {
      setAmount(numericText);
    }
  };

  const handlePay = () => {
    const amountNum = parseFloat(amount) || 0;
    if (amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to deposit.');
      return;
    }

    Alert.alert(
      'Deposit Cash',
      `Deposit ₹${amountNum.toLocaleString('en-IN')} via ${selectedMethod === 'upi' ? 'UPI Apps' : 'Cash Deposit'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Deposit request submitted successfully!');
            // Navigate to home screen to show available orders
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const amountNum = parseFloat(amount) || 0;
  const isPayButtonDisabled = amountNum <= 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <BackIconSmall size={scale(28)} color={Theme.colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text variant="h2" color={Theme.colors.textDark} style={styles.title}>
              Deposit Cash
            </Text>
          </View>
          <View style={{ width: scale(28), height: 0 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={scale(17.5)} color="#155DFC" />
          <Text variant="bodySm" color="#1447E6" style={styles.infoText}>
            Transfer the collected cash to the company account via UPI or Net Banking to clear your dues.
          </Text>
        </View>

        {/* Amount Input Section */}
        <View style={styles.amountSection}>
          <Text variant="bodySm" color={Theme.colors.textLabel} style={styles.label}>
            Amount to Deposit
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text variant="h2" color="#6B7280" style={styles.currencyPrefix}>
                ₹
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#717182"
              />
            </View>
          </View>

          <View style={styles.amountFooter}>
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.maxAmountText}>
              Maximum allowed: ₹{MAX_AMOUNT.toLocaleString('en-IN')}
            </Text>
            <Pressable onPress={handlePayFullAmount} style={styles.payFullButton}>
              <Text variant="caption" color={Theme.colors.primaryMedium} style={styles.payFullText}>
                PAY FULL AMOUNT
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentMethodSection}>
          <Text variant="bodySm" color={Theme.colors.textLabel} style={styles.label}>
            Payment Method
          </Text>

          <View style={styles.methodCardsContainer}>
            {/* UPI Apps Card */}
            <Pressable
              style={[
                styles.methodCard,
                selectedMethod === 'upi' && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod('upi')}
            >
              <View style={styles.methodIconContainer}>
                <UPIIcon size={scale(24.5)} color="#32C96A" />
                {selectedMethod === 'upi' && (
                  <View style={styles.arrowIconContainer}>
                    <ArrowUpRightIcon size={scale(7.29)} color="#32C96A" />
                  </View>
                )}
              </View>
              <Text variant="bodySm" color={selectedMethod === 'upi' ? Theme.colors.textDark : '#6B7280'} style={styles.methodText}>
                UPI Apps
              </Text>
            </Pressable>

            {/* Cash Deposit Card */}
            <Pressable
              style={[
                styles.methodCard,
                styles.methodCardDisabled,
                selectedMethod === 'cash' && styles.methodCardSelected,
              ]}
              onPress={() => {
                // Cash deposit is disabled for now
                Alert.alert('Coming Soon', 'Cash deposit option will be available soon.');
              }}
              disabled={true}
            >
              <View style={styles.methodIconContainer}>
                <CashDepositMethodIcon size={scale(24.5)} color="#6B7280" />
              </View>
              <Text variant="bodySm" color="#6B7280" style={styles.methodText}>
                Cash Deposit
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Pay Button */}
      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[
            styles.payButton,
            isPayButtonDisabled && styles.payButtonDisabled,
          ]}
          onPress={handlePay}
          disabled={isPayButtonDisabled}
        >
          <Text variant="h3" color={Theme.colors.white} style={styles.payButtonText}>
            Pay ₹{amountNum.toLocaleString('en-IN')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  header: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderGrey,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(21),
    gap: 8,
    height: scale(28),
  },
  backButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  headerSpacer: {
    width: scale(42),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100),
    gap: verticalScale(16),
  },
  infoCard: {
    flexDirection: 'row',
    gap: scale(10.5),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: scale(12.75),
  },
  infoText: {
    flex: 1,
    fontSize: scale(10),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  amountSection: {
    gap: scale(5),
  },
  label: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  inputContainer: {
    paddingVertical: scale(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    backgroundColor: '#F3F3F5',
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(8),
  },
  currencyPrefix: {
    fontSize: scale(12.25),
    lineHeight: scale(14),
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: scale(12.25),
    lineHeight: scale(14),
    fontWeight: '700',
    color: '#717182',
    padding: 0,
  },
  amountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(10),
  },
  maxAmountText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  payFullButton: {
    paddingVertical: scale(2),
  },
  payFullText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '700',
  },
  paymentMethodSection: {
    gap: scale(8),
  },
  methodCardsContainer: {
    gap: scale(0),
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    paddingVertical: scale(14),
    paddingHorizontal: scale(0),
    borderRadius: scale(8),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    backgroundColor: 'rgba(50, 201, 106, 0.05)',
    borderColor: Theme.colors.primaryMedium,
    ...Theme.shadows.small,
  },
  methodCardDisabled: {
    opacity: 0.5,
    borderColor: Theme.colors.borderGrey,
  },
  methodIconContainer: {
    width: scale(35),
    height: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowIconContainer: {
    position: 'absolute',
    top: scale(5.1),
    right: scale(5.1),
    width: scale(7.29),
    height: scale(7.29),
  },
  methodText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  bottomButtonContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(20),
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
  },
  payButton: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
    paddingVertical: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.buttonPrimary,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
});

