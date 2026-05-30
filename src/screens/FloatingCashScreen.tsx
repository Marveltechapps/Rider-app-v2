/**
 * Floating Cash Screen Component
 * Cash deposits and transaction history screen matching Figma design exactly
 */

import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CashHistoryItem, { CashTransaction } from '../components/features/CashHistoryItem';
import CashSummaryCard from '../components/features/CashSummaryCard';
import BackIconSmall from '../components/icons/BackIconSmall';
import { Theme } from '../constants/Theme';
import { useConfigWithDefaults } from '../contexts';
import { scale, verticalScale } from '../utils/responsive';
import Text from '../components/common/Text';

// Mock transaction data - After deposit: Total collected: 2450, Total deposited: 2000, Cash to deposit: 450 (under 2000 limit)
// This shows the green progress bar state after deposit is completed
const mockTransactions: CashTransaction[] = [
  {
    id: '1',
    type: 'collected',
    title: 'Cash Collected',
    amount: 850,
    dateTime: 'Today, 2:30 PM',
    orderId: '#ORD-2991',
  },
  {
    id: '2',
    type: 'collected',
    title: 'Cash Collected',
    amount: 800,
    dateTime: 'Today, 1:15 PM',
    orderId: '#ORD-2990',
  },
  {
    id: '3',
    type: 'collected',
    title: 'Cash Collected',
    amount: 800,
    dateTime: 'Today, 12:00 PM',
    orderId: '#ORD-2989',
  },
  {
    id: '4',
    type: 'deposited',
    title: 'Cash Deposited',
    amount: 2000,
    dateTime: 'Today, 11:00 AM',
    status: 'SUCCESS',
  },
];

export default function FloatingCashScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const [activeTab, setActiveTab] = useState<'all' | 'collected' | 'deposited'>('all');

  // Calculate cash to be deposited (sum of collected - sum of deposited)
  const cashToDeposit = useMemo(() => {
    const collected = mockTransactions
      .filter((t) => t.type === 'collected')
      .reduce((sum, t) => sum + t.amount, 0);
    const deposited = mockTransactions
      .filter((t) => t.type === 'deposited')
      .reduce((sum, t) => sum + t.amount, 0);
    return collected - deposited;
  }, []);

  const limit = config.cashLimit;

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') {
      return mockTransactions;
    }
    return mockTransactions.filter((t) => t.type === activeTab);
  }, [activeTab]);

  const handleDepositPress = () => {
    router.push('/deposit-cash');
  };

  const handleTransactionPress = (transaction: CashTransaction) => {
    Alert.alert(
      transaction.title,
      `Amount: ${transaction.type === 'collected' ? '+' : '-'}₹${transaction.amount}\nDate: ${transaction.dateTime}\n${transaction.orderId ? `Order: ${transaction.orderId}` : transaction.referenceId ? `Reference: ${transaction.referenceId}` : ''}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <BackIconSmall size={scale(28)} color={Theme.colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text variant="h2" color={Theme.colors.textDark} style={styles.title}>
              Floating Cash
            </Text>
          </View>
          <View style={{ width: scale(28), height: 0 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cash Summary Card - Show when there's cash to deposit */}
        {cashToDeposit > 0 && (
          <View style={styles.summaryCardContainer}>
            <CashSummaryCard
              cashToDeposit={cashToDeposit}
              limit={limit}
              onDepositPress={handleDepositPress}
            />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'all' && styles.tabActive]}
              onPress={() => setActiveTab('all')}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={Theme.colors.textDark}
                style={styles.tabText}
              >
                All History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'collected' && styles.tabActive]}
              onPress={() => setActiveTab('collected')}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={Theme.colors.textDark}
                style={styles.tabText}
              >
                Collected
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'deposited' && styles.tabActive]}
              onPress={() => setActiveTab('deposited')}
              activeOpacity={0.7}
            >
              <Text
                variant="bodySm"
                color={Theme.colors.textDark}
                style={styles.tabText}
              >
                Deposited
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <CashHistoryItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
                No transactions found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  header: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderGrey,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(21),
    gap: 8,
    height: scale(28),
  },
  backButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  headerSpacer: {
    width: scale(42),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(100),
    gap: verticalScale(20),
  },
  summaryCardContainer: {
    paddingHorizontal: scale(0),
  },
  tabsContainer: {
    paddingHorizontal: scale(0),
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(12.75),
    padding: scale(0),
    gap: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: scale(4),
    paddingHorizontal: scale(7),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.small,
  },
  tabText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  transactionsList: {
    gap: scale(14),
  },
  emptyState: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(14),
    fontWeight: '400',
  },
});

