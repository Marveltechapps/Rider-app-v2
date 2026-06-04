/**
 * Production OTP input — single hidden TextInput + display boxes.
 * Avoids multi-input focus/blur races on Android and iOS.
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from './common/Text';
import { Theme } from '../constants/Theme';
import { scale } from '../utils/responsive';

const BOX_SIZE = scale(56);
const BOX_GAP = scale(10.5);

export type OtpPinInputRef = {
  focus: () => void;
  blur: () => void;
};

export interface OtpPinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** @deprecated Prefer explicit Verify button; not called when omitted. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  /** When false, keyboard opens only after user taps the OTP row. Default false. */
  autoFocus?: boolean;
  /** Blur hidden input and dismiss keyboard when all digits entered (no verify). Default true. */
  dismissKeyboardOnComplete?: boolean;
  testID?: string;
}

function digitsOnly(raw: string, maxLen: number): string {
  return raw.replace(/\D/g, '').slice(0, maxLen);
}

const OtpPinInput = forwardRef<OtpPinInputRef, OtpPinInputProps>(function OtpPinInput(
  {
    length = 4,
    value,
    onChange,
    onComplete,
    disabled = false,
    autoFocus = false,
    dismissKeyboardOnComplete = true,
    testID,
  },
  ref
) {
  const inputRef = useRef<TextInput>(null);
  const lastCompletedRef = useRef<string | null>(null);
  const lastDismissedRef = useRef<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const dismissKeyboardAndBlur = useCallback(() => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const activeIndex = Math.min(value.length, length - 1);

  const focusInput = useCallback(() => {
    if (disabled) return;
    inputRef.current?.focus();
  }, [disabled]);

  useImperativeHandle(ref, () => ({
    focus: focusInput,
    blur: () => inputRef.current?.blur(),
  }));

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const t = setTimeout(focusInput, 400);
    return () => clearTimeout(t);
  }, [autoFocus, disabled, focusInput]);

  useEffect(() => {
    if (value.length < length) {
      lastCompletedRef.current = null;
      lastDismissedRef.current = null;
    }
  }, [value, length]);

  useEffect(() => {
    if (
      !dismissKeyboardOnComplete ||
      disabled ||
      value.length !== length ||
      value === lastDismissedRef.current
    ) {
      return;
    }
    lastDismissedRef.current = value;
    dismissKeyboardAndBlur();
    if (Platform.OS === 'android') {
      const t = setTimeout(dismissKeyboardAndBlur, 80);
      return () => clearTimeout(t);
    }
  }, [value, length, disabled, dismissKeyboardOnComplete, dismissKeyboardAndBlur]);

  const handleChangeText = useCallback(
    (text: string) => {
      if (disabled) return;
      const next = digitsOnly(text, length);
      onChange(next);
      if (onComplete && next.length === length && next !== lastCompletedRef.current) {
        lastCompletedRef.current = next;
        onComplete(next);
      }
    },
    [disabled, length, onChange, onComplete]
  );

  return (
    <View style={styles.wrapper} testID={testID}>
      <Pressable
        style={styles.boxRow}
        onPress={focusInput}
        disabled={disabled}
        accessibilityRole="none"
        accessibilityLabel="OTP entry"
      >
        {Array.from({ length }, (_, index) => {
          const digit = value[index] ?? '';
          const isActive = isFocused && activeIndex === index;
          const isFilled = digit.length > 0;
          return (
            <View
              key={index}
              style={[
                styles.box,
                isActive && styles.boxActive,
                isFilled && styles.boxFilled,
                disabled && styles.boxDisabled,
              ]}
            >
              <Text variant="loginTitle" color={Theme.colors.textDark} style={styles.digit}>
                {digit}
              </Text>
            </View>
          );
        })}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={length}
          editable={!disabled}
          caretHidden
          selectTextOnFocus={false}
          showSoftInputOnFocus
          blurOnSubmit={false}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          importantForAutofill="yes"
          style={styles.hiddenInput}
          {...(Platform.OS === 'android' ? { underlineColorAndroid: 'transparent' } : {})}
        />
      </Pressable>
    </View>
  );
});

export default OtpPinInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: BOX_GAP,
    position: 'relative',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: Theme.colors.white,
    borderWidth: 2,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  boxActive: {
    borderColor: '#CEE3D7',
  },
  boxFilled: {
    borderColor: Theme.colors.borderGrey,
  },
  boxDisabled: {
    opacity: 0.6,
  },
  digit: {
    textAlign: 'center',
    lineHeight: scale(28),
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: 'transparent',
    fontSize: scale(16),
  },
});
