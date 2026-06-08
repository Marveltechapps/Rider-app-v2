import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface EarningsStatIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function EarningsStatIcon({
  size = 28,
  style,
}: EarningsStatIconProps) {
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
        fill="#237227"
        fillOpacity="0.1"
      />
      <Path
        d="M16.333 11.0833H19.833V14.5833"
        stroke="#237227"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.8337 11.0833L14.8753 16.0417L11.9587 13.125L8.16699 16.9167"
        stroke="#237227"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


