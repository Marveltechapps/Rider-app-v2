/**
 * Shared cash-out flow for Earnings tabs (today, week, month)
 */

import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConfigWithDefaults } from '../contexts';
import { usePayment } from '../contexts/PaymentContext';
import { getEarningsSummary, requestPayout } from '../api/payouts';

export function useCashOut(displayAmount: string) {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const { paymentMethod } = usePayment();
  const queryClient = useQueryClient();

  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [paymentDetailsDialogVisible, setPaymentDetailsDialogVisible] = useState(false);
  const [limitReachedDialogVisible, setLimitReachedDialogVisible] = useState(false);

  const { data: todaySummary } = useQuery({
    queryKey: ['earnings', 'summary', 'today'],
    queryFn: () => getEarningsSummary('today'),
    staleTime: 60 * 1000,
  });

  const withdrawalsToday =
    (todaySummary as { withdrawalsToday?: number } | undefined)?.withdrawalsToday ?? 0;
  const maxWithdrawalsPerDay = config.maxWithdrawalsPerDay;

  const handleCashOut = useCallback(() => {
    if (paymentMethod.type === 'none') {
      setPaymentDetailsDialogVisible(true);
      return;
    }
    if (withdrawalsToday >= maxWithdrawalsPerDay) {
      setLimitReachedDialogVisible(true);
      return;
    }
    setShowCashOutModal(true);
  }, [paymentMethod.type, withdrawalsToday, maxWithdrawalsPerDay]);

  const handleConfirmCashOut = useCallback(async () => {
    if (withdrawalsToday >= maxWithdrawalsPerDay) {
      setShowCashOutModal(false);
      setLimitReachedDialogVisible(true);
      return;
    }

    setShowCashOutModal(false);
    setTimeout(() => setShowSuccessToast(true), 300);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    if (paymentMethod.type === 'none') {
      return;
    }
    const method = paymentMethod.type === 'bank' ? 'bank_transfer' : 'upi';
    const accountDetails =
      paymentMethod.type === 'bank'
        ? {
            accountHolderName: paymentMethod.bankDetails.accountHolderName,
            accountNumber: paymentMethod.bankDetails.accountNumber,
            ifscCode: paymentMethod.bankDetails.ifscCode,
            bankName: paymentMethod.bankDetails.bankName,
          }
        : {
            accountHolderName: paymentMethod.upiDetails.accountHolderName,
            upiId: paymentMethod.upiDetails.upiId,
          };
    try {
      await requestPayout({
        periodStart: start.toISOString(),
        periodEnd: end.toISOString(),
        method,
        accountDetails,
      });
      queryClient.invalidateQueries({ queryKey: ['payouts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['earnings', 'summary'] });
    } catch (_) {
      // Toast still shown; payout list refresh on next load
    }
  }, [withdrawalsToday, maxWithdrawalsPerDay, paymentMethod, queryClient]);

  const paymentMethodType = paymentMethod.type === 'none' ? 'bank' : paymentMethod.type;
  const accountDetails =
    paymentMethod.type === 'bank'
      ? `•••• •••• ${(paymentMethod.bankDetails.accountNumber || '').slice(-4)}`
      : paymentMethod.type === 'upi'
        ? paymentMethod.upiDetails.upiId
        : '';

  return {
    displayAmount,
    handleCashOut,
    handleConfirmCashOut,
    showCashOutModal,
    setShowCashOutModal,
    showSuccessToast,
    setShowSuccessToast,
    paymentDetailsDialogVisible,
    setPaymentDetailsDialogVisible,
    limitReachedDialogVisible,
    setLimitReachedDialogVisible,
    withdrawalsToday,
    maxWithdrawalsPerDay,
    paymentMethodType,
    accountDetails,
    router,
  };
}
