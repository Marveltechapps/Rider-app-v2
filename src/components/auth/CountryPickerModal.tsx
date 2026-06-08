import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthScreenTheme } from '@/hooks/useAuthScreenTheme';
import { COUNTRY_LIST, type CountryOption } from '@/lib/countries';

interface CountryPickerModalProps {
  visible: boolean;
  selectedCode: string;
  onSelect: (country: CountryOption) => void;
  onClose: () => void;
}

export default function CountryPickerModal({
  visible,
  selectedCode,
  onSelect,
  onClose,
}: CountryPickerModalProps) {
  const theme = useAuthScreenTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_LIST;
    return COUNTRY_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        },
        sheet: {
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '75%',
          minHeight: '50%',
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.layout.contentPaddingH,
          paddingVertical: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.headerBorder,
        },
        title: {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.textPrimary,
        },
        search: {
          marginHorizontal: theme.layout.contentPaddingH,
          marginVertical: theme.spacing.sm,
          borderWidth: 1,
          borderColor: theme.colors.inputBorder,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        },
        list: {
          paddingHorizontal: theme.spacing.sm,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.md,
          gap: theme.spacing.sm,
        },
        rowSelected: {
          backgroundColor: theme.colors.countrySelectedBg,
        },
        flag: {
          fontSize: 20,
          width: 28,
        },
        name: {
          flex: 1,
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.textPrimary,
        },
        dial: {
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.mutedText,
          fontWeight: theme.typography.fontWeight.semibold,
        },
      }),
    [theme]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Select country</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Search country"
            placeholderTextColor={theme.colors.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {filtered.map((country) => {
              const selected = country.code === selectedCode;
              return (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => {
                    onSelect(country);
                    onClose();
                    setQuery('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.flag}>{country.flag}</Text>
                  <Text style={styles.name}>{country.name}</Text>
                  <Text style={styles.dial}>{country.dialCode}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
