/**
 * Earnings Segment Control Component
 * Custom segmented control for Today / This Week / This Month tabs
 * Matches Figma design exactly
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from '../utils/responsive';
import Text from './common/Text';

export type EarningsTab = 'today' | 'thisWeek' | 'thisMonth';

interface EarningsSegmentControlProps {
  activeTab: EarningsTab;
  onChangeTab: (tab: EarningsTab) => void;
}

export default function EarningsSegmentControl({
  activeTab,
  onChangeTab,
}: EarningsSegmentControlProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          activeTab === 'today' && styles.buttonActive,
        ]}
        onPress={() => onChangeTab('today')}
        activeOpacity={0.8}
      >
        <Text
          variant="body"
          color={activeTab === 'today' ? '#101828' : '#6A7282'}
          style={styles.buttonText}
          numberOfLines={1}
        >
          Today
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          activeTab === 'thisWeek' && styles.buttonActive,
        ]}
        onPress={() => onChangeTab('thisWeek')}
        activeOpacity={0.8}
      >
        <Text
          variant="body"
          color={activeTab === 'thisWeek' ? '#101828' : '#6A7282'}
          style={styles.buttonText}
          numberOfLines={1}
        >
          This Week
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          activeTab === 'thisMonth' && styles.buttonActive,
        ]}
        onPress={() => onChangeTab('thisMonth')}
        activeOpacity={0.8}
      >
        <Text
          variant="body"
          color={activeTab === 'thisMonth' ? '#101828' : '#6A7282'}
          style={styles.buttonText}
          numberOfLines={1}
        >
          This Month
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    gap: scale(6),
    padding: scale(8),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8),
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(8),
    minHeight: 0,
  },
  buttonActive: {
    backgroundColor: '#FFFFFF',
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: scale(14),
    lineHeight: scale(20), // 14 * 1.428 (reduced for single line)
    fontWeight: '400',
    textAlign: 'center',
  },
});

