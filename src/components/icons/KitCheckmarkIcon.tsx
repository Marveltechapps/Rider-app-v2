/**
 * Kit Checkmark Icon Component
 * Exact icon from Figma for "Collect Rider Kit" card
 * Downloaded from Figma node-id: 13474-25
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface KitCheckmarkIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function KitCheckmarkIcon({
  size = 35,
  style,
}: KitCheckmarkIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      fill="none"
      style={style}
    >
      <Path
        d="M0 17.5C0 7.83502 7.83502 0 17.5 0C27.165 0 35 7.83502 35 17.5C35 27.165 27.165 35 17.5 35C7.83502 35 0 27.165 0 17.5Z"
        fill="#237227"
        fillOpacity="0.1"
      />
      <Path
        d="M16.7708 24.5948C16.9925 24.7228 17.244 24.7902 17.5 24.7902C17.756 24.7902 18.0075 24.7228 18.2292 24.5948L23.3333 21.6781C23.5548 21.5503 23.7388 21.3664 23.8667 21.145C23.9947 20.9236 24.0622 20.6724 24.0625 20.4167V14.5833C24.0622 14.3276 23.9947 14.0764 23.8667 13.855C23.7388 13.6336 23.5548 13.4498 23.3333 13.3219L18.2292 10.4052C18.0075 10.2772 17.756 10.2098 17.5 10.2098C17.244 10.2098 16.9925 10.2772 16.7708 10.4052L11.6667 13.3219C11.4452 13.4498 11.2612 13.6336 11.1333 13.855C11.0053 14.0764 10.9378 14.3276 10.9375 14.5833V20.4167C10.9378 20.6724 11.0053 20.9236 11.1333 21.145C11.2612 21.3664 11.4452 21.5503 11.6667 21.6781L16.7708 24.5948Z"
        stroke="#237227"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M17.5 24.7917V17.5"
        stroke="#237227"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.1489 13.8542L17.5 17.5L23.851 13.8542"
        stroke="#237227"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.2188 11.8635L20.7813 15.6187"
        stroke="#237227"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

