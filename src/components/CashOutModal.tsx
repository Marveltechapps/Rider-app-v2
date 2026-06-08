/**
 * Cash Out Modal Component
 * Bottom sheet modal for cash out confirmation
 * Responsive and matches design system
 */

import React, { useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { hp, scale, verticalScale } from '../utils/responsive';
import Text from './common/Text';
import CheckmarkSmallGreenIcon from './icons/CheckmarkSmallGreenIcon';
import DownloadIcon from './icons/DownloadIcon';
import InfoIcon from './icons/InfoIcon';

interface CashOutModalProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  paymentMethod: 'bank' | 'upi';
  accountDetails: string;
  onConfirm: () => void;
  withdrawalsUsed: number;
  maxWithdrawals: number;
}

export default function CashOutModal({
  visible,
  onClose,
  amount,
  paymentMethod,
  accountDetails,
  onConfirm,
  withdrawalsUsed,
  maxWithdrawals,
}: CashOutModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const isLimitReached = withdrawalsUsed >= maxWithdrawals;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              {/* Handle Bar */}
              <View style={styles.handleBar} />

              {/* Header */}
              <View style={styles.header}>
                <Text variant="h2" color="#101828" style={styles.title}>
                  Cash Out
                </Text>
              </View>

              {/* Amount Section */}
              <View style={styles.amountSection}>
                <Text variant="bodySm" color="#6A7282" style={styles.amountLabel}>
                  Amount to withdraw
                </Text>
                <Text variant="h1" color="#237227" style={styles.amount}>
                  ₹{amount}
                </Text>
              </View>

              {/* Payment Method Section */}
              <View style={styles.paymentSection}>
                <Text variant="bodySm" color="#6A7282" style={styles.sectionLabel}>
                  Payment Method
                </Text>
                <View style={styles.paymentCard}>
                  <View style={styles.paymentLeft}>
                    <View style={styles.paymentIconContainer}>
                      <CheckmarkSmallGreenIcon size={scale(12)} />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text variant="body" color="#101828" style={styles.paymentType}>
                        {paymentMethod === 'bank' ? 'Bank Account' : 'UPI Transfer'}
                      </Text>
                      <Text variant="caption" color="#6A7282" style={styles.paymentDetails}>
                        {accountDetails}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.verifiedPill}>
                    <Text variant="caption" color="#237227" style={styles.verifiedText}>
                      Primary
                    </Text>
                  </View>
                </View>
              </View>

              {/* Warning/Info */}
              {!isLimitReached && (
                <View style={styles.infoCard}>
                  <InfoIcon size={scale(16)} color="#FF6900" />
                  <Text variant="caption" color="#364153" style={styles.infoText}>
                    Withdrawals remaining today: {maxWithdrawals - withdrawalsUsed}/{maxWithdrawals}
                  </Text>
                </View>
              )}

              {isLimitReached && (
                <View style={styles.errorCard}>
                  <InfoIcon size={scale(16)} color="#FB2C36" />
                  <Text variant="caption" color="#364153" style={styles.infoText}>
                    Daily limit reached. Resets at midnight.
                  </Text>
                </View>
              )}

              {/* Processing Time Info */}
              <View style={styles.processingInfo}>
                <Text variant="caption" color="#6B7280" style={styles.processingText}>
                  • Processing time: 1-2 business days
                </Text>
                <Text variant="caption" color="#6B7280" style={styles.processingText}>
                  • No transaction fees
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, isLimitReached && styles.confirmButtonDisabled]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                  disabled={isLimitReached}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm cash out"
                  accessibilityHint={isLimitReached ? "Daily limit reached" : "Confirm withdrawal to your payment method"}
                  accessibilityState={{ disabled: isLimitReached }}
                >
                  <DownloadIcon size={scale(14)} color="#FFFFFF" />
                  <Text variant="body" style={styles.confirmButtonText}>
                    Confirm Cash Out
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel cash out"
                >
                  <Text variant="body" style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(20),
    maxHeight: hp(80),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    width: scale(40),
    height: scale(4),
    backgroundColor: '#E5E7EB',
    borderRadius: scale(2),
    alignSelf: 'center',
    marginBottom: verticalScale(16),
  },
  header: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scale(20),
    fontWeight: '700',
    lineHeight: scale(28),
    color: '#101828',
    textAlign: 'center',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
    paddingVertical: verticalScale(16),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
  },
  amountLabel: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6A7282',
    marginBottom: verticalScale(8),
  },
  amount: {
    fontSize: scale(36),
    fontWeight: '700',
    lineHeight: scale(44),
    color: '#237227',
  },
  paymentSection: {
    marginBottom: verticalScale(16),
  },
  sectionLabel: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6A7282',
    marginBottom: verticalScale(8),
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  paymentIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'column',
    gap: verticalScale(2),
    flex: 1,
  },
  paymentType: {
    fontSize: scale(14),
    fontWeight: '600',
    lineHeight: scale(20),
    color: '#101828',
  },
  paymentDetails: {
    fontSize: scale(11),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#6A7282',
  },
  verifiedPill: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    borderRadius: scale(12),
  },
  verifiedText: {
    fontSize: scale(10),
    fontWeight: '700',
    lineHeight: scale(14),
    color: '#237227',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFE4C4',
    borderRadius: scale(12),
    marginBottom: verticalScale(16),
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: scale(12),
    marginBottom: verticalScale(16),
  },
  infoText: {
    flex: 1,
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#364153',
  },
  processingInfo: {
    marginBottom: verticalScale(20),
    gap: verticalScale(6),
  },
  processingText: {
    fontSize: scale(11),
    fontWeight: '400',
    lineHeight: scale(16),
    color: '#6B7280',
  },
  buttonContainer: {
    gap: verticalScale(12),
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    backgroundColor: '#237227',
    borderRadius: scale(12),
    shadowColor: '#237227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(22),
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    lineHeight: scale(20),
    color: '#6A7282',
  },
});

