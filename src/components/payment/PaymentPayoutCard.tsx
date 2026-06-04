/**
 * Bank or UPI payout summary card for Bank Details screen.
 */

import React from 'react';
import { View } from 'react-native';
import Text from '../common/Text';
import CheckmarkSmallGreenIcon from '../icons/CheckmarkSmallGreenIcon';
import paymentDetailsStyles from '../../styles/paymentDetailsStyles';
import type { BankDetails, UpiDetails } from '../../types/payment';
import { scale } from '../../utils/responsive';

type PaymentPayoutCardProps =
  | { variant: 'bank'; details: BankDetails }
  | { variant: 'upi'; details: UpiDetails };

function maskAccountNumber(accountNumber: string) {
  const last4 = accountNumber.slice(-4);
  return `•••• •••• ${last4}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={paymentDetailsStyles.detailRow}>
      <Text variant="caption" style={paymentDetailsStyles.detailLabel}>
        {label}
      </Text>
      <Text variant="bodySm" style={paymentDetailsStyles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function PaymentPayoutCard(props: PaymentPayoutCardProps) {
  const isBank = props.variant === 'bank';
  const cardStyle = isBank
    ? paymentDetailsStyles.methodCardBank
    : paymentDetailsStyles.methodCardUpi;

  return (
    <View style={[paymentDetailsStyles.methodCard, cardStyle]}>
      <View style={paymentDetailsStyles.methodCardHeader}>
        <Text variant="h3" style={paymentDetailsStyles.methodCardTitle}>
          {isBank ? 'Bank Account Details' : 'UPI Details'}
        </Text>
        <View style={paymentDetailsStyles.verifiedBadge}>
          <CheckmarkSmallGreenIcon size={scale(10.5)} />
          <Text variant="caption" style={paymentDetailsStyles.verifiedText}>
            Verified
          </Text>
        </View>
      </View>

      {isBank ? (
        <>
          <DetailRow label="Account holder name" value={props.details.accountHolderName} />
          <DetailRow label="Account number" value={maskAccountNumber(props.details.accountNumber)} />
          <DetailRow label="Bank name" value={props.details.bankName?.trim() || '—'} />
          <DetailRow label="IFSC code" value={props.details.ifscCode} />
        </>
      ) : (
        <>
          <DetailRow label="Account holder name" value={props.details.accountHolderName} />
          <DetailRow label="UPI ID" value={props.details.upiId} />
        </>
      )}
    </View>
  );
}
