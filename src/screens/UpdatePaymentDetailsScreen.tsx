/**
 * Update Payment Details Screen — bank / UPI saved to rider profile (authenticated API).
 */

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRider, updateRider } from '../api/rider';
import FormInput from '../components/common/FormInput';
import InfoBanner from '../components/common/InfoBanner';
import Text from '../components/common/Text';
import CircleInfoIcon from '../components/icons/CircleInfoIcon';
import Header from '../components/layout/Header';
import PaymentSegmentControl, { PaymentTab } from '../components/PaymentSegmentControl';
import { usePayment } from '../contexts/PaymentContext';
import { useUser } from '../contexts/UserContext';
import { normalizeRiderResponse, riderProfileQueryKey } from '../utils/riderProfileQuery';
import updatePaymentStyles from '../styles/updatePaymentStyles';
import { BankDetails, hasCompleteBankDetails, hasCompleteUpiDetails, UpiDetails } from '../types/payment';
import { fetchBankNameFromIfsc, guessBankNameFromIfsc } from '../utils/ifscBankName';
import {
  parsePaymentValidationFromApi,
  PaymentFieldErrors,
  sanitizeAccountNumber,
  sanitizeIfsc,
  sanitizeUpiId,
  validateBankForm,
  validateUpiForm,
} from '../utils/paymentValidation';
import { scale } from '../utils/responsive';

const emptyBank: BankDetails = {
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
};

const emptyUpi: UpiDetails = {
  accountHolderName: '',
  upiId: '',
};

export default function UpdatePaymentDetailsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const { userData } = useUser();
  const { syncPaymentFromRider, updateBankDetails, updateUpiDetails } = usePayment();
  const riderId = userData.riderId;

  const [activeTab, setActiveTab] = useState<PaymentTab>('bank');
  const [bankForm, setBankForm] = useState<BankDetails>(emptyBank);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankErrors, setBankErrors] = useState<PaymentFieldErrors>({});

  const [upiForm, setUpiForm] = useState<UpiDetails>(emptyUpi);
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [upiErrors, setUpiErrors] = useState<PaymentFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const initialTabRaw = params.initialTab;
      const initialTab = Array.isArray(initialTabRaw) ? initialTabRaw[0] : initialTabRaw;
      if (initialTab === 'bank' || initialTab === 'upi') {
        setActiveTab(initialTab);
      }
    }, [params.initialTab])
  );

  const { data: riderResponse } = useQuery({
    queryKey: riderProfileQueryKey(riderId),
    queryFn: async () => normalizeRiderResponse(await getRider(riderId!)),
    enabled: !!riderId,
    staleTime: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const r = riderResponse?.rider;
      if (!r) return;
      if (hasCompleteBankDetails(r.bankDetails)) {
        const b = r.bankDetails!;
        setBankForm({
          accountHolderName: b.accountHolderName ?? '',
          accountNumber: b.accountNumber ?? '',
          ifscCode: b.ifscCode ?? '',
          bankName: b.bankName ?? '',
        });
        setConfirmAccountNumber(b.accountNumber ?? '');
      } else {
        setBankForm(emptyBank);
        setConfirmAccountNumber('');
      }
      if (hasCompleteUpiDetails(r.upiDetails)) {
        const u = r.upiDetails!;
        setUpiForm({
          accountHolderName: u.accountHolderName ?? '',
          upiId: u.upiId ?? '',
        });
        setIsUpiVerified(true);
      } else {
        setUpiForm(emptyUpi);
        setIsUpiVerified(false);
      }
      setBankErrors({});
      setUpiErrors({});
      setSubmitError(null);
    }, [riderResponse?.rider])
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!riderId) throw new Error('Not signed in');
      if (activeTab === 'bank') {
        const bankName =
          bankForm.bankName.trim() || guessBankNameFromIfsc(bankForm.ifscCode) || 'Bank account';
        return updateRider(riderId, {
          bankDetails: {
            accountHolderName: bankForm.accountHolderName.trim(),
            accountNumber: sanitizeAccountNumber(bankForm.accountNumber),
            ifscCode: sanitizeIfsc(bankForm.ifscCode),
            bankName,
          },
        });
      }
      return updateRider(riderId, {
        upiDetails: {
          upiId: sanitizeUpiId(upiForm.upiId),
          accountHolderName: upiForm.accountHolderName.trim(),
        },
      });
    },
    onSuccess: (res) => {
      const normalized = normalizeRiderResponse(res);
      queryClient.setQueryData(riderProfileQueryKey(riderId), normalized);
      void queryClient.invalidateQueries({ queryKey: riderProfileQueryKey(riderId) });

      if (normalized.rider) {
        syncPaymentFromRider(normalized.rider);
      } else if (activeTab === 'bank') {
        const bankName =
          bankForm.bankName.trim() || guessBankNameFromIfsc(bankForm.ifscCode) || 'Bank account';
        updateBankDetails({
          accountHolderName: bankForm.accountHolderName.trim(),
          accountNumber: sanitizeAccountNumber(bankForm.accountNumber),
          ifscCode: sanitizeIfsc(bankForm.ifscCode),
          bankName,
        });
      } else {
        updateUpiDetails({
          accountHolderName: upiForm.accountHolderName.trim(),
          upiId: sanitizeUpiId(upiForm.upiId),
        });
      }

      router.replace({
        pathname: '/payment-verify-success',
        params: {
          method: activeTab,
          accountHolder: activeTab === 'bank' ? bankForm.accountHolderName : upiForm.accountHolderName,
          detail: activeTab === 'bank' ? bankForm.accountNumber : upiForm.upiId,
        },
      } as any);
    },
    onError: (e: Error & { apiBody?: unknown }) => {
      const apiFields = parsePaymentValidationFromApi(e.apiBody);
      if (activeTab === 'bank' && Object.keys(apiFields).length > 0) {
        setBankErrors((prev) => ({ ...prev, ...apiFields }));
      } else if (activeTab === 'upi' && Object.keys(apiFields).length > 0) {
        setUpiErrors((prev) => ({ ...prev, ...apiFields }));
      }
      setSubmitError(
        apiFields.submit ??
          (e instanceof Error ? e.message : 'Could not save payment details. Please try again.')
      );
    },
  });

  const handleVerifyUpi = useCallback(() => {
    const errors = validateUpiForm(upiForm);
    if (Object.keys(errors).length > 0) {
      setUpiErrors(errors);
      setIsUpiVerified(false);
      return;
    }
    setUpiErrors({});
    setIsUpiVerified(true);
    setSubmitError(null);
  }, [upiForm]);

  const handleSave = useCallback(() => {
    setSubmitError(null);
    if (activeTab === 'bank') {
      const errors = validateBankForm({
        accountHolderName: bankForm.accountHolderName,
        accountNumber: bankForm.accountNumber,
        confirmAccountNumber,
        ifscCode: bankForm.ifscCode,
      });
      if (Object.keys(errors).length > 0) {
        setBankErrors(errors);
        return;
      }
      setBankErrors({});
    } else {
      const errors = validateUpiForm(upiForm);
      if (Object.keys(errors).length > 0) {
        setUpiErrors(errors);
        setIsUpiVerified(false);
        return;
      }
      if (!isUpiVerified) {
        setUpiErrors({ upiId: 'Tap VERIFY to confirm your UPI ID format before saving' });
        return;
      }
      setUpiErrors({});
    }
    saveMutation.mutate();
  }, [activeTab, bankForm, confirmAccountNumber, isUpiVerified, upiForm, saveMutation]);

  const isSaveDisabled = saveMutation.isPending || !riderId;

  const handleTabChange = useCallback((tab: PaymentTab) => {
    setActiveTab(tab);
    setSubmitError(null);
    setBankErrors({});
    setUpiErrors({});
  }, []);

  return (
    <SafeAreaView style={updatePaymentStyles.container} edges={['top', 'bottom']}>
      <Header title="Update Payment Details" onBack={() => router.back()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={updatePaymentStyles.keyboardView}
      >
        <ScrollView
          style={updatePaymentStyles.scrollView}
          contentContainerStyle={updatePaymentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InfoBanner
            icon={<CircleInfoIcon size={scale(17.5)} color="#155DFC" />}
            message="Ensure the details belong to you. Using someone else's account may lead to payment delays or account suspension."
            backgroundColor="#EFF6FF"
            textColor="#1447E6"
            borderColor="#DBEAFE"
          />

          {submitError ? (
            <View style={updatePaymentStyles.submitErrorBanner}>
              <Text variant="bodySm" color="#B91C1C" style={updatePaymentStyles.submitErrorText}>
                {submitError}
              </Text>
            </View>
          ) : null}

          <View style={updatePaymentStyles.tabContainer}>
            <PaymentSegmentControl activeTab={activeTab} onChangeTab={handleTabChange} />

            <View style={updatePaymentStyles.formPanel}>
              {activeTab === 'bank' ? (
                <View style={updatePaymentStyles.formContent}>
                  <FormInput
                    label="Account Holder Name"
                    value={bankForm.accountHolderName}
                    placeholder="Enter account holder name"
                    onChangeText={(text) => {
                      setBankForm((prev) => ({ ...prev, accountHolderName: text }));
                      if (bankErrors.accountHolderName) {
                        setBankErrors((prev) => ({ ...prev, accountHolderName: undefined }));
                      }
                    }}
                    error={bankErrors.accountHolderName}
                    autoCapitalize="words"
                    height={44}
                  />

                  <FormInput
                    label="Account Number"
                    value={bankForm.accountNumber}
                    placeholder="Enter account number (9–18 digits)"
                    onChangeText={(text) => {
                      const digits = sanitizeAccountNumber(text);
                      setBankForm((prev) => ({ ...prev, accountNumber: digits }));
                      if (bankErrors.accountNumber) {
                        setBankErrors((prev) => ({ ...prev, accountNumber: undefined }));
                      }
                    }}
                    error={bankErrors.accountNumber}
                    keyboardType="number-pad"
                    height={44}
                  />

                  <FormInput
                    label="Confirm Account Number"
                    value={confirmAccountNumber}
                    placeholder="Re-enter account number"
                    onChangeText={(text) => {
                      setConfirmAccountNumber(sanitizeAccountNumber(text));
                      if (bankErrors.confirmAccountNumber) {
                        setBankErrors((prev) => ({ ...prev, confirmAccountNumber: undefined }));
                      }
                    }}
                    error={bankErrors.confirmAccountNumber}
                    keyboardType="number-pad"
                    height={44}
                  />

                  <FormInput
                    label="IFSC Code"
                    value={bankForm.ifscCode}
                    placeholder="Enter IFSC code"
                    onChangeText={(text) => {
                      const code = sanitizeIfsc(text);
                      setBankForm((prev) => ({ ...prev, ifscCode: code }));
                      if (bankErrors.ifscCode) {
                        setBankErrors((prev) => ({ ...prev, ifscCode: undefined }));
                      }
                      if (code.length === 11) {
                        fetchBankNameFromIfsc(code).then((name) => {
                          if (name) setBankForm((prev) => ({ ...prev, bankName: name }));
                        });
                      }
                    }}
                    error={bankErrors.ifscCode}
                    autoCapitalize="characters"
                    maxLength={11}
                    height={44}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSubmitError(
                        'Use your bank passbook, cheque, or net banking to find your branch IFSC.'
                      );
                    }}
                    activeOpacity={0.7}
                    style={updatePaymentStyles.ifscHelpLink}
                  >
                    <Text variant="caption" color="#155DFC" style={updatePaymentStyles.ifscHelpLinkText}>
                      How to find your IFSC?
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={updatePaymentStyles.formContent}>
                  <FormInput
                    label="Account Holder Name"
                    value={upiForm.accountHolderName}
                    placeholder="Enter account holder name"
                    onChangeText={(text) => {
                      setUpiForm((prev) => ({ ...prev, accountHolderName: text }));
                      setIsUpiVerified(false);
                      if (upiErrors.accountHolderName) {
                        setUpiErrors((prev) => ({ ...prev, accountHolderName: undefined }));
                      }
                    }}
                    error={upiErrors.accountHolderName}
                    autoCapitalize="words"
                    height={44}
                  />

                  <FormInput
                    label="UPI ID"
                    value={upiForm.upiId}
                    placeholder="Enter UPI ID"
                    onChangeText={(text) => {
                      setUpiForm((prev) => ({ ...prev, upiId: text }));
                      setIsUpiVerified(false);
                      if (upiErrors.upiId) {
                        setUpiErrors((prev) => ({ ...prev, upiId: undefined }));
                      }
                    }}
                    error={upiErrors.upiId}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    height={44}
                  />

                  <TouchableOpacity
                    style={updatePaymentStyles.verifyUpiButton}
                    onPress={handleVerifyUpi}
                    activeOpacity={0.8}
                  >
                    <Text variant="bodySm" style={updatePaymentStyles.verifyUpiButtonText}>
                      Verify UPI ID
                    </Text>
                  </TouchableOpacity>

                  {isUpiVerified ? (
                    <Text variant="caption" color="#237227" style={updatePaymentStyles.verificationNote}>
                      UPI ID format looks valid. We may send a ₹1 test deposit to verify this account.
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              updatePaymentStyles.saveButton,
              isSaveDisabled && updatePaymentStyles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaveDisabled}
            activeOpacity={0.8}
          >
            <Text variant="h3" style={updatePaymentStyles.saveButtonText} numberOfLines={1}>
              {saveMutation.isPending ? 'Saving...' : 'Verify & Save'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
