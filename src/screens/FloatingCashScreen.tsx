/**
 * Floating Cash Screen – COD collected vs deposited (backend synced)
 */

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { getCashSummary, getCashTransactions } from '../api/cash';

export default function FloatingCashScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const [activeTab, setActiveTab] = useState<'all' | 'collected' | 'deposited'>('all');

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['cash', 'summary'],
    queryFn: getCashSummary,
    staleTime: 30 * 1000,
  });

  const { data: txRes, isLoading: txLoading } = useQuery({
    queryKey: ['cash', 'transactions'],
    queryFn: () => getCashTransactions(50),
    staleTime: 30 * 1000,
  });

  const cashToDeposit = summary?.cashToDeposit ?? 0;
  const limit = config.cashLimit;
  const transactions: CashTransaction[] = txRes?.transactions ?? [];

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter((t) => t.type === activeTab);
  }, [activeTab, transactions]);

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

  const isLoading = summaryLoading || txLoading;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <BackIconSmall size={scale(28)} color={Theme.colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text variant="h2" color={Theme.colors.textDark} style={styles.title}>
              Floating Cash
            </Text>
          </View>
          <View style={{ width: scale(28) }} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <CashSummaryCard
              cashToDeposit={cashToDeposit}
              limit={limit}
              onDepositPress={handleDepositPress}
            />

            <View style={styles.tabContainer}>
              {(['all', 'collected', 'deposited'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.tabActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text variant="bodySm" color={activeTab === tab ? Theme.colors.primaryMedium : Theme.colors.textGrey} style={styles.tabText}>
                    {tab === 'all' ? 'All' : tab === 'collected' ? 'Collected' : 'Deposited'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.transactionsList}>
              {filteredTransactions.length === 0 ? (
                <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.emptyText}>
                  No transactions yet
                </Text>
              ) : (
                filteredTransactions.map((transaction) => (
                  <CashHistoryItem key={transaction.id} transaction={transaction} onPress={() => handleTransactionPress(transaction)} />
                ))
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.backgroundLight },
  header: { paddingHorizontal: scale(21), paddingVertical: verticalScale(14), borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: scale(28), height: scale(28), justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, alignItems: 'center' },
  title: { fontSize: scale(17.5), lineHeight: scale(24.5), fontFamily: 'Arial', fontWeight: '700', textAlign: 'center' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: scale(21), paddingTop: verticalScale(21), paddingBottom: verticalScale(28) },
  tabContainer: { flexDirection: 'row', gap: scale(8), marginTop: verticalScale(21), marginBottom: verticalScale(14) },
  tab: { flex: 1, paddingVertical: verticalScale(10), borderRadius: scale(8), backgroundColor: '#F3F4F6', alignItems: 'center' },
  tabActive: { backgroundColor: '#E8F5E9' },
  tabText: { fontWeight: '600' },
  transactionsList: { gap: scale(10) },
  emptyText: { textAlign: 'center', paddingVertical: verticalScale(24) },
});
