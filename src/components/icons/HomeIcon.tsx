import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '../../constants/Theme';

interface HomeIconProps {
  size?: number;
  color?: string;
  active?: boolean;
  style?: ViewStyle;
}

export default function HomeIcon({
  size = 21,
  color,
  active = false,
  style,
}: HomeIconProps) {
  const iconColor = color || (active ? Theme.colors.white : Theme.colors.textLight);
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      style={style}
    >
      {/* Door/Window */}
      <Path
        d="M23.625 27.125V21C23.625 20.7679 23.533 20.5454 23.3689 20.3813C23.2048 20.2172 22.9822 20.125 22.75 20.125H19.25C19.0179 20.125 18.7954 20.2172 18.6313 20.3813C18.4672 20.5454 18.375 20.7679 18.375 21V27.125"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House outline with roof */}
      <Path
        d="M13.125 20.125L21 12.25L28.875 20.125V28.875C28.875 29.3723 28.6775 29.8492 28.3258 30.2009C27.9741 30.5526 27.4973 30.75 27 30.75H15C14.5027 30.75 14.0258 30.5526 13.6742 30.2009C13.3225 29.8492 13.125 29.3723 13.125 28.875V20.125Z"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

