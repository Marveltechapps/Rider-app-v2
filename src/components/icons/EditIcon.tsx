/**
 * Edit Icon Component
 * Edit/pencil icon
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface EditIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function EditIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: EditIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.875 1.875C14.1734 1.57663 14.5777 1.40918 15 1.40918C15.4223 1.40918 15.8266 1.57663 16.125 1.875C16.4234 2.17337 16.5908 2.57768 16.5908 3C16.5908 3.42232 16.4234 3.82663 16.125 4.125L9 11.25L6 12L6.75 9L13.875 1.875Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
