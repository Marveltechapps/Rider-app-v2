/**
 * Input Component
 * Foundation input component with label and styling
 * 
 * @component
 */

import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from './Text';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  disabled = false,
  style,
  inputStyle,
  leftComponent,
  rightComponent,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="bodySm" color={Theme.colors.textLabel} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftComponent && <View style={styles.leftComponent}>{leftComponent}</View>}
        <TextInput
          style={[
            styles.input,
            leftComponent && styles.inputWithLeft,
            rightComponent && styles.inputWithRight,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textLight}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          selectTextOnFocus={!disabled}
        />
        {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: scale(10.5),
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.small,
  },
  input: {
    flex: 1,
    height: scale(44),
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.typography.bodySm.fontSize,
    fontFamily: Theme.typography.bodySm.fontFamily,
    color: Theme.colors.textDark,
  },
  inputWithLeft: {
    paddingLeft: 0,
  },
  inputWithRight: {
    paddingRight: 0,
  },
  leftComponent: {
    paddingLeft: Theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightComponent: {
    paddingRight: Theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

