/**
 * Week Calendar Modal Component
 * Modal for selecting a week from the calendar
 * Allows user to pick any week and see the selected week range
 * Matches app design system
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import Text from './common/Text';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

export interface WeekRange {
  startDate: Date;
  endDate: Date;
}

interface WeekCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectWeek: (weekRange: WeekRange) => void;
  initialWeek?: WeekRange;
}

export default function WeekCalendarModal({
  visible,
  onClose,
  onSelectWeek,
  initialWeek,
}: WeekCalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | undefined>(initialWeek);

  // Get start of week (Monday) for a given date
  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get end of week (Sunday) for a given date
  const getEndOfWeek = (date: Date): Date => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  // Generate calendar days for current month, including adjacent month days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Calculate how many days from previous month to show
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Monday = 0
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = adjustedStart - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(new Date(year, month - 1, day));
    }
    
    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add days from next month to complete the last week (if needed)
    const totalDays = days.length;
    const remainingCells = totalDays % 7;
    if (remainingCells > 0) {
      const daysToAdd = 7 - remainingCells;
      for (let day = 1; day <= daysToAdd; day++) {
        days.push(new Date(year, month + 1, day));
      }
    }
    
    return days;
  }, [currentMonth]);

  // Check if a date is in current month
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  // Check if a date is in the selected week range
  const isDateInSelectedWeek = (date: Date | null): boolean => {
    if (!date || !selectedWeek) return false;
    return date >= selectedWeek.startDate && date <= selectedWeek.endDate;
  };

  // Check if a date is the start of selected week
  const isWeekStart = (date: Date | null): boolean => {
    if (!date || !selectedWeek) return false;
    return date.getTime() === selectedWeek.startDate.getTime();
  };

  // Check if a date is the end of selected week
  const isWeekEnd = (date: Date | null): boolean => {
    if (!date || !selectedWeek) return false;
    return date.getTime() === selectedWeek.endDate.getTime();
  };

  // Handle day press - select the week containing that day
  const handleDayPress = (date: Date | null) => {
    if (!date) return;
    
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = getEndOfWeek(date);
    
    setSelectedWeek({ startDate: startOfWeek, endDate: endOfWeek });
  };

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Navigate to previous week
  const handlePrevWeek = () => {
    if (selectedWeek) {
      const prevWeekStart = new Date(selectedWeek.startDate);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(prevWeekStart);
      prevWeekEnd.setDate(prevWeekStart.getDate() + 6);
      const newWeek = { startDate: prevWeekStart, endDate: prevWeekEnd };
      setSelectedWeek(newWeek);
      // Update current month to show the selected week's month
      setCurrentMonth(new Date(prevWeekStart.getFullYear(), prevWeekStart.getMonth(), 1));
    } else {
      // If no week selected, select previous week from today
      const today = new Date();
      const prevWeekStart = new Date(today);
      prevWeekStart.setDate(today.getDate() - 7);
      const startOfWeek = getStartOfWeek(prevWeekStart);
      const endOfWeek = getEndOfWeek(prevWeekStart);
      setSelectedWeek({ startDate: startOfWeek, endDate: endOfWeek });
      setCurrentMonth(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1));
    }
  };

  // Navigate to next week
  const handleNextWeek = () => {
    if (selectedWeek) {
      const nextWeekStart = new Date(selectedWeek.startDate);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      const newWeek = { startDate: nextWeekStart, endDate: nextWeekEnd };
      setSelectedWeek(newWeek);
      // Update current month to show the selected week's month
      setCurrentMonth(new Date(nextWeekStart.getFullYear(), nextWeekStart.getMonth(), 1));
    } else {
      // If no week selected, select next week from today
      const today = new Date();
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + 7);
      const startOfWeek = getStartOfWeek(nextWeekStart);
      const endOfWeek = getEndOfWeek(nextWeekStart);
      setSelectedWeek({ startDate: startOfWeek, endDate: endOfWeek });
      setCurrentMonth(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1));
    }
  };

  // Format week range for display
  const formatWeekRange = (weekRange: WeekRange | undefined): string => {
    if (!weekRange) return '';
    const start = weekRange.startDate;
    const end = weekRange.endDate;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${start.getFullYear()}`;
    }
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[date.getMonth()];
  };

  const handleConfirm = () => {
    if (selectedWeek) {
      onSelectWeek(selectedWeek);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedWeek(initialWeek);
    onClose();
  };

  // Week day headers
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (visible) {
      // Reset to initial week or current week when modal opens
      if (initialWeek) {
        setSelectedWeek(initialWeek);
        setCurrentMonth(new Date(initialWeek.startDate.getFullYear(), initialWeek.startDate.getMonth(), 1));
      } else {
        // Default to current week
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);
        const currentWeek = { startDate: startOfWeek, endDate: endOfWeek };
        setSelectedWeek(currentWeek);
        setCurrentMonth(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1));
      }
    }
  }, [visible, initialWeek]);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={handleCancel}
        />
        <View style={styles.modalContainerWrapper} pointerEvents="box-none">
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <Text variant="body" color="#6A7282">
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text variant="h3" color="#101828" style={styles.headerTitle}>
                Select Week
              </Text>
              <TouchableOpacity 
                onPress={handleConfirm} 
                activeOpacity={0.7}
                disabled={!selectedWeek}
              >
                <Text 
                  variant="body" 
                  color={selectedWeek ? Theme.colors.primaryMedium : '#D1D5DB'} 
                  style={styles.confirmText}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>

          {/* Month Header */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth} activeOpacity={0.7} style={styles.monthNavButton}>
              <ChevronLeftIcon size={scale(20)} color="#101828" />
            </TouchableOpacity>
            <Text variant="h3" color="#101828" style={styles.monthTitle}>
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} activeOpacity={0.7} style={styles.monthNavButton}>
              <ChevronRightIcon size={scale(20)} color="#101828" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <View key={index} style={styles.dayCell} />;
                }

                const isSelected = isDateInSelectedWeek(date);
                const isStart = isWeekStart(date);
                const isEnd = isWeekEnd(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isCurrentMonthDay = isCurrentMonth(date);

                return (
                  <TouchableOpacity
                    key={`${date.getTime()}-${index}`}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isStart && styles.dayCellStart,
                      isEnd && styles.dayCellEnd,
                    ]}
                    onPress={() => handleDayPress(date)}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <View 
                        style={[
                          styles.daySelectedBackground, 
                          (isStart || isEnd) && styles.daySelectedBackgroundFull
                        ]} 
                      />
                    )}
                    <View style={styles.dayTextContainer}>
                      <Text
                        variant="body"
                        color={
                          isSelected
                            ? Theme.colors.primaryMedium
                            : isToday
                            ? Theme.colors.primaryMedium
                            : isCurrentMonthDay
                            ? '#101828'
                            : '#9CA3AF' // Gray for adjacent month days
                        }
                        style={
                          isSelected
                            ? [styles.dayText, styles.dayTextSelected]
                            : isToday
                            ? [styles.dayText, styles.dayTextToday]
                            : !isCurrentMonthDay
                            ? [styles.dayText, styles.dayTextAdjacentMonth]
                            : styles.dayText
                        }
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Selected Week Display with Navigation */}
          <View style={styles.selectedWeekContainer}>
            <View style={styles.selectedWeekHeader}>
              <Text variant="caption" color="#6A7282" style={styles.selectedWeekLabel}>
                Selected Week
              </Text>
              {/* Week Navigation Buttons */}
              <View style={styles.weekNavButtons}>
                <TouchableOpacity 
                  onPress={handlePrevWeek} 
                  activeOpacity={0.7}
                  style={styles.weekNavButton}
                >
                  <ChevronLeftIcon size={scale(18)} color={Theme.colors.primaryMedium} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleNextWeek} 
                  activeOpacity={0.7}
                  style={styles.weekNavButton}
                >
                  <ChevronRightIcon size={scale(18)} color={Theme.colors.primaryMedium} />
                </TouchableOpacity>
              </View>
            </View>
            {selectedWeek ? (
              <Text variant="body" color="#101828" style={styles.selectedWeekText}>
                {formatWeekRange(selectedWeek)}
              </Text>
            ) : (
              <Text variant="body" color="#9CA3AF" style={styles.selectedWeekText}>
                Select a week from the calendar
              </Text>
            )}
          </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
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
    maxWidth: scale(400),
    maxHeight: '90%',
    zIndex: 10000,
    elevation: 10000,
  },
  modalContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: scale(20),
    width: '100%',
    maxHeight: '90%',
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    overflow: 'hidden',
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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
  },
  headerTitle: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  confirmText: {
    fontWeight: '600',
  },
  selectedWeekContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    marginBottom: verticalScale(12),
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  selectedWeekLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  weekNavButtons: {
    flexDirection: 'row',
    gap: scale(8),
  },
  weekNavButton: {
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.primaryMedium,
  },
  selectedWeekText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  content: {
    flexGrow: 0,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(20),
  },
  monthNavButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
    backgroundColor: '#F3F4F6',
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
    marginBottom: verticalScale(48),
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: scale(2),
  },
  dayCellSelected: {
    // Selected day styling
  },
  dayCellStart: {
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
  },
  dayCellEnd: {
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  daySelectedBackground: {
    position: 'absolute',
    top: scale(2),
    bottom: scale(2),
    left: scale(2),
    right: scale(2),
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    zIndex: 0,
  },
  daySelectedBackgroundFull: {
    backgroundColor: 'rgba(35, 114, 39, 0.15)',
    borderRadius: scale(8),
    left: 0,
    right: 0,
  },
  dayTextContainer: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dayText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '400',
  },
  dayTextSelected: {
    fontWeight: '700',
    color: Theme.colors.primaryMedium,
  },
  dayTextToday: {
    fontWeight: '700',
  },
  dayTextAdjacentMonth: {
    opacity: 0.6,
  },
});
