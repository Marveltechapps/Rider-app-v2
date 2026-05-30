/**
 * Document Text Icon Component
 * Document with text lines icon for Terms & Privacy
 */

import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface DocumentTextIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DocumentTextIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: DocumentTextIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M10.5 1.5H4.5C4.10218 1.5 3.72064 1.65804 3.43934 1.93934C3.15804 2.22064 3 2.60218 3 3V15C3 15.3978 3.15804 15.7794 3.43934 16.0607C3.72064 16.342 4.10218 16.5 4.5 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V6L10.5 1.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 1.5V6H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="6" y1="9" x2="12" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="6" y1="12" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

