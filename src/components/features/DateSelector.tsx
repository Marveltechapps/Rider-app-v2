/**
 * Date Selector Component
 * Modal for selecting a date within the next 10 days
 */

import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';

interface DateSelectorProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DateSelector({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
}: DateSelectorProps) {
  const [dates] = useState(() => {
    const dateArray: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  });

  const formatDateLabel = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
    }
  };

  const formatDateDisplay = (date: Date): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDatePress = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="h3" color={Theme.colors.textDark} style={styles.title}>
              Select Date
            </Text>
            <View style={styles.datesContainer}>
              {dates.map((date, index) => {
                const selected = isSelected(date);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateChip, selected && styles.dateChipSelected]}
                    onPress={() => handleDatePress(date)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="caption"
                      color={selected ? Theme.colors.white : Theme.colors.textLabel}
                      style={styles.dateLabel}
                    >
                      {formatDateLabel(date)}
                    </Text>
                    <Text
                      variant="caption"
                      color={selected ? Theme.colors.white : Theme.colors.textGrey}
                      style={styles.dateDisplay}
                    >
                      {formatDateDisplay(date)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: scale(400),
  },
  content: {
    backgroundColor: Theme.colors.white,
    borderRadius: scale(16),
    padding: scale(20),
    gap: scale(16),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    justifyContent: 'center',
  },
  dateChip: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(14),
    borderRadius: scale(9999),
    backgroundColor: Theme.colors.gray100,
    minWidth: scale(80),
    alignItems: 'center',
    gap: scale(2),
  },
  dateChipSelected: {
    backgroundColor: Theme.colors.primaryMedium,
  },
  dateLabel: {
    fontSize: scale(12),
    fontWeight: '600',
  },
  dateDisplay: {
    fontSize: scale(10),
    fontWeight: '400',
  },
});

