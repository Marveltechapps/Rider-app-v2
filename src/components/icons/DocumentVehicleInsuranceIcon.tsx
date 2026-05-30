/**
 * Document Vehicle Insurance Icon Component
 * Vehicle Insurance document icon matching Figma design
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DocumentVehicleInsuranceIconProps {
  size?: number;
  color?: string;
}

export default function DocumentVehicleInsuranceIcon({
  size = 42,
  color = '#99A1AF',
}: DocumentVehicleInsuranceIconProps) {
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
      {/* Shield/Insurance icon inside document */}
      <Path
        d="M21 18.375C21 18.375 19.25 17.5 19.25 19.25V22.75C19.25 24.125 20.125 25 21 25.375C21.875 25 22.75 24.125 22.75 22.75V19.25C22.75 17.5 21 18.375 21 18.375Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Checkmark inside shield */}
      <Path
        d="M19.6875 20.5625L20.5625 21.4375L22.3125 19.6875"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


