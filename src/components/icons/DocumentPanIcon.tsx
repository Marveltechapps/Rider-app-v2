/**
 * Document PAN Icon Component
 * PAN card document icon matching Figma design
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DocumentPanIconProps {
  size?: number;
  color?: string;
}

export default function DocumentPanIcon({
  size = 42,
  color = '#99A1AF',
}: DocumentPanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <Path
        d="M0 12.75C0 5.70837 5.70837 0 12.75 0H29.25C36.2916 0 42 5.70837 42 12.75V29.25C42 36.2916 36.2916 42 29.25 42H12.75C5.70837 42 0 36.2916 0 29.25V12.75Z"
        fill="#F3F4F6"
      />
      <Path
        d="M23.625 12.25H15.75C15.2859 12.25 14.8408 12.4344 14.5126 12.7626C14.1844 13.0908 14 13.5359 14 14V28C14 28.4641 14.1844 28.9092 14.5126 29.2374C14.8408 29.5656 15.2859 29.75 15.75 29.75H26.25C26.7141 29.75 27.1592 29.5656 27.4874 29.2374C27.8156 28.9092 28 28.4641 28 28V16.625L23.625 12.25Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M22.75 12.25V15.75C22.75 16.2141 22.9344 16.6592 23.2626 16.9874C23.5908 17.3156 24.0359 17.5 24.5 17.5H28"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M19.25 18.375H17.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M24.5 21.875H17.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M24.5 25.375H17.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

