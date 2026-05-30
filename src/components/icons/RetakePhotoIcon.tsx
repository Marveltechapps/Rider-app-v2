/**
 * Retake Photo Icon Component
 * Refresh/retake icon for retaking photo
 * Downloaded from Figma node-id: 13456:539
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface RetakePhotoIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function RetakePhotoIcon({
  size = 14,
  color = '#32C96A',
  style,
}: RetakePhotoIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      style={style}
    >
      <Path
        d="M1.75 7C1.75 5.60761 2.30312 4.27226 3.28769 3.28769C4.27226 2.30312 5.60761 1.75 7 1.75C8.46769 1.75552 9.87643 2.32821 10.9317 3.34833L12.25 4.66667"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12.2502 1.75V4.66667H9.3335"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12.25 7C12.25 8.39239 11.6969 9.72774 10.7123 10.7123C9.72774 11.6969 8.39239 12.25 7 12.25C5.53231 12.2445 4.12357 11.6718 3.06833 10.6517L1.75 9.33333"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M4.66667 9.33331H1.75V12.25"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

