/**
 * Shared screen shell for Profile → Edit Profile and related flows.
 * Keeps SafeAreaView, container, and Header layout identical across screens.
 */

import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import editProfileStyles from '../../styles/editProfileStyles';
import Header from './Header';

export type ProfileScreenShellProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  /** When true, reserves the same subtitle row height as Edit Profile (no visible text). */
  reserveSubtitleSpace?: boolean;
  children: ReactNode;
};

export default function ProfileScreenShell({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  reserveSubtitleSpace = false,
  children,
}: ProfileScreenShellProps) {
  return (
    <SafeAreaView style={editProfileStyles.container} edges={['top', 'bottom']}>
      <Header
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        showBackButton={showBackButton}
        reserveSubtitleSpace={reserveSubtitleSpace}
      />
      {children}
    </SafeAreaView>
  );
}
