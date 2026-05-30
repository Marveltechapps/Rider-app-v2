/**
 * Text Component
 * Centralized text component with typography variants
 * Uses Inter font family by default
 * 
 * @component
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, type GestureResponderEvent } from 'react-native';
import { Theme } from '../../constants/Theme';

interface TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodySm' | 'caption' | 'splashTitle' | 'splashSubtitle' | 'splashCaption' | 'loginTitle' | 'loginSubtitle' | 'loginLabel' | 'loginInput' | 'loginInfo' | 'loginButton' | 'loginTerms' | 'loginSkip';
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function Text({
  variant = 'body',
  color,
  style,
  children,
  numberOfLines,
  onPress,
}: TextProps) {
  const typography = Theme.typography[variant] || Theme.typography.body;
  const textColor = color || Theme.colors.text;

  return (
    <RNText
      style={[
        styles.base,
        {
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeight,
          lineHeight: typography.lineHeight,
          fontFamily: typography.fontFamily,
          color: textColor,
          ...(typography.letterSpacing && { letterSpacing: typography.letterSpacing }),
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base text styles
  },
});

