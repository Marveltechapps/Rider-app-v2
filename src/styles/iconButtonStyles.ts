import { StyleSheet, ViewStyle } from 'react-native';
import { scale } from '../utils/responsive';
import { Theme } from '../constants/Theme';

/** Consistent centered circular icon buttons across workflow screens. */
export function centeredIconButton(size = 48): ViewStyle {
  const s = scale(size);
  return {
    width: s,
    height: s,
    borderRadius: s / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  };
}

export const iconButtonStyles = StyleSheet.create({
  primary: {
    ...centeredIconButton(48),
    backgroundColor: Theme.colors.primaryMedium,
  },
  light: {
    ...centeredIconButton(48),
    backgroundColor: Theme.colors.white,
  },
  call: {
    ...centeredIconButton(48),
    backgroundColor: Theme.colors.primaryMedium,
  },
});
