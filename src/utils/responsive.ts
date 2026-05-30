/**
 * Responsive Design Utilities
 * Scale values based on screen dimensions
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro - 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale based on width
 */
export const scale = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Scale based on height
 */
export const verticalScale = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Moderate scale (less aggressive scaling)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size + (scale - 1) * size * factor));
};

/**
 * Width percentage
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Height percentage
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

