/**
 * Phone Icon Component
 * Phone/call icon
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface PhoneIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function PhoneIcon({ 
  size = 18, 
  color = '#237227',
  style 
}: PhoneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M16.5 12.75V15C16.5 15.3978 16.342 15.7794 16.0607 16.0607C15.7794 16.342 15.3978 16.5 15 16.5C11.6185 16.2522 8.36301 15.0391 5.6025 13C3.01249 11.0993 0.990743 8.58749 0 5.625C0 5.22718 0.158035 4.84564 0.43934 4.56434C0.720644 4.28304 1.10218 4.125 1.5 4.125H3.75C4.10869 4.125 4.41761 4.37156 4.4775 4.7175C4.53094 5.06344 4.61156 5.40469 4.71844 5.7375C4.82531 6.07031 4.74469 6.43594 4.50844 6.69L3.54094 7.6575C4.76156 10.2919 6.95813 12.4884 9.59156 13.7091L10.5591 12.7416C10.8131 12.5053 11.1787 12.4247 11.5116 12.5316C11.8444 12.6384 12.1856 12.7191 12.5316 12.7725C12.8775 12.8325 13.125 13.1413 13.125 13.5V15.75C13.125 15.9489 13.046 16.1397 12.9053 16.2803C12.7647 16.421 12.5739 16.5 12.375 16.5H12.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

