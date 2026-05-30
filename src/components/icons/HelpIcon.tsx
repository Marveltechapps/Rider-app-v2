/**
 * Help Icon Component
 * Help/question mark icon
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface HelpIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function HelpIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: HelpIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Circle 
        cx="9" 
        cy="9" 
        r="7.5" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <Path
        d="M6.75 6.75C6.75 5.50736 7.75736 4.5 9 4.5C10.2426 4.5 11.25 5.50736 11.25 6.75C11.25 7.99264 10.2426 9 9 9V10.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="12.75" r="0.75" fill={color} />
    </Svg>
  );
}

