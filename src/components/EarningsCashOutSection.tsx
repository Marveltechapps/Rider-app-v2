/**
 * Cash out button, daily limit card, and themed modals — shared across Earnings tabs
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CashOutModal from './CashOutModal';
import CashOutSuccessToast from './CashOutSuccessToast';
import ConfirmDialog from './ConfirmDialog';
import Text from './common/Text';
import CircleInfoIcon from './icons/CircleInfoIcon';
import DownloadIcon from './icons/DownloadIcon';
import { Theme } from '../constants/Theme';
import { useCashOut } from '../hooks/useCashOut';
import earningsStyles from '../styles/earningsStyles';
import { scale } from '../utils/responsive';

interface EarningsCashOutSectionProps {
  /** Amount shown on the button and in the cash-out modal */
  amount: string;
  /** Use bodySm for button label on week tab layout */
  buttonTextVariant?: 'body' | 'bodySm';
}

export default function EarningsCashOutSection({
  amount,
  buttonTextVariant = 'body',
}: EarningsCashOutSectionProps) {
  const cashOut = useCashOut(amount);

  return (
    <>
      <TouchableOpacity
        style={earningsStyles.cashOutButton}
        onPress={cashOut.handleCashOut}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Cash out ${amount} rupees`}
        accessibilityHint="Opens cash out confirmation dialog"
      >
        <DownloadIcon size={scale(14)} color={Theme.colors.white} />
        <Text
          variant={buttonTextVariant}
          color={Theme.colors.white}
          style={earningsStyles.cashOutButtonText}
        >
          Cash Out ₹{amount}
        </Text>
      </TouchableOpacity>

      <View style={earningsStyles.withdrawalLimitCard}>
        <View style={earningsStyles.withdrawalLimitContent}>
          <View style={earningsStyles.withdrawalLimitLeft}>
            <View style={earningsStyles.withdrawalLimitIconContainer}>
              <CircleInfoIcon size={scale(18)} color={Theme.colors.primaryMedium} />
            </View>
            <View style={earningsStyles.withdrawalLimitText}>
              <Text variant="bodySm" color="#101828" style={earningsStyles.withdrawalLimitTitle}>
                You can cash out only {cashOut.maxWithdrawalsPerDay} times a day
              </Text>
              <Text variant="caption" color="#6A7282" style={earningsStyles.withdrawalLimitSubtitle}>
                Daily limit resets at midnight
              </Text>
            </View>
          </View>
          <View style={earningsStyles.withdrawalLimitBadge}>
            <Text
              variant="caption"
              color={Theme.colors.primaryMedium}
              style={earningsStyles.withdrawalLimitBadgeText}
            >
              {cashOut.withdrawalsToday}/{cashOut.maxWithdrawalsPerDay} Used
            </Text>
          </View>
        </View>
      </View>

      <CashOutModal
        visible={cashOut.showCashOutModal}
        onClose={() => cashOut.setShowCashOutModal(false)}
        amount={amount}
        paymentMethod={cashOut.paymentMethodType}
        accountDetails={cashOut.accountDetails}
        onConfirm={cashOut.handleConfirmCashOut}
        withdrawalsUsed={cashOut.withdrawalsToday}
        maxWithdrawals={cashOut.maxWithdrawalsPerDay}
      />

      <CashOutSuccessToast
        visible={cashOut.showSuccessToast}
        amount={amount}
        onHide={() => cashOut.setShowSuccessToast(false)}
      />

      <ConfirmDialog
        visible={cashOut.paymentDetailsDialogVisible}
        title="Add payment details"
        message="Add your bank account or UPI ID before cashing out."
        confirmLabel="Add details"
        cancelLabel="Cancel"
        onCancel={() => cashOut.setPaymentDetailsDialogVisible(false)}
        onConfirm={() => {
          cashOut.setPaymentDetailsDialogVisible(false);
          cashOut.router.push('/update-payment-details' as any);
        }}
      />

      <ConfirmDialog
        visible={cashOut.limitReachedDialogVisible}
        title="Daily limit reached"
        message={`You have reached your daily cash out limit of ${cashOut.maxWithdrawalsPerDay} times. The limit resets at midnight.`}
        confirmLabel="OK"
        showCancel={false}
        onCancel={() => cashOut.setLimitReachedDialogVisible(false)}
        onConfirm={() => cashOut.setLimitReachedDialogVisible(false)}
      />
    </>
  );
}
