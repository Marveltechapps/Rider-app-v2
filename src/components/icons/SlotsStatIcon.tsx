import React from 'react';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface SlotsStatIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function SlotsStatIcon({
  size = 28,
  style,
}: SlotsStatIconProps) {
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
        fill="#FFF7ED"
      />
      <G clipPath="url(#clip0_13480_315)">
        <Path
          d="M11.667 8.16666V10.5"
          stroke="#FF6900"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16.333 8.16666V10.5"
          stroke="#FF6900"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M18.0833 9.33334H9.91667C9.27233 9.33334 8.75 9.85568 8.75 10.5V18.6667C8.75 19.311 9.27233 19.8333 9.91667 19.8333H18.0833C18.7277 19.8333 19.25 19.311 19.25 18.6667V10.5C19.25 9.85568 18.7277 9.33334 18.0833 9.33334Z"
          stroke="#FF6900"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.75 12.8333H19.25"
          stroke="#FF6900"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13480_315">
          <Rect width="14" height="14" fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}


