/**
 * Earnings Week Screen Component
 * Earnings screen showing this week's earnings, weekly breakdown chart, active incentives, and payout history
 * Matches Figma design exactly
 */

import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import EarningsCashOutSection from '../components/EarningsCashOutSection';
import EarningsSegmentControl, { EarningsTab } from '../components/EarningsSegmentControl';
import RupeeIcon from '../components/icons/RupeeIcon';
import Header from '../components/layout/Header';
import WeekCalendarModal, { WeekRange } from '../components/WeekCalendarModal';
import WeeklyBarChart, { WeeklyBarData } from '../components/WeeklyBarChart';
import { Theme } from '../constants/Theme';
import earningsStyles from '../styles/earningsStyles';
import { scale } from '../utils/responsive';
import { getEarningsSummary, getEarningsSummaryForRange, listPayouts } from '../api/payouts';

interface Incentive {
  id: string;
  title: string;
  subtitle: string;
  reward: string;
  completed: number;
  target: number;
  status: 'active' | 'unlocked';
}

interface Payout {
  id: string;
  payoutId: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const DUMMY_WEEKLY: WeeklyBarData[] = [
  { dayLabel: 'Mon', value: 0 },
  { dayLabel: 'Tue', value: 0 },
  { dayLabel: 'Wed', value: 0 },
  { dayLabel: 'Thu', value: 0 },
  { dayLabel: 'Fri', value: 0 },
  { dayLabel: 'Sat', value: 0 },
  { dayLabel: 'Sun', value: 0 },
];

export default function EarningsWeekScreen() {
  const router = useRouter();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const activeTab: EarningsTab = 'thisWeek';
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | undefined>(undefined);

  const weekRange = selectedWeek;
  const { data: summaryRes } = useQuery({
    queryKey: ['earnings', 'summary', 'week', weekRange?.startDate?.toISOString(), weekRange?.endDate?.toISOString()],
    queryFn: () =>
      weekRange
        ? getEarningsSummaryForRange(weekRange.startDate, weekRange.endDate)
        : getEarningsSummary('week'),
    staleTime: 60 * 1000,
  });
  const { data: payoutsRes } = useQuery({
    queryKey: ['payouts', 'list'],
    queryFn: () => listPayouts(20),
    staleTime: 30 * 1000,
  });

  const totalEarnings = summaryRes?.totalEarnings != null ? String(summaryRes.totalEarnings) : '0';
  const ordersCount = summaryRes?.orderCount != null ? String(summaryRes.orderCount) : '0';
  const avgOrderValue =
    summaryRes?.orderCount != null && summaryRes.orderCount > 0 && summaryRes?.totalEarnings != null
      ? String(Math.round(summaryRes.totalEarnings / summaryRes.orderCount))
      : '—';
  const onlineTime = summaryRes?.onlineTime ?? '—';
  const activeIncentivesFromBackend = summaryRes?.activeIncentives ?? [];

  const weeklyData: WeeklyBarData[] = useMemo(() => {
    const breakdown = summaryRes?.dailyBreakdown;
    if (breakdown?.length) {
      return breakdown.map((d) => ({ dayLabel: d.dayLabel, value: d.value }));
    }
    return DUMMY_WEEKLY;
  }, [summaryRes?.dailyBreakdown]);

  const payoutHistory: Payout[] = useMemo(() => {
    if (!payoutsRes?.payouts?.length) return [];
    return payoutsRes.payouts.map((p: { _id?: string; createdAt?: string; amount?: number; status?: string }, i: number) => ({
      id: p._id ?? String(i),
      payoutId: p._id ?? `PAY${i + 1}`,
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      amount: p.amount != null ? `₹${p.amount}` : '—',
      status: (p.status === 'completed' ? 'Completed' : p.status === 'pending' ? 'Pending' : 'Failed') as Payout['status'],
    }));
  }, [payoutsRes?.payouts]);

  const handleTabChange = useCallback(
    (tab: EarningsTab) => {
      if (tab === 'today') {
        router.push('/earnings' as any);
      } else if (tab === 'thisMonth') {
        router.push('/earnings?tab=month' as any);
      }
      // If tab is 'thisWeek', stay on current screen
    },
    [router],
  );

  const handleCalendarPress = useCallback(() => {
    console.log('Calendar icon pressed'); // Debug log
    setShowCalendarModal(true);
  }, []);

  const handleWeekSelect = useCallback((weekRange: WeekRange) => {
    setSelectedWeek(weekRange);
  }, []);

  // Format week range for display
  const formatWeekRange = React.useMemo((): string => {
    const getWeekRange = (week: WeekRange | undefined): string => {
      if (!week) {
        // Default to current week
        const today = new Date();
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        week = { startDate: startOfWeek, endDate: endOfWeek };
      }
      
      const start = week.startDate;
      const end = week.endDate;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
      } else {
        return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${start.getFullYear()}`;
      }
    };
    
    return getWeekRange(selectedWeek);
  }, [selectedWeek]);

  const renderIncentive = ({ item }: { item: Incentive }) => {
    const isUnlocked = item.status === 'unlocked';
    const progressPercentage = isUnlocked ? 100 : (item.completed / item.target) * 100;

    return (
      <View
        style={[
          earningsStyles.incentiveCard,
          isUnlocked && earningsStyles.incentiveCardUnlocked,
        ]}
      >
        <View style={earningsStyles.incentiveHeader}>
          <View style={earningsStyles.incentiveLeft}>
            <Text variant="body" color="#101828" style={earningsStyles.incentiveTitle}>
              {item.title}
            </Text>
            <Text variant="bodySm" color="#6A7282" style={earningsStyles.incentiveSubtitle}>
              {item.subtitle}
            </Text>
          </View>
          {isUnlocked ? (
            <View style={earningsStyles.incentiveRewardUnlocked}>
              <Text variant="body" color={Theme.colors.primaryMedium} style={earningsStyles.incentiveReward} numberOfLines={1}>
                {item.reward}
              </Text>
              <Text variant="caption" color={Theme.colors.primaryMedium} style={earningsStyles.incentiveStatus} numberOfLines={1}>
                Unlocked ✓
              </Text>
            </View>
          ) : (
            <Text variant="body" color={Theme.colors.primaryMedium} style={earningsStyles.incentiveReward}>
              {item.reward}
            </Text>
          )}
        </View>

        {/* Progress bar */}
        <View style={earningsStyles.progressBarContainer}>
          <View style={[earningsStyles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>

        <Text variant="caption" color="#6B7280" style={earningsStyles.progressText}>
          {item.completed} / {item.target} completed
        </Text>
      </View>
    );
  };

  const renderPayout = ({ item }: { item: Payout }) => (
    <View style={earningsStyles.payoutCard}>
      <View style={earningsStyles.payoutLeft}>
        <View style={earningsStyles.payoutIconContainer}>
          <RupeeIcon size={scale(21)} color={Theme.colors.primaryMedium} />
        </View>
        <View style={earningsStyles.payoutInfo}>
          <Text variant="body" color="#101828" style={earningsStyles.payoutId}>
            {item.payoutId}
          </Text>
          <Text variant="bodySm" color="#6B7280" style={earningsStyles.payoutDate}>
            {item.date}
          </Text>
        </View>
      </View>
      <View style={earningsStyles.payoutRight}>
        <Text variant="body" color="#101828" style={earningsStyles.payoutAmount}>
          {item.amount}
        </Text>
        <Text variant="caption" color={Theme.colors.primaryMedium} style={earningsStyles.payoutStatus}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={earningsStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={{ backgroundColor: Theme.colors.white, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Header
          title="Earnings"
          showBackButton={false}
          style={{ borderBottomWidth: 0, paddingBottom: 4 }}
        />
        <View style={[earningsStyles.tabsContainer, { paddingBottom: 12, paddingTop: 0 }]}>
          <EarningsSegmentControl activeTab={activeTab} onChangeTab={handleTabChange} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={earningsStyles.scrollView}
        contentContainerStyle={earningsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Earnings Card */}
        <LinearGradient
          colors={['#237227', '#1B5A1F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={earningsStyles.earningsCard}
        >
          <Text variant="body" color="#0A0A0A" style={earningsStyles.earningsLabel}>
            Total Earnings
          </Text>
          <Text variant="h1" color="#111111" style={earningsStyles.earningsAmount}>
            ₹{totalEarnings}
          </Text>

          {/* Stats Row */}
          <View style={earningsStyles.statsRow}>
            <View style={earningsStyles.statItem}>
              <Text variant="bodySm" color="#0A0A0A" style={earningsStyles.statLabel}>
                Orders
              </Text>
              <Text variant="body" color="#111111" style={earningsStyles.statValue}>
                {ordersCount}
              </Text>
            </View>
            <View style={earningsStyles.statItem}>
              <Text variant="bodySm" color="#0A0A0A" style={earningsStyles.statLabel}>
                Online Time
              </Text>
              <Text variant="body" color="#111111" style={earningsStyles.statValue}>
                {onlineTime}
              </Text>
            </View>
            <View style={earningsStyles.statItem}>
              <Text variant="bodySm" color="#0A0A0A" style={earningsStyles.statLabel}>
                Avg/Order
              </Text>
              <Text variant="body" color="#111111" style={earningsStyles.statValue}>
                ₹{avgOrderValue}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Weekly Breakdown Card */}
        <View style={earningsStyles.weeklyBreakdownCard}>
          <View style={earningsStyles.weeklyBreakdownHeader}>
            <View style={earningsStyles.weeklyBreakdownTitleContainer}>
              <Text variant="h3" color="#101828" style={earningsStyles.weeklyBreakdownTitle}>
                Weekly Breakdown
              </Text>
              {formatWeekRange && (
                <Text variant="caption" color="#6A7282" style={earningsStyles.weeklyBreakdownDate}>
                  {formatWeekRange}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={earningsStyles.calendarIconButton}
              onPress={handleCalendarPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Increases tap area
            >
              <Image
                source={require('../assets/earnings/icon-calendar.png')}
                style={earningsStyles.sectionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <WeeklyBarChart data={weeklyData} maxValue={Math.max(1, ...weeklyData.map((d) => d.value))} />
        </View>

        {/* Active Incentives Section */}
        <View style={earningsStyles.section}>
          <View style={earningsStyles.sectionHeader}>
            <Text variant="h3" color="#101828" style={earningsStyles.sectionTitle}>
              Active Incentives
            </Text>
            <Image
              source={require('../assets/earnings/icon-gift.png')}
              style={earningsStyles.sectionIcon}
              resizeMode="contain"
            />
          </View>
          <View style={earningsStyles.incentivesList}>
            <FlatList
              data={activeIncentivesFromBackend}
              renderItem={renderIncentive}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={earningsStyles.incentiveSeparator} />}
            />
          </View>
        </View>

        <EarningsCashOutSection amount={totalEarnings} buttonTextVariant="bodySm" />

        {/* Payout History Section */}
        <View style={earningsStyles.section}>
          <Text variant="h3" color="#101828" style={earningsStyles.sectionTitle}>
            Payout History
          </Text>
          <FlatList
            data={payoutHistory}
            renderItem={renderPayout}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={earningsStyles.payoutSeparator} />}
            ListEmptyComponent={() => (
              <View style={{ padding: scale(20), alignItems: 'center' }}>
                <Text variant="bodySm" color="#6B7280">No payout history found</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      {/* Week Calendar Modal */}
      <WeekCalendarModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onSelectWeek={handleWeekSelect}
        initialWeek={selectedWeek}
      />
    </SafeAreaView>
  );
}

