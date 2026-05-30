/**
 * Document Vehicle RC Icon Component
 * Vehicle RC document icon matching Figma design
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DocumentVehicleRCIconProps {
  size?: number;
  color?: string;
}

export default function DocumentVehicleRCIcon({
  size = 42,
  color = '#99A1AF',
}: DocumentVehicleRCIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <Path
        d="M0 12.75C0 5.70837 5.70837 0 12.75 0H29.25C36.2916 0 42 5.70837 42 12.75V29.25C42 36.2916 36.2916 42 29.25 42H12.75C5.70837 42 0 36.2916 0 29.25V12.75Z"
        fill="#F3F4F6"
      />
      {/* Document card background */}
      <Path
        d="M14 16.625C14 15.6585 14.7835 14.875 15.75 14.875H26.25C27.2165 14.875 28 15.6585 28 16.625V25.375C28 26.3415 27.2165 27.125 26.25 27.125H15.75C14.7835 27.125 14 26.3415 14 25.375V16.625Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Vehicle icon inside document */}
      <Path
        d="M17.5 19.25H24.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Vehicle body */}
      <Path
        d="M16.625 22.75C16.625 22.3358 16.9608 22 17.375 22H24.625C25.0392 22 25.375 22.3358 25.375 22.75V23.625C25.375 24.0392 25.0392 24.375 24.625 24.375H17.375C16.9608 24.375 16.625 24.0392 16.625 23.625V22.75Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Vehicle wheels */}
      <Path
        d="M18.375 24.375C18.375 24.7892 18.0392 25.125 17.625 25.125C17.2108 25.125 16.875 24.7892 16.875 24.375C16.875 23.9608 17.2108 23.625 17.625 23.625C18.0392 23.625 18.375 23.9608 18.375 24.375Z"
        fill={color}
      />
      <Path
        d="M25.125 24.375C25.125 24.7892 24.7892 25.125 24.375 25.125C23.9608 25.125 23.625 24.7892 23.625 24.375C23.625 23.9608 23.9608 23.625 24.375 23.625C24.7892 23.625 25.125 23.9608 25.125 24.375Z"
        fill={color}
      />
    </Svg>
  );
}


