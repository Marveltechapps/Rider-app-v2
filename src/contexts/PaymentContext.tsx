/**
 * Payment Context
 * Payout method state — hydrated from authenticated rider profile (no mock defaults).
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getRider } from '../api/rider';
import { useUser } from './UserContext';
import {
  BankDetails,
  INITIAL_PAYMENT,
  paymentMethodFromRiderProfile,
  PaymentMethod,
  riderPayoutDetailsFromProfile,
  UpiDetails,
} from '../types/payment';
import { normalizeRiderResponse, riderProfileQueryKey } from '../utils/riderProfileQuery';

interface PaymentContextType {
  bankDetails: BankDetails | null;
  upiDetails: UpiDetails | null;
  paymentMethod: PaymentMethod;
  profileUpdatedAt?: string;
  refreshPaymentFromServer: () => Promise<void>;
  syncPaymentFromRider: (rider: Parameters<typeof riderPayoutDetailsFromProfile>[0]) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  updateBankDetails: (bankDetails: BankDetails) => void;
  updateUpiDetails: (upiDetails: UpiDetails) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { userData } = useUser();
  const riderId = userData.riderId;
  const queryClient = useQueryClient();
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [upiDetails, setUpiDetails] = useState<UpiDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(INITIAL_PAYMENT);
  const [profileUpdatedAt, setProfileUpdatedAt] = useState<string | undefined>();

  const syncPaymentFromRider = useCallback(
    (rider: Parameters<typeof riderPayoutDetailsFromProfile>[0]) => {
      const payout = riderPayoutDetailsFromProfile(rider);
      setBankDetails(payout.bank);
      setUpiDetails(payout.upi);
      setPaymentMethod(paymentMethodFromRiderProfile(rider));
      setProfileUpdatedAt(rider.updatedAt);
    },
    []
  );

  const { data: riderPayload } = useQuery({
    queryKey: riderProfileQueryKey(riderId),
    queryFn: async () => normalizeRiderResponse(await getRider(riderId!)),
    enabled: !!riderId,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (!riderId) {
      setBankDetails(null);
      setUpiDetails(null);
      setPaymentMethod(INITIAL_PAYMENT);
      setProfileUpdatedAt(undefined);
      return;
    }
    if (riderPayload?.rider) {
      syncPaymentFromRider(riderPayload.rider);
    }
  }, [riderId, riderPayload, syncPaymentFromRider]);

  const refreshPaymentFromServer = useCallback(async () => {
    if (!riderId) return;
    await queryClient.invalidateQueries({ queryKey: riderProfileQueryKey(riderId) });
    const res = normalizeRiderResponse(await getRider(riderId));
    queryClient.setQueryData(riderProfileQueryKey(riderId), res);
    if (res.rider) {
      syncPaymentFromRider(res.rider);
    }
  }, [queryClient, riderId, syncPaymentFromRider]);

  const updatePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const mergeRiderInCache = useCallback(
    (patch: Partial<Parameters<typeof syncPaymentFromRider>[0]>) => {
      if (!riderId) return;
      const cached = queryClient.getQueryData(riderProfileQueryKey(riderId));
      const base = normalizeRiderResponse(cached ?? { rider: {} });
      const merged = { ...base.rider, ...patch };
      queryClient.setQueryData(riderProfileQueryKey(riderId), { rider: merged });
      syncPaymentFromRider(merged);
    },
    [queryClient, riderId, syncPaymentFromRider]
  );

  const updateBankDetails = (details: BankDetails) => {
    mergeRiderInCache({
      bankDetails: details,
      primaryPayoutMethod: 'bank',
    });
    void queryClient.invalidateQueries({ queryKey: riderProfileQueryKey(riderId) });
  };

  const updateUpiDetails = (details: UpiDetails) => {
    mergeRiderInCache({
      upiDetails: details,
      primaryPayoutMethod: 'upi',
    });
    void queryClient.invalidateQueries({ queryKey: riderProfileQueryKey(riderId) });
  };

  return (
    <PaymentContext.Provider
      value={{
        bankDetails,
        upiDetails,
        paymentMethod,
        profileUpdatedAt,
        refreshPaymentFromServer,
        syncPaymentFromRider,
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
