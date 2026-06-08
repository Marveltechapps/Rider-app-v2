/**
 * Earnings Today Screen Component
 * Earnings screen showing today's earnings, active incentives, and payout history
 * Matches Figma design exactly
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlatList, Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EarningsCashOutSection from '../components/EarningsCashOutSection';
import EarningsSegmentControl, { EarningsTab } from '../components/EarningsSegmentControl';
import Text from '../components/common/Text';
import RupeeIcon from '../components/icons/RupeeIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { useConfigWithDefaults } from '../contexts';
import earningsStyles from '../styles/earningsStyles';
import { scale } from '../utils/responsive';
import { getEarningsSummary, listPayouts } from '../api/payouts';

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

export default function EarningsTodayScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const activeTab: EarningsTab = 'today';

  const { data: summaryRes } = useQuery({
    queryKey: ['earnings', 'summary', 'today'],
    queryFn: () => getEarningsSummary('today'),
    staleTime: 60 * 1000,
  });

  const totalEarnings = summaryRes?.totalEarnings != null ? String(summaryRes.totalEarnings) : '0';
  const ordersCount = summaryRes?.orderCount != null ? String(summaryRes.orderCount) : '0';
  const avgOrderValue =
    summaryRes?.orderCount != null && summaryRes.orderCount > 0 && summaryRes?.totalEarnings != null
      ? String(Math.round(summaryRes.totalEarnings / summaryRes.orderCount))
      : '—';
  const onlineTime = (summaryRes as { onlineTime?: string } | undefined)?.onlineTime ?? '—';
  const activeIncentivesFromBackend =
    (summaryRes as { activeIncentives?: Incentive[] } | undefined)?.activeIncentives ?? [];

  const { data: payoutsRes } = useQuery({
    queryKey: ['payouts', 'list'],
    queryFn: () => listPayouts(config.payoutListLimit),
    staleTime: 30 * 1000,
  });
  const payoutHistory = useMemo(() => {
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
      if (tab === 'thisWeek') {
        router.push('/earnings?tab=week' as any);
      } else if (tab === 'thisMonth') {
        router.push('/earnings?tab=month' as any);
      }
      // If tab is 'today', stay on current screen
    },
    [router],
  );

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
    <SafeAreaView style={earningsStyles.container} edges={['top']}>
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
          colors={['rgba(35, 114, 39, 1)', 'rgba(27, 90, 31, 1)']}
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

        <EarningsCashOutSection amount={totalEarnings} />

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
    </SafeAreaView>
  );
}

