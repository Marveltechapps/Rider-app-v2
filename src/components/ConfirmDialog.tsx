import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import Text from './common/Text';

export type ConfirmDialogConfirmVariant = 'primary' | 'destructive';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** When false, only the confirm button is shown (e.g. info / OK alerts). Default true. */
  showCancel?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirmVariant?: ConfirmDialogConfirmVariant;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  showCancel = true,
  onCancel,
  onConfirm,
  confirmVariant = 'primary',
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) setSubmitting(false);
  }, [visible]);

  const handleConfirm = useCallback(async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }, [onConfirm]);

  const confirmStyles =
    confirmVariant === 'destructive' ? styles.confirmDestructive : styles.confirmPrimary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text variant="h3" color={Theme.colors.textDark} style={styles.title}>
                {title}
              </Text>
              <Text variant="body" color={Theme.colors.textGrey} style={styles.message}>
                {message}
              </Text>
              <View style={styles.actions}>
                {showCancel ? (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    activeOpacity={0.7}
                    disabled={submitting}
                    accessibilityRole="button"
                    accessibilityLabel={cancelLabel}
                  >
                    <Text variant="body" style={styles.cancelButtonText}>
                      {cancelLabel}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.confirmButton, confirmStyles, submitting && styles.buttonDisabled]}
                  onPress={handleConfirm}
                  activeOpacity={0.85}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityLabel={confirmLabel}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text variant="body" style={styles.confirmButtonText}>
                      {confirmLabel}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  card: {
    width: '100%',
    maxWidth: scale(340),
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius['2xl'],
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    ...Theme.shadows.medium,
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  message: {
    textAlign: 'center',
    marginBottom: verticalScale(22),
    lineHeight: scale(22),
  },
  actions: {
    gap: verticalScale(10),
  },
  confirmButton: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(48),
  },
  confirmPrimary: {
    backgroundColor: Theme.colors.primaryMedium,
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmDestructive: {
    backgroundColor: '#E7000B',
    shadowColor: '#E7000B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: Theme.colors.white,
    fontWeight: '700',
    fontSize: scale(15),
    lineHeight: scale(22),
  },
  cancelButton: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Theme.colors.textGrey,
    fontWeight: '600',
    fontSize: scale(14),
    lineHeight: scale(20),
  },
});
