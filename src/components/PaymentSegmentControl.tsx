/**
 * Payment Segment Control Component
 * Two-tab segmented control for Bank Account / UPI ID
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './common/Text';
import { scale, verticalScale } from '../utils/responsive';

export type PaymentTab = 'bank' | 'upi';

interface PaymentSegmentControlProps {
  activeTab: PaymentTab;
  onChangeTab: (tab: PaymentTab) => void;
}

export default function PaymentSegmentControl({
  activeTab,
  onChangeTab,
}: PaymentSegmentControlProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'bank' && styles.tabActive,
        ]}
        onPress={() => onChangeTab('bank')}
        activeOpacity={0.7}
      >
        <Text
          variant="bodySm"
          style={[
            styles.tabText,
            activeTab === 'bank' && styles.tabTextActive,
          ]}
        >
          Bank Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'upi' && styles.tabActive,
        ]}
        onPress={() => onChangeTab('upi')}
        activeOpacity={0.7}
      >
        <Text
          variant="bodySm"
          style={[
            styles.tabText,
            activeTab === 'upi' && styles.tabTextActive,
          ]}
        >
          UPI ID
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
    width: scale(360),
    height: scale(48),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(12.75),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(5.25),
    paddingVertical: verticalScale(3.5),
    paddingHorizontal: scale(7),
    height: scale(40),
    borderRadius: scale(8.75),
    borderWidth: 1,
    borderColor: 'transparent',
    margin: scale(4),
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: scale(12.25),
    fontWeight: '700',
    lineHeight: scale(17.5),
    color: '#0A0A0A',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#0A0A0A',
  },
});

