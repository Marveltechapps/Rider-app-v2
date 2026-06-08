/**
 * Customer Avatar Icon Component
 * Icon for customer profile in delivery screen
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CustomerAvatarIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CustomerAvatarIcon({
  size = 28,
  color = '#237227',
  style,
}: CustomerAvatarIconProps) {
  // Use 56x56 viewBox for handover screen, but scale to provided size
  const viewBoxSize = 56;
  const scaleFactor = size / viewBoxSize;
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      style={style}
    >
      <Path
        d="M0 14C0 6.26801 6.26801 0 14 0H42C49.732 0 56 6.26801 56 14V42C56 49.732 49.732 56 42 56H14C6.26801 56 0 49.732 0 42V14Z"
        fill={color}
        fillOpacity="0.1"
      />
      <Path
        d="M36.1663 38.5V36.1667C36.1663 34.929 35.6747 33.742 34.7995 32.8668C33.9243 31.9917 32.7374 31.5 31.4997 31.5H24.4997C23.262 31.5 22.075 31.9917 21.1998 32.8668C20.3247 33.742 19.833 34.929 19.833 36.1667V38.5"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M27.9997 26.8333C30.577 26.8333 32.6663 24.744 32.6663 22.1667C32.6663 19.5893 30.577 17.5 27.9997 17.5C25.4223 17.5 23.333 19.5893 23.333 22.1667C23.333 24.744 25.4223 26.8333 27.9997 26.8333Z"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

