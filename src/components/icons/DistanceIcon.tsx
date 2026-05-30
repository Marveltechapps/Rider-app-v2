/**
 * Distance Icon Component
 * Map pin icon for distance display
 * Exact SVG from Figma
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface DistanceIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DistanceIcon({ 
  size = 14, 
  color = '#99A1AF',
  style 
}: DistanceIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M10.8337 5.41684C10.8337 8.12138 7.83339 10.938 6.82589 11.808C6.73203 11.8785 6.61778 11.9167 6.50035 11.9167C6.38291 11.9167 6.26866 11.8785 6.1748 11.808C5.1673 10.938 2.16701 8.12138 2.16701 5.41684C2.16701 4.26757 2.62356 3.16537 3.43622 2.35271C4.24887 1.54005 5.35107 1.08351 6.50035 1.08351C7.64962 1.08351 8.75182 1.54005 9.56448 2.35271C10.3771 3.16537 10.8337 4.26757 10.8337 5.41684Z"
        stroke={color}
        strokeWidth="1.02083"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 7.04149C7.39746 7.04149 8.125 6.31396 8.125 5.41649C8.125 4.51903 7.39746 3.79149 6.5 3.79149C5.60254 3.79149 4.875 4.51903 4.875 5.41649C4.875 6.31396 5.60254 7.04149 6.5 7.04149Z"
        stroke={color}
        strokeWidth="1.02083"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
