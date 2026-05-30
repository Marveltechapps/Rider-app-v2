import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import { goBackOrReplace } from '../utils/navigation/safeBack';
import Text from '../components/common/Text';
import BookedShiftCard from '../components/features/BookedShiftCard';
import { cancelSelectedShift, getMyShifts, type BackendRiderShift } from '../api/shifts';
import { Theme } from '../constants/Theme';

export default function MyShiftsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<BackendRiderShift[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyShifts();
      setShifts(data);
    } catch (e) {
      Alert.alert(
        'Failed to load shifts',
        e instanceof Error ? e.message : 'Something went wrong, please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const formatMinutes = (minutes?: number) => {
    if (!minutes || minutes <= 0 || !Number.isFinite(minutes)) return '0 min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} min`;
  };

  const { upcoming, ongoing, completed, missed } = useMemo(() => {
    const upcomingList: BackendRiderShift[] = [];
    const ongoingList: BackendRiderShift[] = [];
    const completedList: BackendRiderShift[] = [];
    const missedList: BackendRiderShift[] = [];

    shifts.forEach((shift) => {
      const status = shift.completionStatus;
      if (status === 'ongoing') {
        ongoingList.push(shift);
      } else if (status === 'completed') {
        completedList.push(shift);
      } else if (status === 'missed') {
        missedList.push(shift);
      } else {
        upcomingList.push(shift);
      }
    });

    return { upcoming: upcomingList, ongoing: ongoingList, completed: completedList, missed: missedList };
  }, [shifts]);

  const handleCancel = (shiftId: string) => {
    Alert.alert('Cancel shift?', 'This will remove the shift from your upcoming shifts.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await cancelSelectedShift(shiftId);
            const data = await getMyShifts();
            setShifts(data);
          } catch (e) {
            Alert.alert(
              'Unable to cancel',
              e instanceof Error ? e.message : 'This shift cannot be cancelled right now.'
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderSection = (data: BackendRiderShift[], allowCancel?: boolean) => {
    return (
      <View style={{ marginTop: 8 }}>
        {data.map((s) => {
          const showAnalytics =
            typeof s.attendanceMinutes === 'number' &&
            s.attendanceMinutes >= 0 &&
            typeof s.attendancePercentage === 'number';

          return (
            <View key={s.id} style={{ marginBottom: 8 }}>
              <BookedShiftCard
                shift={{
                  id: s.id,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  durationHours: Math.max(1, Math.round(s.durationMinutes / 60)),
                  hasBreak: s.breakMinutes > 0,
                  breakMinutes: s.breakMinutes,
                  isPeakTime: s.isPeak,
                  hasIncentive: (s.basePay ?? 0) > 0 || (s.bonus ?? 0) > 0,
                  incentiveAmount: s.bonus ?? 0,
                  basePay: s.basePay,
                  date: s.date,
                }}
                onCancel={allowCancel ? () => handleCancel(s.id) : undefined}
              />
              {showAnalytics && (
                <View style={{ marginTop: 4, paddingHorizontal: 4 }}>
                  {(() => {
                    const percent = Math.min(100, Math.max(0, s.attendancePercentage || 0));
                    const fillWidth = percent > 0 ? percent : 4; // show at least a sliver so bar is visible
                    const fillColor =
                      s.completionStatus === 'completed'
                        ? Theme.colors.primaryMedium
                        : s.completionStatus === 'missed'
                        ? Theme.colors.error
                        : Theme.colors.warning ?? '#F59E0B';
                    return (
                      <View
                        style={{
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: Theme.colors.gray200,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            height: '100%',
                            width: `${fillWidth}%`,
                            backgroundColor: fillColor,
                          }}
                        />
                      </View>
                    );
                  })()}
                  <Text
                    variant="caption"
                    color={Theme.colors.textGrey}
                    style={{ fontWeight: '500', marginTop: 2 }}
                  >
                    {s.completionStatus === 'ongoing'
                      ? `Active so far: ${formatMinutes(s.attendanceMinutes)} (${Math.round(
                          s.attendancePercentage || 0
                        )}%)`
                      : `Time online in this shift: ${formatMinutes(s.attendanceMinutes)} (${Math.round(
                          s.attendancePercentage || 0
                        )}%)`}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Header title="My Shifts" showBackButton onBack={() => goBackOrReplace(router, '/(tabs)/profile')} />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {shifts.length === 0 ? (
            <View style={{ marginTop: 32, alignItems: 'center' }}>
              <Text variant="bodySm" color={Theme.colors.textGrey}>
                You have no shifts yet.
              </Text>
            </View>
          ) : (
            <>
              {ongoing.length > 0 && (
                <>
                  <Text
                    variant="body"
                    color={Theme.colors.textDark}
                    style={{ fontWeight: '700', marginBottom: 4 }}
                  >
                    Current Shift
                  </Text>
                  {renderSection(ongoing)}
                  <View style={{ height: 16 }} />
                </>
              )}

              {upcoming.length > 0 && (
                <>
                  <Text
                    variant="body"
                    color={Theme.colors.textDark}
                    style={{ fontWeight: '700', marginBottom: 4 }}
                  >
                    Upcoming Shifts
                  </Text>
                  {renderSection(upcoming, true)}
                  <View style={{ height: 16 }} />
                </>
              )}

              {completed.length > 0 && (
                <>
                  <Text
                    variant="body"
                    color={Theme.colors.textDark}
                    style={{ fontWeight: '700', marginBottom: 4 }}
                  >
                    Completed
                  </Text>
                  {renderSection(completed)}
                  <View style={{ height: 16 }} />
                </>
              )}

              {missed.length > 0 && (
                <>
                  <Text
                    variant="body"
                    color={Theme.colors.textDark}
                    style={{ fontWeight: '700', marginBottom: 4 }}
                  >
                    Missed
                  </Text>
                  {renderSection(missed)}
                </>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

