/**
 * Payment Context
 * Payout method state — hydrated from authenticated rider profile (no mock defaults).
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getRider } from '../api/rider';
import { useUser } from './UserContext';
import { BankDetails, INITIAL_PAYMENT, paymentMethodFromRiderProfile, PaymentMethod, UpiDetails } from '../types/payment';

interface PaymentContextType {
  paymentMethod: PaymentMethod;
  updatePaymentMethod: (method: PaymentMethod) => void;
  updateBankDetails: (bankDetails: BankDetails) => void;
  updateUpiDetails: (upiDetails: UpiDetails) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { userData } = useUser();
  const riderId = userData.riderId;
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(INITIAL_PAYMENT);

  const { data: riderPayload } = useQuery({
    queryKey: ['rider', 'profile', riderId],
    queryFn: () => getRider(riderId!),
    enabled: !!riderId,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (!riderId) {
      setPaymentMethod(INITIAL_PAYMENT);
      return;
    }
    if (riderPayload?.rider) {
      setPaymentMethod(paymentMethodFromRiderProfile(riderPayload.rider));
    }
  }, [riderId, riderPayload]);

  const updatePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const updateBankDetails = (bankDetails: BankDetails) => {
    setPaymentMethod({
      type: 'bank',
      bankDetails,
      isVerified: true,
    });
    if (riderId) {
      queryClient.invalidateQueries({ queryKey: ['rider', 'profile', riderId] });
    }
  };

  const updateUpiDetails = (upiDetails: UpiDetails) => {
    setPaymentMethod({
      type: 'upi',
      upiDetails,
      isVerified: true,
    });
    if (riderId) {
      queryClient.invalidateQueries({ queryKey: ['rider', 'profile', riderId] });
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethod,
        updatePaymentMethod,
        updateBankDetails,
        updateUpiDetails,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
