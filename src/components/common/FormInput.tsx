/**
 * Form Input Component
 * Reusable form input with fixed 44px height
 * Shows different styles for placeholder vs filled states
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { scale, verticalScale } from '../../utils/responsive';
import Text from './Text';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  rightElement?: React.ReactNode;
  error?: string;
  containerStyle?: ViewStyle;
  height?: number;
  editable?: boolean;
}

export default function FormInput({
  label,
  value,
  placeholder,
  onChangeText,
  rightElement,
  error,
  containerStyle,
  height = 44,
  editable = true,
  ...textInputProps
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputBorderColor = error
    ? '#E53935'
    : isFocused
    ? '#32C96A'
    : '#E5E7EB';

  const textColor = value ? '#717182' : '#717182';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text variant="bodySm" color="#364153" style={styles.label}>
          {label}
        </Text>
      </View>
      <View style={styles.inputWrapper}>
        {rightElement ? (
          // Input with right element (FIND IFSC, VERIFY button)
          <View style={[styles.inputRow, { height: scale(height) }]}>
            <TextInput
              style={[
                styles.inputWithButton,
                { 
                  color: textColor,
                  borderColor: inputBorderColor,
                  height: scale(height),
                },
              ]}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#B0B0B0"
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              editable={editable}
              {...textInputProps}
            />
            <View style={styles.rightElementContainer}>
              {rightElement}
            </View>
          </View>
        ) : (
          // Regular input without right element
          <View
            style={[
              styles.inputContainer,
              { borderColor: inputBorderColor, height: scale(height) },
            ]}
          >
            <TextInput
              style={[styles.input, { color: textColor }]}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#B0B0B0"
              onChangeText={onChangeText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              editable={editable}
              {...textInputProps}
            />
          </View>
        )}
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
    gap: verticalScale(7),
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
    gap: verticalScale(8),
  },
  inputRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: scale(12),
    paddingHorizontal: scale(10.5),
    backgroundColor: '#F3F3F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
  },
  inputWithButton: {
    flex: 1,
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(14.09),
    color: '#717182',
    paddingTop: scale(12),
    paddingBottom: scale(12),
    paddingLeft: scale(10.5),
    paddingRight: scale(65), // Space for button
    backgroundColor: '#F3F3F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
  },
  input: {
    flex: 1,
    fontSize: scale(12.25),
    fontWeight: '400',
    lineHeight: scale(14.09),
    color: '#717182',
    padding: 0,
  },
  rightElementContainer: {
    position: 'absolute',
    right: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    fontSize: scale(10.5),
    fontWeight: '400',
    lineHeight: scale(14),
    color: '#E53935',
  },
});

