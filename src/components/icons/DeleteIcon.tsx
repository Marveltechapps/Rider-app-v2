/**
 * Delete Icon Component
 * SVG icon for delete/remove actions
 * Downloaded from Figma node-id: 13463-665
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface DeleteIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DeleteIcon({ 
  size = 20, 
  color = '#FB2C36',
  style,
}: DeleteIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 28 28" 
      fill="none"
      style={style}
    >
      <Path
        d="M12.3335 13.1667V18.1667"
        fill="none"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.6665 13.1667V18.1667"
        fill="none"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.8332 9V20.6667C19.8332 21.1087 19.6576 21.5326 19.345 21.8452C19.0325 22.1577 18.6085 22.3333 18.1665 22.3333H9.83317C9.39114 22.3333 8.96722 22.1577 8.65466 21.8452C8.3421 21.5326 8.1665 21.1087 8.1665 20.6667V9"
        fill="none"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 9H21.5"
        fill="none"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.6665 9V7.33333C10.6665 6.8913 10.8421 6.46738 11.1547 6.15482C11.4672 5.84226 11.8911 5.66666 12.3332 5.66666H15.6665C16.1085 5.66666 16.5325 5.84226 16.845 6.15482C17.1576 6.46738 17.3332 6.8913 17.3332 7.33333V9"
        fill="none"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
