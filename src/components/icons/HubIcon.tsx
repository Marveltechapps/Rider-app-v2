/**
 * Hub Icon Component
 * Hub/warehouse icon for hub cards
 * Downloaded from Figma node-id: 13454:228
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface HubIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function HubIcon({
  size = 42,
  color = '#6A7282',
  style,
}: HubIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      style={style}
    >
      <Path
        d="M0 12.75C0 5.70837 5.70837 0 12.75 0H29.25C36.2916 0 42 5.70837 42 12.75V29.25C42 36.2916 36.2916 42 29.25 42H12.75C5.70837 42 0 36.2916 0 29.25V12.75Z"
        fill="#F3F4F6"
      />
      <Path
        d="M26.25 28.875V19.25C26.25 19.0179 26.1578 18.7954 25.9937 18.6313C25.8296 18.4672 25.6071 18.375 25.375 18.375H16.625C16.3929 18.375 16.1704 18.4672 16.0063 18.6313C15.8422 18.7954 15.75 19.0179 15.75 19.25V28.875"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M29.75 27.125C29.75 27.5891 29.5656 28.0342 29.2374 28.3624C28.9092 28.6906 28.4641 28.875 28 28.875H14C13.5359 28.875 13.0908 28.6906 12.7626 28.3624C12.4344 28.0342 12.25 27.5891 12.25 27.125V17.5C12.2498 17.1705 12.3427 16.8475 12.5179 16.5684C12.6931 16.2893 12.9436 16.0654 13.2405 15.9224L20.1967 12.4451C20.4452 12.3167 20.7208 12.2497 21.0004 12.2497C21.2801 12.2497 21.5557 12.3167 21.8041 12.4451L28.7586 15.9224C29.0557 16.0653 29.3063 16.2892 29.4817 16.5683C29.6571 16.8474 29.7501 17.1704 29.75 17.5V27.125Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15.75 21.875H26.25"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15.75 25.375H26.25"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

