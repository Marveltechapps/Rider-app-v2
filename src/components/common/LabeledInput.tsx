/**
 * Labeled Input Component
 * Reusable input field with label and icon
 * Shows different styles for placeholder vs filled states
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Text from './Text';
import { scale, verticalScale } from '../../utils/responsive';

interface LabeledInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  LeftIcon?: React.ReactNode;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function LabeledInput({
  label,
  value,
  placeholder,
  onChangeText,
  LeftIcon,
  error,
  containerStyle,
  ...textInputProps
}: LabeledInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputBorderColor = error
    ? '#E53935'
    : isFocused
    ? '#32C96A'
    : '#E5E7EB';

  const textColor = value ? '#717182' : '#B0B0B0';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text variant="bodySm" color="#364153" style={styles.label}>
          {label}
        </Text>
      </View>
      <View style={styles.inputWrapper}>
        <View style={[styles.inputContainer, { borderColor: inputBorderColor }]}>
          {LeftIcon && <View style={styles.iconContainer}>{LeftIcon}</View>}
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#B0B0B0"
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...textInputProps}
          />
        </View>
        {error && (
          <Text variant="caption" color="#E53935" style={styles.errorText}>
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(8),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: scale(7),
  },
  label: {
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(12.25),
    color: '#364153',
  },
  inputWrapper: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: verticalScale(10),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    width: scale(360),
    backgroundColor: '#F3F3F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(4),
  },
  iconContainer: {
    width: scale(17.5),
    height: scale(17.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(14.09),
    color: '#717182',
    padding: 0,
  },
  errorText: {
    fontSize: scale(10.5),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#E53935',
  },
});

