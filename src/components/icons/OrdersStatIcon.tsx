import React from 'react';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface OrdersStatIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function OrdersStatIcon({
  size = 28,
  style,
}: OrdersStatIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={style}
    >
      <Path
        d="M0 8.75C0 3.91751 3.91751 0 8.75 0H19.25C24.0825 0 28 3.91751 28 8.75V19.25C28 24.0825 24.0825 28 19.25 28H8.75C3.91751 28 0 24.0825 0 19.25V8.75Z"
        fill="#EFF6FF"
      />
      <G clipPath="url(#clip0_13480_295)">
        <Path
          d="M13.4167 19.6758C13.594 19.7782 13.7952 19.8321 14 19.8321C14.2048 19.8321 14.406 19.7782 14.5833 19.6758L18.6667 17.3425C18.8438 17.2402 18.991 17.0931 19.0934 16.916C19.1958 16.7389 19.2498 16.5379 19.25 16.3333V11.6667C19.2498 11.4621 19.1958 11.2611 19.0934 11.084C18.991 10.9069 18.8438 10.7598 18.6667 10.6575L14.5833 8.32417C14.406 8.22177 14.2048 8.16786 14 8.16786C13.7952 8.16786 13.594 8.22177 13.4167 8.32417L9.33333 10.6575C9.15615 10.7598 9.00899 10.9069 8.9066 11.084C8.80422 11.2611 8.75021 11.4621 8.75 11.6667V16.3333C8.75021 16.5379 8.80422 16.7389 8.9066 16.916C9.00899 17.0931 9.15615 17.2402 9.33333 17.3425L13.4167 19.6758Z"
          stroke="#2B7FFF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14 19.8333V14"
          stroke="#2B7FFF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.91895 11.0833L13.9998 14L19.0806 11.0833"
          stroke="#2B7FFF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11.375 9.49083L16.625 12.495"
          stroke="#2B7FFF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13480_295">
          <Rect width="14" height="14" fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}


