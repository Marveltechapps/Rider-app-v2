/**
 * Vehicle Bike Icon Component
 * Bike icon for vehicle selection
 * Downloaded from Figma node-id: 13454:429
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface VehicleBikeIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function VehicleBikeIcon({
  size = 28,
  color = '#32C96A',
  style,
}: VehicleBikeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={style}
    >
      <Path
        d="M21.5833 24.5C23.8385 24.5 25.6667 22.6718 25.6667 20.4167C25.6667 18.1615 23.8385 16.3333 21.5833 16.3333C19.3282 16.3333 17.5 18.1615 17.5 20.4167C17.5 22.6718 19.3282 24.5 21.5833 24.5Z"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M6.41659 24.5C8.67175 24.5 10.4999 22.6718 10.4999 20.4167C10.4999 18.1615 8.67175 16.3333 6.41659 16.3333C4.16142 16.3333 2.33325 18.1615 2.33325 20.4167C2.33325 22.6718 4.16142 24.5 6.41659 24.5Z"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M17.4999 7.00001C18.1443 7.00001 18.6666 6.47767 18.6666 5.83334C18.6666 5.18901 18.1443 4.66667 17.4999 4.66667C16.8556 4.66667 16.3333 5.18901 16.3333 5.83334C16.3333 6.47767 16.8556 7.00001 17.4999 7.00001Z"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M14 20.4167V16.3333L10.5 12.8333L15.1667 9.33333L17.5 12.8333H19.8333"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

