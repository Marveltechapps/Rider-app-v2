/**
 * Document Aadhar Icon Component
 * Aadhar card document icon matching Figma design
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DocumentAadharIconProps {
  size?: number;
  color?: string;
}

export default function DocumentAadharIcon({
  size = 42,
  color = '#237227',
}: DocumentAadharIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <Path
        d="M0 12.75C0 5.70837 5.70837 0 12.75 0H29.25C36.2916 0 42 5.70837 42 12.75V29.25C42 36.2916 36.2916 42 29.25 42H12.75C5.70837 42 0 36.2916 0 29.25V12.75Z"
        fill={color}
        fillOpacity="0.1"
      />
      <Path
        d="M28 14.875H14C13.0335 14.875 12.25 15.6585 12.25 16.625V25.375C12.25 26.3415 13.0335 27.125 14 27.125H28C28.9665 27.125 29.75 26.3415 29.75 25.375V16.625C29.75 15.6585 28.9665 14.875 28 14.875Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.25 19.25H29.75"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


