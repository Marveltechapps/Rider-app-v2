/**
 * Package Icon Component
 * Used in order history cards
 * Exact SVG from Figma (simplified for icon use)
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface PackageIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function PackageIcon({ 
  size = 18, 
  color = '#FFFFFF',
  style 
}: PackageIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M7.7708 14.5949C7.9925 14.7229 8.244 14.7903 8.5 14.7903C8.756 14.7903 9.0075 14.7229 9.2292 14.5949L14.3333 11.6783C14.5548 11.5504 14.7388 11.3665 14.8667 11.1451C14.9947 10.9237 15.0622 10.6725 15.0625 10.4168V4.5835C15.0622 4.3277 14.9947 4.0766 14.8667 3.8551C14.7388 3.6337 14.5548 3.4499 14.3333 3.322L9.2292 0.4053C9.0075 0.2773 8.756 0.21 8.5 0.21C8.244 0.21 7.9925 0.2773 7.7708 0.4053L2.6667 3.322C2.4452 3.4499 2.2612 3.6337 2.1333 3.8551C2.0053 4.0766 1.9378 4.3277 1.9375 4.5835V10.4168C1.9378 10.6725 2.0053 10.9237 2.1333 11.1451C2.2612 11.3665 2.4452 11.5504 2.6667 11.6783L7.7708 14.5949Z"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 14.7917V7.5"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.1494 3.854L8.5005 7.4998L14.8515 3.854"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.2188 1.8638L11.7813 5.619"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

