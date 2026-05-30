/**
 * Call Icon Component
 * Icon for call button
 * From Figma node 13506:2264
 */

import React from 'react';
import Svg, { Path, Defs, Filter, FeFlood, FeColorMatrix, FeMorphology, FeOffset, FeGaussianBlur, FeComposite, FeBlend, ClipPath, Rect, G } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CallIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CallIcon({
  size = 18,
  color = '#FFFFFF',
  style,
}: CallIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 17.5 17.5"
      fill="none"
      style={style}
    >
      <G clipPath="url(#clip0_13506_2264)">
        <Path
          d="M10.0855 9.3308C10.2361 9.4 10.4058 9.4158 10.5665 9.3756C10.7273 9.3355 10.8696 9.2418 10.97 9.1099L11.2288 8.7708C11.3647 8.5897 11.5408 8.4427 11.7433 8.3415C11.9458 8.2402 12.1691 8.1875 12.3955 8.1875H14.583C14.9698 8.1875 15.3407 8.3412 15.6142 8.6146C15.8877 8.8881 16.0413 9.2591 16.0413 9.6458V11.8333C16.0413 12.2201 15.8877 12.591 15.6142 12.8645C15.3407 13.138 14.9698 13.2917 14.583 13.2917C11.102 13.2917 7.7636 11.9089 5.3022 9.4475C2.8408 6.986 1.458 3.6476 1.458 0.166667C1.458 -0.220083 1.6117 -0.591 1.8851 -0.8645C2.1586 -1.138 2.5296 -1.29167 2.9163 -1.29167H5.1038C5.4906 -1.29167 5.8615 -1.138 6.135 -0.8645C6.4085 -0.591 6.5622 -0.220083 6.5622 0.166667V2.35417C6.5622 2.58056 6.5095 2.80394 6.4082 3.00639C6.307 3.20889 6.16 3.385 5.9788 3.52083L5.6376 3.77683C5.5037 3.879 5.4094 4.02439 5.3706 4.18833C5.3318 4.35222 5.3509 4.5245 5.4247 4.67583C6.4212 6.69994 8.0602 8.33683 10.0855 9.3308Z"
          stroke={color}
          strokeWidth="1.45833"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13506_2264">
          <Rect width="17.5" height="17.5" fill="white" transform="translate(0 0)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

