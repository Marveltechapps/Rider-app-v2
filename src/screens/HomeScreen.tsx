/**
 * Home Screen Component
 * Rider dashboard home screen matching Figma design exactly
 * 
 * @component
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import ClockIcon from '../components/icons/ClockIcon';
import EarningsStatIcon from '../components/icons/EarningsStatIcon';
import EditIcon from '../components/icons/EditIcon';
import HoursStatIcon from '../components/icons/HoursStatIcon';
import OrdersStatIcon from '../components/icons/OrdersStatIcon';
import SlotsStatIcon from '../components/icons/SlotsStatIcon';
import { Theme } from '../constants/Theme';
import { useConfigWithDefaults, useUser } from '../contexts';
import { scale, verticalScale, wp } from '../utils/responsive';
import { setRiderAvailability } from '../api/rider';
import { startShift, endShift } from '../api/shifts';
import { AUTH_REQUIRED_MESSAGE } from '../api/client';
import { getHome, type RiderHomePayload } from '../api/home';
import { getMyShifts, type BackendRiderShift } from '../api/shifts';
import { riderWebSocketService } from '../services/websocket.service';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBgColor: string;
}

function StatCard({ icon, value, label, iconBgColor }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        {icon}
      </View>
      <Text variant="h3" color={Theme.colors.textDark} style={styles.statValue}>
        {value}
      </Text>
      <Text variant="caption" color={Theme.colors.textLight} style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const parseShiftTimeToDate = (dateStr: string, timeStr: string): Date | null => {
  try {
    const base = new Date(dateStr);
    if (Number.isNaN(base.getTime())) return null;

    const trimmed = timeStr.trim();
    if (!trimmed) return null;

    // Handle formats like "12:00 PM" or "8:30 am"
    const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([APap][Mm])$/);
    if (amPmMatch) {
      let hour = parseInt(amPmMatch[1], 10);
      const minute = parseInt(amPmMatch[2], 10);
      const suffix = amPmMatch[3].toUpperCase();
      if (suffix === 'PM' && hour < 12) hour += 12;
      if (suffix === 'AM' && hour === 12) hour = 0;
      base.setHours(hour, minute, 0, 0);
      return base;
    }

    // Handle 24h formats like "08:00" or "08:00:00"
    const parts = trimmed.split(':');
    if (parts.length >= 2) {
      const hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
        base.setHours(hour, minute, 0, 0);
        return base;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData, logout } = useUser();
  const config = useConfigWithDefaults();
  // Ensure CASH_LIMIT is a number and has a safe default so comparisons never throw.
  const CASH_LIMIT = Number(config?.cashLimit ?? 0);
  const [isOnline, setIsOnline] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [homeData, setHomeData] = useState<RiderHomePayload | null>(null);
  const [redirectingDueToAuth, setRedirectingDueToAuth] = useState(false);
  // Delay first home query so SecureStore (iOS) is readable after OTP → avoids 401 and redirect to login
  const [allowHomeQuery, setAllowHomeQuery] = useState(false);

  const rawName = homeData?.rider?.name || userData.name;
  const riderName = (rawName?.startsWith('Rider ') || rawName === 'Rider Name' || !rawName) ? '-' : rawName.split(' ')[0];
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const currentShift = homeData?.rider?.currentShift ?? null;

  const {
    data: myShiftsToday = [],
  } = useQuery({
    queryKey: ['my-shifts-today', userData.riderId],
    queryFn: async () => {
      const todayIso = new Date().toISOString().slice(0, 10);
      return getMyShifts(todayIso);
    },
    enabled: !!userData.riderId,
    staleTime: 60 * 1000,
  });

  const activeBookedShift: BackendRiderShift | null = (() => {
    if (!myShiftsToday.length) return null;
    const now = new Date();
    return (
      myShiftsToday.find((shift) => {
        if (!shift.date || !shift.startTime || !shift.endTime) return false;
        const start = parseShiftTimeToDate(shift.date, shift.startTime);
        const end = parseShiftTimeToDate(shift.date, shift.endTime);
        if (!start || !end) return false;
        return now >= start && now <= end;
      }) ?? null
    );
  })();

  const isOnShift = !!currentShift || !!activeBookedShift;
  const hasAssignedWork = Boolean(
    homeData?.activeTask ||
    (homeData?.queue?.length ?? 0) > 0 ||
    (homeData?.todaySummary?.ordersAssigned ?? 0) > 0
  );
  const canViewOrders = isOnShift || hasAssignedWork;

  const ordersAssigned = homeData?.todaySummary?.ordersAssigned ?? 0;
  const ordersCompleted = homeData?.todaySummary?.ordersCompleted ?? 0;
  const amountCollectedCod = homeData?.todaySummary?.amountCollectedCod ?? 0;
  const earningsToday = homeData?.todaySummary?.earningsToday ?? 0;
  const onlineHours = homeData?.todaySummary?.onlineHours ?? 0;
  const slotsCompleted = homeData?.todaySummary?.slotsCompleted ?? 0;
  const incentiveEarned = homeData?.todaySummary?.incentiveEarned ?? 0;
  const onTimeCount = homeData?.todaySummary?.onTimeCount ?? 0;
  const lateCount = homeData?.todaySummary?.lateCount ?? 0;

  const isCashLimitExceeded = amountCollectedCod >= CASH_LIMIT;
  const showAvailableOrders = (isOnline || canViewOrders) && !isCashLimitExceeded;

  const progress = ordersAssigned > 0 ? ordersCompleted / ordersAssigned : 0;
  const progressPercentage = Math.max(0, Math.min(100, progress * 100));

  // Shift progress – for current (ongoing) booked shift window
  let shiftProgressMinutes = 0;
  let shiftTotalMinutes = 0;
  let shiftProgressPercentage = 0;
  if (activeBookedShift) {
    const shiftDateStr = typeof activeBookedShift.date === 'string'
      ? activeBookedShift.date
      : new Date(activeBookedShift.date).toISOString().slice(0, 10);
    const startDate = parseShiftTimeToDate(shiftDateStr, activeBookedShift.startTime);
    const endDate = parseShiftTimeToDate(shiftDateStr, activeBookedShift.endTime);
    if (startDate && endDate && endDate > startDate) {
      const now = new Date();
      shiftTotalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
      const elapsedMs = now.getTime() - startDate.getTime();
      shiftProgressMinutes = Math.max(0, Math.min(shiftTotalMinutes, Math.round(elapsedMs / 60000)));
      shiftProgressPercentage =
        shiftTotalMinutes > 0 ? Math.max(0, Math.min(100, (shiftProgressMinutes / shiftTotalMinutes) * 100)) : 0;
    }
  }

  // Gate home query until after a short delay when riderId is set (e.g. after OTP). Prevents first request firing before token is readable from SecureStore on iOS.
  useEffect(() => {
    if (!userData.riderId) {
      setAllowHomeQuery(false);
      return;
    }
    const t = setTimeout(() => setAllowHomeQuery(true), 600);
    return () => clearTimeout(t);
  }, [userData.riderId]);

  const {
    data: homeResponse,
    isLoading: homeLoading,
    error: homeError,
    refetch: refetchHome,
  } = useQuery({
    queryKey: ['rider-home', userData.riderId],
    queryFn: () => getHome(),
    enabled: !!userData.riderId && allowHomeQuery,
    staleTime: 15 * 1000,
  });

  useEffect(() => {
    if (!homeResponse) {
      setHomeData(null);
      return;
    }

    setHomeData(homeResponse);

    const rider = (homeResponse as Partial<RiderHomePayload>).rider;

    if (rider && rider.currentShift) {
      const shift = rider.currentShift as { startedAt?: string | null; warehouseCode?: string | null } | null;
      if (shift && shift.startedAt) {
        try {
          const startedAtDate = new Date(shift.startedAt);
          const timeLabel = startedAtDate.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });
          const warehouseLabel = shift.warehouseCode ? ` · WH ${shift.warehouseCode}` : '';
          setTimeSlot(`On shift · Started ${timeLabel}${warehouseLabel}`);
        } catch {
          setTimeSlot('On shift');
        }
      } else {
        setTimeSlot('Shift not started yet');
      }
    } else if (activeBookedShift) {
      setTimeSlot(`On shift · ${activeBookedShift.startTime} - ${activeBookedShift.endTime}`);
    } else if (myShiftsToday.length > 0) {
      const now = new Date();
      const upcoming = myShiftsToday
        .map((shift) => ({
          shift,
          start: shift.date && shift.startTime ? parseShiftTimeToDate(shift.date, shift.startTime) : null,
        }))
        .filter((entry) => entry.start && entry.start > now)
        .sort((a, b) => (a.start!.getTime() - b.start!.getTime()))[0]?.shift;

      if (upcoming) {
        setTimeSlot(`Upcoming shift · ${upcoming.startTime} - ${upcoming.endTime}`);
      } else {
        setTimeSlot(null);
      }
    } else {
      setTimeSlot(null);
      setIsOnline(false);
    }

    if (rider && typeof rider.availability === 'string') {
      if (rider.availability === 'available' && (rider.currentShift || activeBookedShift)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }
  }, [homeResponse, activeBookedShift, myShiftsToday.length]);

  // On auth error from home API: clear session; AuthGuard will redirect to login. If we just landed (e.g. after OTP), retry several times to avoid race where token wasn't readable yet.
  const mountedAtRef = useRef<number>(Date.now());
  const authRetryCountRef = useRef(0);
  const maxAuthRetries = 5; // Increased from 3
  useEffect(() => {
    if (!homeError || homeLoading) return;
    const message = homeError instanceof Error ? homeError.message : String(homeError);
    if (message !== AUTH_REQUIRED_MESSAGE) return;

    const elapsed = Date.now() - mountedAtRef.current;
    // Allow retries for a longer period (10s instead of 5s)
    const justMounted = elapsed < 10000 && authRetryCountRef.current < maxAuthRetries;
    if (justMounted) {
      const retryCount = authRetryCountRef.current;
      authRetryCountRef.current += 1;
      const delayMs = 500 + retryCount * 500; // 500, 1000, 1500, 2000, 2500 ms
      console.log(`[HomeScreen] Auth error, retry attempt ${authRetryCountRef.current}/${maxAuthRetries} in ${delayMs}ms`);
      const t = setTimeout(() => {
        refetchHome();
      }, delayMs);
      return () => clearTimeout(t);
    }
    console.log('[HomeScreen] Auth retries exhausted, logging out');
    setRedirectingDueToAuth(true);
    logout();
  }, [homeError, homeLoading, logout, refetchHome]);

  // WebSocket connection is managed at app level (tab layout). Here we only trigger refetch on push.
  useEffect(() => {
    const handler = async () => {
      await queryClient.invalidateQueries({ queryKey: ['rider-home'] });
      await queryClient.refetchQueries({ queryKey: ['rider-home'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };
    riderWebSocketService.on('orders:refresh', handler);
    return () => riderWebSocketService.off('orders:refresh', handler);
  }, [queryClient]);

  const handleAvailabilityChange = useCallback(
    async (value: boolean) => {
      const riderId = userData.riderId;
      if (!riderId) {
        setIsOnline(value);
        return;
      }
      const availability = value ? 'available' : 'offline';
      setIsOnline(value);
      setAvailabilityLoading(true);
      try {
        if (value && activeBookedShift?.id && !currentShift) {
          try {
            await startShift(activeBookedShift.id);
          } catch {
            // Shift may already be started
          }
        }
        if (!value && activeBookedShift?.id) {
          try {
            await endShift(activeBookedShift.id);
          } catch {
            // Best-effort end
          }
        }
        await setRiderAvailability(riderId, availability);
        queryClient.invalidateQueries({ queryKey: ['rider-home'] });
        queryClient.invalidateQueries({ queryKey: ['my-shifts-today'] });
        refetchHome();
      } catch (e) {
        setIsOnline(!value);
        const message = e instanceof Error ? e.message : 'Failed to update status';
        Alert.alert('Status update failed', message);
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [userData.riderId, activeBookedShift, currentShift, queryClient, refetchHome]
  );

  if (redirectingDueToAuth) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.welcomeSection}>
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.welcomeText}>
              Welcome back,
            </Text>
            <Text variant="h2" color={Theme.colors.textDark} style={styles.riderName}>
              {riderName}
            </Text>
            
            {/* Time Slot Chip */}
            {timeSlot && (
              <View style={styles.timeSlotChip}>
                <ClockIcon size={scale(10.5)} color={Theme.colors.primaryMedium} />
                <Text variant="caption" color="#364153" style={styles.timeSlotText}>
                  {timeSlot}
                </Text>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => router.push('/slot-change')}
                  activeOpacity={0.7}
                >
                  <EditIcon size={scale(17.5)} color={Theme.colors.textLight} />
                </TouchableOpacity>
              </View>
            )}
            {activeBookedShift && shiftTotalMinutes > 0 && (
              <View style={styles.shiftProgressContainer}>
                <View style={styles.shiftProgressBarTrack}>
                  <View
                    style={[
                      styles.shiftProgressBarFill,
                      { width: `${shiftProgressPercentage || 2}%` },
                    ]}
                  />
                </View>
                <Text
                  variant="caption"
                  color={Theme.colors.textGrey}
                  style={styles.shiftProgressLabel}
                >
                  On shift: {shiftProgressMinutes} min of {shiftTotalMinutes} min (
                  {Math.round(shiftProgressPercentage)}%)
                </Text>
              </View>
            )}
          </View>

          {/* Online/Offline Toggle – synced with backend availability */}
          <View style={styles.onlineToggleContainer}>
            <View style={styles.switchWrapper}>
              <Switch
                value={isOnline}
                onValueChange={handleAvailabilityChange}
                disabled={availabilityLoading || !isOnShift}
                trackColor={{ false: Theme.colors.gray200, true: Theme.colors.primaryMedium }}
                thumbColor={Theme.colors.white}
                ios_backgroundColor={Theme.colors.gray200}
                style={styles.switch}
                accessibilityLabel="Toggle online status"
                accessibilityHint={
                  !isOnShift
                    ? 'Online status is locked until your shift starts'
                    : isOnline
                    ? 'Currently online, tap to go offline'
                    : 'Currently offline, tap to go online'
                }
                accessibilityRole="switch"
              />
            </View>
            {isOnShift ? (
              <Text
                variant="caption"
                color={isOnline ? Theme.colors.primaryMedium : Theme.colors.textLight}
                style={styles.onlineText}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/slot-change')}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Book or view shifts"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.shiftNotActiveTapRow}>
                  <Text
                    variant="caption"
                    color={Theme.colors.primaryMedium}
                    style={styles.onlineText}
                  >
                    Shift not active
                  </Text>
                  <ArrowRightIcon size={scale(10)} color={Theme.colors.primaryMedium} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Today's Performance Section */}
          <View style={styles.performanceSection}>
          <View style={styles.sectionHeader}>
            <Text variant="body" color={Theme.colors.textDark} style={styles.sectionTitle}>
              Today's Performance
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/earnings')}
              activeOpacity={0.7}
            >
              <Text variant="caption" color={Theme.colors.primaryMedium} style={styles.viewDetailsText}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stat Cards Grid */}
          <View style={styles.statCardsGrid}>
            {homeLoading && (
              <View style={{ padding: scale(12) }}>
                <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
              </View>
            )}
            {homeError && !homeLoading && (homeError instanceof Error ? homeError.message : String(homeError)) !== AUTH_REQUIRED_MESSAGE && (
              <View style={{ padding: scale(12) }}>
                <Text variant="caption" color={Theme.colors.textGrey}>
                  {homeError instanceof Error ? homeError.message : String(homeError)}
                </Text>
              </View>
            )}
            {homeData && homeData.todaySummary && (
              <>
                <StatCard
                  icon={<EarningsStatIcon size={scale(28)} />}
                  value={`₹${amountCollectedCod.toFixed(0)}`}
                  label="COD Collected Today"
                  iconBgColor="rgba(50, 201, 106, 0.1)"
                />
                <StatCard
                  icon={<OrdersStatIcon size={scale(28)} />}
                  value={String(ordersCompleted)}
                  label="Orders Delivered"
                  iconBgColor="#EFF6FF"
                />
                <StatCard
                  icon={<HoursStatIcon size={scale(28)} />}
                  value={String(onlineHours)}
                  label="Online Hours"
                  iconBgColor="#FAF5FF"
                />
                <StatCard
                  icon={<SlotsStatIcon size={scale(28)} />}
                  value={String(slotsCompleted)}
                  label="Slots Completed"
                  iconBgColor="#FFF7ED"
                />
              </>
            )}
          </View>
        </View>

        {/* Daily Incentive Card */}
        <View style={styles.incentiveCard}>
          <LinearGradient
            colors={['#4F39F6', '#9810FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.incentiveGradient}
          >
            <View style={styles.incentiveContent}>
              <View style={styles.incentiveHeader}>
                <View style={styles.incentiveHeaderLeft}>
                  <Text variant="caption" color="#E0E7FF" style={styles.incentiveTitle}>
                    DAILY INCENTIVE
                  </Text>
                  <Text variant="h3" color={Theme.colors.white} style={styles.incentiveAmount}>
                    {homeData?.homeConfig?.banners?.[0]?.title ?? 'Incentives'}
                  </Text>
                </View>
                <View style={styles.earnedPill}>
                  <Text variant="caption" color={Theme.colors.white} style={styles.earnedText}>
                    ₹{incentiveEarned} earned
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text variant="caption" color="#E0E7FF" style={styles.progressLabel}>
                    Progress
                  </Text>
                  <Text variant="caption" color="#E0E7FF" style={styles.progressCount}>
                    {homeData && homeData.todaySummary
                      ? `${ordersCompleted}/${ordersAssigned} Orders`
                      : ''}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                </View>
                {homeData && homeData.todaySummary && (
                  <Text variant="caption" color="#C6D2FF" style={styles.progressSubtext}>
                    Delivered on time: {onTimeCount}, late: {lateCount}
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {!showAvailableOrders && (
          <View style={styles.ordersBlockedCard}>
            {!isOnline && !isOnShift ? (
              <>
                <Text variant="body" color="#364153" style={styles.blockedTitle}>
                  No Active Shift
                </Text>
                <Text variant="caption" color="#6A7282" style={styles.blockedMessage}>
                  Your online status will be available once your booked shift starts.
                </Text>
              </>
            ) : !isOnline ? (
              <>
                <Text variant="body" color="#364153" style={styles.blockedTitle}>
                  You're Currently Offline
                </Text>
                <Text variant="caption" color="#6A7282" style={styles.blockedMessage}>
                  Turn on the toggle above to start receiving orders
                </Text>
              </>
            ) : isCashLimitExceeded ? (
              <>
                <Text variant="body" color="#364153" style={styles.blockedTitle}>
                  Cash Limit Exceeded
                </Text>
                <Text variant="caption" color="#6A7282" style={styles.blockedMessage}>
                  You have ₹{amountCollectedCod} in floating cash. Please deposit to continue receiving orders (Limit: ₹{CASH_LIMIT})
                </Text>
                <TouchableOpacity
                  style={styles.depositNowButton}
                  onPress={() => router.push('/deposit-cash')}
                  activeOpacity={0.8}
                >
                  <Text variant="bodySm" style={styles.depositNowButtonText}>
                    Deposit Cash Now
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        )}

        {/* Book More Slots Card */}
        <TouchableOpacity
          style={styles.bookSlotsCard}
          activeOpacity={0.7}
          onPress={() => router.push('/slot-change')}
        >
          <View style={styles.bookSlotsContent}>
            <View style={styles.bookSlotsIconContainer}>
              <CalendarIcon size={scale(21)} color="#4A5565" />
            </View>
            <View style={styles.bookSlotsText}>
              <Text variant="bodySm" color={Theme.colors.textDark} style={styles.bookSlotsTitle}>
                Book More Slots
              </Text>
              <Text variant="caption" color={Theme.colors.textGrey} style={styles.bookSlotsSubtitle}>
                Schedule your upcoming shifts
              </Text>
            </View>
          </View>
          <ArrowRightIcon size={scale(17.5)} color={Theme.colors.textLight} />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Today's Summary section moved down a bit to show Available Orders better */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100), // Space for bottom tab bar
    gap: verticalScale(21),
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: scale(7),
    paddingRight: scale(7),
  },
  welcomeSection: {
    flex: 1,
    gap: 0,
  },
  welcomeText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    marginBottom: scale(4),
  },
  riderName: {
    fontSize: scale(21),
    lineHeight: scale(28),
    fontWeight: '700',
    marginBottom: scale(7),
  },
  timeSlotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(9999),
    alignSelf: 'flex-start',
    ...Theme.shadows.small,
  },
  timeSlotText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '700',
    color: '#364153',
  },
  editButton: {
    padding: scale(3.5),
  },
  shiftProgressContainer: {
    marginTop: scale(6),
    alignSelf: 'flex-start',
    gap: scale(3),
  },
  shiftProgressBarTrack: {
    width: '100%',
    maxWidth: wp(60),
    height: scale(6),
    borderRadius: scale(999),
    backgroundColor: Theme.colors.gray200,
    overflow: 'hidden',
  },
  shiftProgressBarFill: {
    height: '100%',
    borderRadius: scale(999),
    backgroundColor: Theme.colors.primaryMedium,
  },
  shiftProgressLabel: {
    fontSize: scale(10),
  },
  onlineToggleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: scale(4),
  },
  switchWrapper: {
    transform: [{ scale: 0.94 }], // Scale switch to 48px height (default Switch is ~51px)
  },
  switch: {
    // Switch size controlled by transform scale
  },
  onlineText: {
    fontSize: scale(10),
    lineHeight: scale(10),
    fontWeight: '600',
    textAlign: 'left',
  },
  shiftNotActiveTapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  performanceSection: {
    gap: verticalScale(14),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(23.63),
    fontWeight: '700',
  },
  viewDetailsText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  statCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10.5),
  },
  statCard: {
    // Calculate width: (screen width - left padding - right padding - gap between cards) / 2
    // This ensures exactly 2 columns with responsive card sizing
    width: (wp(100) - scale(16) - scale(16) - scale(10.5)) / 2,
    padding: scale(15),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(8),
    gap: scale(4),
    ...Theme.shadows.small,
  },
  statIconContainer: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  statValue: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  statLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  incentiveCard: {
    borderRadius: scale(8),
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  incentiveGradient: {
    padding: scale(24),
    paddingHorizontal: scale(16),
  },
  incentiveContent: {
    gap: verticalScale(10.5),
  },
  incentiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  incentiveHeaderLeft: {
    gap: scale(4),
  },
  incentiveTitle: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  incentiveAmount: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    color: Theme.colors.white,
  },
  earnedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(8.75),
    paddingVertical: scale(8.5),
    paddingHorizontal: scale(7),
  },
  earnedText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '700',
    color: Theme.colors.white,
  },
  progressSection: {
    gap: scale(7),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    color: '#E0E7FF',
  },
  progressCount: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
    color: '#E0E7FF',
  },
  progressBarContainer: {
    height: scale(7),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: scale(9999),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(9999),
  },
  progressSubtext: {
    fontSize: scale(10),
    lineHeight: scale(15),
    fontWeight: '400',
    color: '#C6D2FF',
  },
  cashLimitCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FFE2E2',
    borderRadius: scale(14),
    padding: scale(22),
    alignItems: 'center',
    gap: scale(14),
  },
  cashLimitIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: '#FFE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashLimitTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    color: '#82181A',
    textAlign: 'center',
  },
  cashLimitDescription: {
    fontSize: scale(12.25),
    lineHeight: scale(20),
    fontWeight: '400',
    color: '#C10007',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
  depositButton: {
    width: '100%',
    backgroundColor: '#E7000B',
    borderRadius: scale(12.75),
    // Shadow: 0px 4px 6px -4px rgba(231, 0, 11, 0.2), 0px 10px 15px -3px rgba(231, 0, 11, 0.2)
    shadowColor: '#E7000B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  bookSlotsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(8),
    padding: scale(14),
    ...Theme.shadows.small,
  },
  bookSlotsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
    flex: 1,
  },
  bookSlotsIconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(12.75),
    backgroundColor: Theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookSlotsText: {
    flex: 1,
    gap: 0,
  },
  bookSlotsTitle: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  bookSlotsSubtitle: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  // Orders blocked card (offline or cash limit)
  ordersBlockedCard: {
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: verticalScale(12),
    ...Theme.shadows.small,
  },
  blockedTitle: {
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(22),
    color: '#364153',
    textAlign: 'center',
  },
  blockedMessage: {
    fontSize: scale(12),
    fontWeight: '400',
    lineHeight: scale(18),
    color: '#6A7282',
    textAlign: 'center',
  },
  depositNowButton: {
    marginTop: verticalScale(8),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    backgroundColor: '#32C96A',
    borderRadius: scale(8),
    shadowColor: '#32C96A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  depositNowButtonText: {
    fontSize: scale(13),
    fontWeight: '700',
    lineHeight: scale(18),
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

