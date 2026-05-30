/**
 * Earnings Screen Component
 * Main earnings screen - manages tab switching between Today, Week, and Month
 * 
 * @component
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EarningsTodayScreen from './EarningsTodayScreen';
import EarningsWeekScreen from './EarningsWeekScreen';
import EarningsMonthScreen from './EarningsMonthScreen';

export default function EarningsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>(
    params.tab === 'week' ? 'week' : params.tab === 'month' ? 'month' : 'today',
  );

  useEffect(() => {
    if (params.tab === 'week') {
      setActiveTab('week');
    } else if (params.tab === 'month') {
      setActiveTab('month');
    } else {
      setActiveTab('today');
    }
  }, [params.tab]);

  // Render based on active tab
  if (activeTab === 'week') {
    return <EarningsWeekScreen />;
  }
  
  if (activeTab === 'month') {
    return <EarningsMonthScreen />;
  }

  return <EarningsTodayScreen />;
}

