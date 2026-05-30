/**
 * Calendar Modal Component
 * Modal for selecting a date from a calendar grid
 * Allows user to navigate months and select any date
 * Matches app design system
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from './common/Text';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
}

export default function CalendarModal({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts (Monday start)
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  // Check if a date is selected
  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if a date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle day press
  const handleDayPress = useCallback((date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  }, []);

  // Navigate to previous month
  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }, [currentMonth]);

  // Navigate to next month
  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }, [currentMonth]);

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[date.getMonth()];
  };

  const handleApply = useCallback(() => {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }
    onClose();
  }, [selectedDate, onSelectDate, onClose]);

  const handleClear = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedDate(initialDate);
    onClose();
  }, [initialDate, onClose]);

  // Week day headers
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={handleCancel}
        />
        <View style={styles.modalContainerWrapper}>
          <SafeAreaView style={styles.modalContainer} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="h3" color="#101828" style={styles.headerTitle}>
                Select Date
              </Text>
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <Text variant="body" color="#6A7282">
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Selected Date Display */}
            {selectedDate && (
              <View style={styles.selectedDateContainer}>
                <Text variant="caption" color="#6A7282" style={styles.selectedDateLabel}>
                  Selected Date
                </Text>
                <Text variant="body" color="#101828" style={styles.selectedDateText}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Month Header */}
              <View style={styles.monthHeader}>
                <TouchableOpacity onPress={handlePrevMonth} activeOpacity={0.7} style={styles.monthNavButton}>
                  <Text variant="body" color="#101828" style={styles.monthNavText}>‹</Text>
                </TouchableOpacity>
                <Text variant="h3" color="#101828" style={styles.monthTitle}>
                  {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} activeOpacity={0.7} style={styles.monthNavButton}>
                  <Text variant="body" color="#101828" style={styles.monthNavText}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Week Day Headers */}
              <View style={styles.weekDaysHeader}>
                {weekDays.map((day, index) => (
                  <View key={index} style={styles.weekDayHeader}>
                    <Text variant="caption" color="#6B7280" style={styles.weekDayText}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <View key={index} style={styles.dayCell} />;
                  }

                  const isSelected = isDateSelected(date);
                  const isTodayDate = isToday(date);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                        isTodayDate && !isSelected && styles.dayCellToday,
                      ]}
                      onPress={() => handleDayPress(date)}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="body"
                        style={[
                          styles.dayText,
                          isSelected && styles.dayTextSelected,
                          isTodayDate && !isSelected && styles.dayTextToday,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isTodayDate
                              ? Theme.colors.primaryMedium
                              : '#101828',
                          },
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleClear} activeOpacity={0.7} style={styles.clearButton}>
                <Text variant="body" color="#6A7282" style={styles.clearButtonText}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleApply} 
                activeOpacity={0.7} 
                style={[styles.applyButton, !selectedDate && styles.applyButtonDisabled]}
                disabled={!selectedDate}
              >
                <Text variant="body" color={Theme.colors.white} style={styles.applyButtonText}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  modalContainerWrapper: {
    width: '100%',
    maxHeight: '85%',
    zIndex: 10,
    elevation: 10,
  },
  modalContainer: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    width: '100%',
    ...Theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  selectedDateContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedDateLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    marginBottom: scale(4),
  },
  selectedDateText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  monthNavButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
    backgroundColor: '#F3F4F6',
  },
  monthNavText: {
    fontSize: scale(24),
    lineHeight: scale(32),
    fontWeight: '700',
  },
  monthTitle: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  weekDayText: {
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(20),
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
  },
  dayCellSelected: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
  },
  dayText: {
    fontSize: scale(14),
    fontWeight: '400',
    textAlign: 'center',
  },
  dayTextSelected: {
    fontWeight: '700',
  },
  dayTextToday: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    backgroundColor: Theme.colors.primaryMedium,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  applyButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
  },
});

