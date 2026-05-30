import React from 'react';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface HoursStatIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function HoursStatIcon({
  size = 28,
  style,
}: HoursStatIconProps) {
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
        fill="#FAF5FF"
      />
      <G clipPath="url(#clip0_13480_306)">
        <Path
          d="M14 10.5V14L16.3333 15.1667"
          stroke="#AD46FF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14.0003 19.8333C17.222 19.8333 19.8337 17.2217 19.8337 14C19.8337 10.7783 17.222 8.16666 14.0003 8.16666C10.7787 8.16666 8.16699 10.7783 8.16699 14C8.16699 17.2217 10.7787 19.8333 14.0003 19.8333Z"
          stroke="#AD46FF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13480_306">
          <Rect width="14" height="14" fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}


