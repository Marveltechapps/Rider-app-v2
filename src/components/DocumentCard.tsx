/**
 * Document Card Component
 * Displays document information with status badge
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import documentsStyles from '../styles/documentsStyles';
import { RiderDocument } from '../types/documents';
import { scale } from '../utils/responsive';
import Text from './common/Text';
import ChevronRightIcon from './icons/ChevronRightIcon';
import DocumentAadharIcon from './icons/DocumentAadharIcon';
import DocumentDrivingIcon from './icons/DocumentDrivingIcon';
import DocumentPanIcon from './icons/DocumentPanIcon';
import DocumentVehicleInsuranceIcon from './icons/DocumentVehicleInsuranceIcon';
import DocumentVehicleRCIcon from './icons/DocumentVehicleRCIcon';
import FileIcon from './icons/FileIcon';

interface DocumentCardProps {
  document: RiderDocument;
  onPress?: () => void;
  showStatus?: boolean;
}

export default function DocumentCard({ 
  document, 
  onPress,
  showStatus = true,
}: DocumentCardProps) {
  // Select icon based on document name - using specific document icons
  const getDocumentIcon = () => {
    const name = document.name.toLowerCase();
    if (name.includes('aadhar')) {
      return <DocumentAadharIcon size={scale(42)} color="#32C96A" />;
    } else if (name.includes('pan')) {
      return <DocumentPanIcon size={scale(42)} color="#99A1AF" />;
    } else if (name.includes('driving license') || name.includes('license')) {
      return <DocumentDrivingIcon size={scale(42)} color="#99A1AF" />;
    } else if (name.includes('vehicle rc') || (name.includes('vehicle') && name.includes('rc'))) {
      return <DocumentVehicleRCIcon size={scale(42)} color="#99A1AF" />;
    } else if (name.includes('insurance')) {
      return <DocumentVehicleInsuranceIcon size={scale(42)} color="#99A1AF" />;
    }
    return <FileIcon size={scale(18)} color="#4A5565" />;
  };

  // Get status badge style
  const getStatusBadgeStyle = () => {
    switch (document.status) {
      case 'verified':
        return [documentsStyles.statusBadge, documentsStyles.statusBadgeVerified];
      case 'pending':
        return [documentsStyles.statusBadge, documentsStyles.statusBadgePending];
      case 'expired':
        return [documentsStyles.statusBadge, documentsStyles.statusBadgeExpired];
    }
  };

  const getStatusTextStyle = () => {
    switch (document.status) {
      case 'verified':
        return [documentsStyles.statusBadgeText, documentsStyles.statusTextVerified];
      case 'pending':
        return [documentsStyles.statusBadgeText, documentsStyles.statusTextPending];
      case 'expired':
        return [documentsStyles.statusBadgeText, documentsStyles.statusTextExpired];
    }
  };

  const getStatusLabel = () => {
    switch (document.status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'expired':
        return 'Expired';
    }
  };

  // Get status badge icon (checkmark for verified)
  const getStatusIcon = () => {
    if (document.status === 'verified') {
      return (
        <Svg width={scale(10.5)} height={scale(10.5)} viewBox="0 0 10.5 10.5" fill="none">
          <Path
            d="M1.75 2.63L7.75 7.44"
            stroke="#32C96A"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={documentsStyles.documentCard}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${document.name} document, status ${document.status}, updated ${document.updatedOn}`}
      accessibilityHint="View document details"
    >
      {/* Top: Icon + Info + Status */}
      <View style={documentsStyles.documentCardTop}>
        <View style={documentsStyles.documentCardLeft}>
          <View style={documentsStyles.documentIconContainer}>
            {getDocumentIcon()}
          </View>
          <View style={documentsStyles.documentInfo}>
            <Text variant="body" color="#101828" style={documentsStyles.documentName}>
              {document.name}
            </Text>
            <Text variant="caption" color="#6B7280" style={documentsStyles.documentUpdated} numberOfLines={1}>
              Updated: {document.updatedOn}
            </Text>
          </View>
        </View>
        {showStatus && (
          <View style={getStatusBadgeStyle()}>
            {getStatusIcon()}
            <Text variant="caption" style={getStatusTextStyle()}>
              {getStatusLabel()}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom: File name row */}
      <View style={documentsStyles.documentFileRow}>
        <View style={documentsStyles.documentFileRowLeft}>
          <FileIcon size={scale(16)} color="#6B7280" />
          <Text variant="bodySm" color="#4A5565" style={documentsStyles.documentFileName} numberOfLines={1}>
            {document.fileName}
          </Text>
        </View>
        <ChevronRightIcon size={scale(16)} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
}

