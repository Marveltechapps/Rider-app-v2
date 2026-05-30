/**
 * Items Badge Icon Component
 * Icon for items count badge
 */

import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ItemsBadgeIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ItemsBadgeIcon({
  size = 14,
  color = '#6A7282',
  style,
}: ItemsBadgeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
    >
      <G clipPath="url(#clip0_13519_2717)">
        <Path
          d="M6.41667 12.6758C6.59402 12.7782 6.79521 12.8321 7 12.8321C7.20479 12.8321 7.40598 12.7782 7.58333 12.6758L11.6667 10.3425C11.8438 10.2402 11.991 10.0931 12.0934 9.91597C12.1958 9.73884 12.2498 9.53791 12.25 9.33332V4.66665C12.2498 4.46206 12.1958 4.26112 12.0934 4.084C11.991 3.90687 11.8438 3.75978 11.6667 3.65748L7.58333 1.32415C7.40598 1.22175 7.20479 1.16785 7 1.16785C6.79521 1.16785 6.59402 1.22175 6.41667 1.32415L2.33333 3.65748C2.15615 3.75978 2.00899 3.90687 1.9066 4.084C1.80422 4.26112 1.75021 4.46206 1.75 4.66665V9.33332C1.75021 9.53791 1.80422 9.73884 1.9066 9.91597C2.00899 10.0931 2.15615 10.2402 2.33333 10.3425L6.41667 12.6758Z"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7 12.8333V7"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1.91895 4.08331L6.99978 6.99998L12.0806 4.08331"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.375 2.49081L9.625 5.49498"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13519_2717">
          <Rect width="14" height="14" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

