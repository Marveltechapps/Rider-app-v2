import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface ProfileIconProps {
  size?: number;
  color?: string;
  active?: boolean;
  style?: ViewStyle;
}

export default function ProfileIcon({
  size = 21,
  color,
  active = false,
  style,
}: ProfileIconProps) {
  const iconColor = color || (active ? Theme.colors.white : Theme.colors.textLight);
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      style={style}
    >
      <Path
        d="M27.125 28.875V27.125C27.125 26.1967 26.7563 25.3065 26.0999 24.6501C25.4435 23.9937 24.5533 23.625 23.625 23.625H18.375C17.4467 23.625 16.5565 23.9937 15.9001 24.6501C15.2437 25.3065 14.875 26.1967 14.875 27.125V28.875"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 20.125C22.933 20.125 24.5 18.558 24.5 16.625C24.5 14.692 22.933 13.125 21 13.125C19.067 13.125 17.5 14.692 17.5 16.625C17.5 18.558 19.067 20.125 21 20.125Z"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

