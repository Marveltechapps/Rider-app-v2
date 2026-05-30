/**
 * Weekly Bar Chart Component
 * Displays a bar chart showing earnings per day of the week
 * Matches Figma design exactly
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './common/Text';
import { Theme } from '../constants/Theme';
import { scale } from '../utils/responsive';

export interface WeeklyBarData {
  dayLabel: string;
  value: number;
}

interface WeeklyBarChartProps {
  data: WeeklyBarData[];
  maxValue?: number;
}

export default function WeeklyBarChart({ data, maxValue }: WeeklyBarChartProps) {
  // Calculate max value from data if not provided
  const calculatedMax = maxValue || Math.max(...data.map((item) => item.value), 1);
  // Max height for bars: 133px total - 14px label = 119px available for bars
  const maxBarHeight = 112;

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const heightPercentage = (item.value / calculatedMax) * 100;
        const barHeight = Math.max((maxBarHeight * heightPercentage) / 100, 0);

        return (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: scale(barHeight),
                  },
                ]}
              />
              {/* Tooltip would go here but opacity 0 in Figma */}
            </View>
            <Text variant="caption" color="#6B7280" style={styles.dayLabel}>
              {item.dayLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'flex-end',
    gap: scale(7),
    height: scale(132),
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: scale(14),
  },
  bar: {
    width: scale(37),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8.75),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dayLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    textAlign: 'center',
  },
});

