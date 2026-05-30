/**
 * ConfigContext – provides app config (limits, support, etc.) from API
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AppConfig } from '../api/config-api';
import { fetchAppConfig } from '../api/config-api';

interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const c = await fetchAppConfig();
      setConfig(c);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const value: ConfigContextType = {
    config,
    isLoading,
    error,
    refetch: loadConfig,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

/** Hook that returns config with defaults when loading – safe for screens that need immediate values */
export function useConfigWithDefaults(): AppConfig {
  const { config } = useConfig();
  const defaults: AppConfig = {
    cashLimit: 2000,
    depositMaxAmount: 2450,
    maxWithdrawalsPerDay: 2,
    orderListLimit: 100,
    payoutListLimit: 20,
    supportPhone: '1800-123-4567',
    supportEmail: 'support@selorg.com',
    privacyEmail: 'privacy@selorg.com',
    legalEmail: 'legal@selorg.com',
    supportSlaMessage: '24–48 hours',
    defaultHubName: 'Hub',
    vehicleTypes: ['Bike', 'Scooter', 'EV', 'Cycle'],
  };
  return config ?? defaults;
}
