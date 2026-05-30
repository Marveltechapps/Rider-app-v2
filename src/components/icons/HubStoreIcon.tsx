/**
 * Hub Store Icon Component
 * Icon for hub/store location with green background
 * From Figma node 13506:2244
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface HubStoreIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function HubStoreIcon({
  size = 24,
  color = '#32C96A',
  style,
}: HubStoreIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 49 49"
      fill="none"
      style={style}
    >
      <Path
        d="M0 14C0 6.26801 6.26801 0 14 0H35C42.732 0 49 6.26801 49 14V35C49 42.732 42.732 49 35 49H14C6.26801 49 0 42.732 0 35V14Z"
        fill={color}
        fillOpacity="0.1"
      />
      <Path
        d="M30.625 33.6875V22.4583C30.625 22.1876 30.5174 21.9279 30.326 21.7365C30.1346 21.5451 29.8749 21.4375 29.6042 21.4375H19.3958C19.1251 21.4375 18.8654 21.5451 18.674 21.7365C18.4826 21.9279 18.375 22.1876 18.375 22.4583V33.6875"
        stroke={color}
        strokeWidth="2.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M34.7087 31.6459C34.7087 32.1873 34.4936 32.7066 34.1107 33.0895C33.7278 33.4724 33.2085 33.6875 32.667 33.6875H16.3337C15.7922 33.6875 15.2729 33.4724 14.89 33.0895C14.5071 32.7066 14.292 32.1873 14.292 31.6459V20.4167C14.2918 20.0322 14.4001 19.6555 14.6045 19.3299C14.809 19.0043 15.1012 18.743 15.4476 18.5761L23.5632 14.5193C23.853 14.3695 24.1746 14.2913 24.5008 14.2913C24.8271 14.2913 25.1486 14.3695 25.4385 14.5193L33.5521 18.5761C33.8986 18.7428 34.1911 19.004 34.3957 19.3297C34.6003 19.6553 34.7088 20.0321 34.7087 20.4167V31.6459Z"
        stroke={color}
        strokeWidth="2.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.375 25.5208H30.625"
        stroke={color}
        strokeWidth="2.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.375 29.6042H30.625"
        stroke={color}
        strokeWidth="2.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

