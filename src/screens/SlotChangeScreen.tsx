/**
 * Slot Change Screen Component
 * Select Shift / Slot Change screen matching Figma design exactly
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import BookedShiftCard from '../components/features/BookedShiftCard';
import DateSelector from '../components/features/DateSelector';
import ShiftCard, { Shift } from '../components/features/ShiftCard';
import CalendarIcon from '../components/icons/CalendarIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { getAvailableShifts, getMyShifts, selectShifts } from '../api/shifts';
import { formatDateParam, mapBackendShiftToCard } from '../utils/shiftUtils';

export default function SlotChangeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<'available' | 'booked'>('available');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>('all');
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [bookedShifts, setBookedShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  // Format date display
  const formatDateDisplay = (date: Date): string => {
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

  // Filter shifts based on duration and tab
  const filteredShifts = useMemo(() => {
    // Select the appropriate shift array based on tab
    const sourceShifts = selectedTab === 'booked' ? bookedShifts : availableShifts;
    let filtered = [...sourceShifts];

    if (selectedDurationFilter !== 'all') {
      const target = parseInt(selectedDurationFilter, 10);
      filtered = filtered.filter((shift) => shift.durationHours === target);
    }

    return filtered;
  }, [selectedDurationFilter, selectedTab, availableShifts, bookedShifts]);

  const loadShifts = useCallback(async () => {
    setLoading(true);
    try {
      const dateParam = formatDateParam(selectedDate);
      const [availableBackend, bookedBackend] = await Promise.all([
        getAvailableShifts(dateParam),
        getMyShifts(dateParam),
      ]);
      setAvailableShifts(availableBackend.map(mapBackendShiftToCard));
      setBookedShifts(bookedBackend.map(mapBackendShiftToCard));
      setSelectedShiftIds([]);
    } catch (e) {
      Alert.alert(
        'Failed to load shifts',
        e instanceof Error ? e.message : 'Something went wrong, please try again.'
      );
      setAvailableShifts([]);
      setBookedShifts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadShifts();
  }, [loadShifts]);

  // Handle shift selection
  const handleShiftToggle = (shiftId: string) => {
    setSelectedShiftIds((prev) => {
      if (prev.includes(shiftId)) {
        return prev.filter((id) => id !== shiftId);
      } else {
        return [...prev, shiftId];
      }
    });
  };

  // Handle book slots
  const handleBookSlots = async () => {
    if (selectedShiftIds.length === 0) {
      Alert.alert('No Slots Selected', 'Please select at least one slot to book.');
      return;
    }

    try {
      await selectShifts(selectedShiftIds);
      await loadShifts();
      Alert.alert(
        'Slots Booked',
        `Successfully booked ${selectedShiftIds.length} slot(s) for ${formatDateDisplay(
          selectedDate
        )}`,
        [
          {
            text: 'OK',
            onPress: () => setSelectedTab('booked'),
          },
        ]
      );
    } catch (e) {
      Alert.alert(
        'Booking failed',
        e instanceof Error ? e.message : 'Something went wrong, please try again.'
      );
    }
  };

  const selectedCount = selectedShiftIds.length;
  const selectionText = selectedCount === 1 ? '1 slot selected' : `${selectedCount} slots selected`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
      {/* Header */}
        <Header
          title="Select Shift"
          subtitle="Choose your preferred working hours"
          onBack={() => router.back()}
        />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Row */}
        <View style={styles.dateRow}>
          <View style={styles.dateRowLeft}>
            <CalendarIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
            <Text variant="bodySm" color={Theme.colors.textDark} style={styles.dateText}>
              {formatDateDisplay(selectedDate)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowDateSelector(true)}
            activeOpacity={0.7}
          >
            <Text variant="caption" color={Theme.colors.textLabel} style={styles.changeButtonText}>
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availabilityToggle}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, selectedTab === 'available' && styles.toggleButtonActive]}
              onPress={() => setSelectedTab('available')}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={selectedTab === 'available' ? Theme.colors.primaryMedium : Theme.colors.textGrey}
                style={styles.toggleText}
              >
                Available
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, selectedTab === 'booked' && styles.toggleButtonActive]}
              onPress={() => setSelectedTab('booked')}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={selectedTab === 'booked' ? Theme.colors.primaryMedium : Theme.colors.textGrey}
                style={styles.toggleText}
              >
                Booked
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Filter Chips */}
        <View style={styles.durationFilters}>
          <TouchableOpacity
            style={[
              styles.durationChip,
              selectedDurationFilter === 'all' && styles.durationChipActive,
            ]}
            onPress={() => setSelectedDurationFilter('all')}
            activeOpacity={0.7}
          >
            <Text
              variant="bodySm"
              color={selectedDurationFilter === 'all' ? Theme.colors.white : Theme.colors.textLabel}
              style={styles.durationChipText}
            >
              All Shifts
            </Text>
          </TouchableOpacity>
          {['2', '4', '6', '10', '12'].map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.durationChip,
                selectedDurationFilter === duration && styles.durationChipActive,
              ]}
              onPress={() => setSelectedDurationFilter(duration)}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={selectedDurationFilter === duration ? Theme.colors.white : Theme.colors.textLabel}
                style={styles.durationChipText}
              >
                {duration} Hours
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shift Cards List */}
        <View style={styles.shiftsList}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
                Loading shifts…
              </Text>
            </View>
          ) : filteredShifts.length > 0 ? (
            filteredShifts.map((shift) => {
              const isAlreadyBooked = bookedShifts.some(b => b.id === shift.id);
              
              return selectedTab === 'booked' ? (
                <BookedShiftCard key={shift.id} shift={shift} />
              ) : (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  selected={selectedShiftIds.includes(shift.id)}
                  onPress={() => handleShiftToggle(shift.id)}
                  disabled={isAlreadyBooked}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
                {selectedTab === 'booked' ? 'No booked shifts' : 'No shifts available'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Section - Only show for Available tab */}
      {selectedTab === 'available' && (
      <View style={styles.bottomSection}>
        <View style={styles.selectionInfo}>
          <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.selectionText}>
            {selectionText}
          </Text>
        </View>
        <Button
          title="Book Slots"
          onPress={handleBookSlots}
          variant="primary"
          size="medium"
          disabled={selectedCount === 0}
          style={styles.bookButton}
        />
      </View>
      )}

      {/* Date Selector Modal */}
      <DateSelector
        visible={showDateSelector}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onClose={() => setShowDateSelector(false)}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12), // Space for bottom section
    gap: verticalScale(12),
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(0),
  },
  dateRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  dateText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  changeButton: {
    paddingVertical: scale(0),
    paddingHorizontal: scale(7),
    backgroundColor: Theme.colors.gray100,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: scale(6.75),
  },
  changeButtonText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  availabilityToggle: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(3.5),
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(12.75),
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: scale(0),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: scale(3.5),
    paddingHorizontal: scale(7),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.small,
  },
  toggleText: {
    fontSize: scale(12.25),
    lineHeight: scale(24),
    fontWeight: '700',
  },
  durationFilters: {
    flexDirection: 'row',
    gap: scale(7),
    flexWrap: 'wrap',
  },
  durationChip: {
    paddingVertical: scale(7),
    paddingHorizontal: scale(14),
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(9999),
  },
  durationChipActive: {
    backgroundColor: Theme.colors.primaryMedium,
  },
  durationChipText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  shiftsList: {
    gap: scale(4),
  },
  emptyState: {
    paddingVertical: verticalScale(20),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(14),
    fontWeight: '400',
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    gap: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  selectionInfo: {
    alignItems: 'center',
  },
  selectionText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  bookButton: {
    width: '100%',
  },
});

