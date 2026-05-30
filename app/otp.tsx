/**
 * OTP Screen Route
 * Entry point for the OTP verification screen
 */

import { useLocalSearchParams } from 'expo-router';
import OTPScreen from '@/screens/OTPScreen';

export default function OTP() {
  const params = useLocalSearchParams<{ phoneNumber?: string | string[] }>();
  const phoneNumber = params.phoneNumber
    ? (Array.isArray(params.phoneNumber) ? params.phoneNumber[0] : params.phoneNumber)
    : undefined;

  return <OTPScreen phoneNumber={phoneNumber || '+91 98765 43210'} />;
}

