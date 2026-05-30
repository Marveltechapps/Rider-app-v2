/**
 * Error Boundary – catches React errors (e.g. from missing API base URL)
 * and shows a friendly message instead of the default "Something went wrong".
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './common/Text';
import { Theme } from '../constants/Theme';
import { API_BASE_URL_ENV_KEY } from '../api/config';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const msg = this.state.error.message;
      const isConfigError =
        msg.includes('API base URL') ||
        msg.includes(API_BASE_URL_ENV_KEY) ||
        msg.includes('is not set');

      return (
        <View style={styles.container}>
          <Text variant="h2" style={styles.title}>
            {isConfigError ? 'Server not configured' : 'Something went wrong'}
          </Text>
          <Text variant="body" color={Theme.colors.textSecondary} style={styles.body}>
            {isConfigError
              ? `Add ${API_BASE_URL_ENV_KEY}=http://YOUR_IP:3333 in rider_app/.env and restart Expo with: npx expo start -c`
              : 'Please try again. If this keeps happening, restart the app.'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  title: {
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
