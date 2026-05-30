/**
 * Delivery Bag Icon Component
 * Icon for delivery bag item in kit checklist
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface DeliveryBagIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DeliveryBagIcon({
  size = 28,
  color = '#4A5565',
  style,
}: DeliveryBagIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={style}
    >
      <Path
        d="M7 8.75H21L20 23H8L7 8.75Z"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M10.5 8.75V5.25C10.5 4.85218 10.658 4.47064 10.9393 4.18934C11.2206 3.90804 11.6022 3.75 12 3.75H16C16.3978 3.75 16.7794 3.90804 17.0607 4.18934C17.342 4.47064 17.5 4.85218 17.5 5.25V8.75"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M14 12.25V17.5"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

