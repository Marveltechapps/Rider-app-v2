/**
 * Profile Screen Component
 * Rider profile screen with personal info, settings, and performance stats
 * Matches Figma design exactly
 */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileRow from '../components/ProfileRow';
import Text from '../components/common/Text';
import BankIcon from '../components/icons/BankIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import DocumentTextIcon from '../components/icons/DocumentTextIcon';
import EditIcon from '../components/icons/EditIcon';
import EmailIcon from '../components/icons/EmailIcon';
import HelpIcon from '../components/icons/HelpIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import ClockIcon from '../components/icons/ClockIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import RupeeIcon from '../components/icons/RupeeIcon';
import StarIcon from '../components/icons/StarIcon';
import ConfirmDialog from '../components/ConfirmDialog';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { useUser } from '../contexts';
import { profileEmailDisplay, profilePhoneDisplay } from '@/utils/loginContact';
import { deleteAccount } from '../api/auth';
import { getRider, getRiderStats } from '../api/rider';
import { getEarningsSummary } from '../api/payouts';
import { useKycDocumentSummary } from '../hooks/useKycDocumentSummary';
import profileStyles from '../styles/profileStyles';
import { getProfileDocumentsStatusLabel } from '../utils/kycDocumentStatus';
import { scale, verticalScale } from '../utils/responsive';

export default function ProfileScreen() {
  const router = useRouter();
  const { userData, logout: apiLogout } = useUser();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { counts, isLoading: kycSummaryLoading } = useKycDocumentSummary();

  const documentsStatusBadge = useMemo(() => {
    if (kycSummaryLoading && counts.total === 0) {
      return <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />;
    }
    const { label, variant } = getProfileDocumentsStatusLabel(counts);
    if (variant === 'verified') {
      return (
        <View style={profileStyles.verifiedBadge}>
          <Text variant="caption" style={profileStyles.verifiedText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      );
    }
    if (variant === 'mixed') {
      return (
        <View style={profileStyles.documentsStatusBadgeMixed}>
          <Text variant="caption" style={profileStyles.documentsStatusTextMixed} numberOfLines={1}>
            {label}
          </Text>
        </View>
      );
    }
    return (
      <View style={profileStyles.pendingBadge}>
        <Text variant="caption" style={profileStyles.pendingText} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  }, [counts, kycSummaryLoading]);

  const { data: riderProfile } = useQuery({
    queryKey: ['rider', 'profile', userData.riderId],
    queryFn: () => getRider(userData.riderId!).then((res) => res.rider),
    enabled: !!userData.riderId,
    staleTime: 30 * 1000,
  });

  const { data: lifetimeSummary } = useQuery({
    queryKey: ['earnings', 'summary', 'lifetime'],
    queryFn: () => getEarningsSummary('lifetime'),
    enabled: !!userData.riderId,
    staleTime: 60 * 1000,
  });

  const { data: riderStats } = useQuery({
    queryKey: ['rider', 'stats', userData.riderId],
    queryFn: () => getRiderStats(userData.riderId!).then((r) => r.stats),
    enabled: !!userData.riderId,
    staleTime: 60 * 1000,
  });

  const riderData = useMemo(() => {
    const rawName = riderProfile?.name ?? userData.name ?? 'Rider Name';
    const isPlaceholder = !rawName || rawName === 'Rider Name' || (rawName.startsWith('Rider ') && /^\d{4}$/.test(rawName.substring(6)));
    const loginMethod = userData.loginMethod;
    const loginContact = userData.loginContact;
    const rawPhone = riderProfile?.phoneNumber ?? userData.phoneNumber ?? '';
    const rawEmail = riderProfile?.email ?? userData.email ?? '';
    const phone = profilePhoneDisplay(loginMethod, rawPhone);
    const email = profileEmailDisplay(loginMethod, rawEmail);

    const primaryContact =
      loginMethod === 'email'
        ? loginContact || email
        : loginMethod === 'whatsapp'
          ? loginContact || phone
          : loginContact || phone;

    return {
      name: isPlaceholder ? '-' : rawName,
      riderId: userData.riderId ?? riderProfile?.riderId ?? '—',
      rating: riderStats?.stats?.averageRating ?? riderProfile?.stats?.averageRating ?? 0,
      deliveries: lifetimeSummary?.orderCount ?? riderStats?.stats?.completedDeliveries ?? 0,
      phone: loginMethod === 'email' ? '—' : primaryContact !== '—' ? primaryContact : phone,
      email: loginMethod === 'email' ? (primaryContact !== '—' ? primaryContact : email) : email,
      loginMethod,
      floatingCash: riderStats?.floatingCash ?? riderProfile?.earnings?.pendingAmount ?? 0,
      stats: {
        acceptanceRate: riderStats?.stats?.acceptanceRate ?? '—',
        onTimeDelivery: riderStats?.stats?.onTimeDelivery ?? '—',
        totalOnlineTime: lifetimeSummary?.onlineTime ?? '0h',
        lifetimeEarnings: `₹${lifetimeSummary?.totalEarnings ?? riderStats?.lifetimeEarnings ?? 0}`,
      },
    };
  }, [riderProfile, riderStats, userData, lifetimeSummary]);

  const handleEditProfile = useCallback(() => {
    console.log('Edit Profile');
    router.push('/edit-profile' as any);
  }, [router]);

  const handleMyDocuments = useCallback(() => {
    console.log('My Documents');
    router.push('/my-documents' as any);
  }, [router]);

  const handleBankDetails = useCallback(() => {
    console.log('Bank Details');
    router.push('/payment-details' as any);
  }, [router]);

  const handleFloatingCash = useCallback(() => {
    console.log('Floating Cash');
    router.push('/floating-cash' as any);
  }, [router]);

  const handleMyShifts = useCallback(() => {
    console.log('My Shifts');
    router.push('/my-shifts' as any);
  }, [router]);

  const handleHelpSupport = useCallback(() => {
    console.log('Help & Support');
    router.push('/help-support' as any);
  }, [router]);

  const handleTermsConditions = useCallback(() => {
    router.push({
      pathname: '/terms-conditions',
      params: { returnTo: '/(tabs)/profile' },
    } as any);
  }, [router]);

  const handlePrivacyPolicy = useCallback(() => {
    router.push({
      pathname: '/privacy-policy',
      params: { returnTo: '/(tabs)/profile' },
    } as any);
  }, [router]);

  const handleLogout = useCallback(() => {
    setLogoutDialogVisible(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    await apiLogout();
    setLogoutDialogVisible(false);
    router.replace('/login');
  }, [router, apiLogout]);

  const handleDeleteAccount = useCallback(() => {
    setDeleteDialogVisible(true);
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    try {
      await deleteAccount();
      await apiLogout();
      setDeleteDialogVisible(false);
      router.replace('/login');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Try again.';
      Alert.alert('Could not delete account', message);
    }
  }, [router, apiLogout]);

  // Get user initials for fallback avatar
  const userInitials = useMemo(() => {
    const name = riderData.name || 'Rider';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'R';
  }, [riderData.name]);

  return (
    <SafeAreaView style={profileStyles.container} edges={['top']}>
      {/* Header */}
      <Header
        title="Profile"
        showBackButton={false}
      />

      <ScrollView
        style={profileStyles.scrollView}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rider Summary Card */}
        <View style={[profileStyles.settingsSection, { paddingTop: verticalScale(20) }]}>
          <View style={profileStyles.riderCard}>
            {/* Top: Avatar + Info */}
            <View style={profileStyles.riderCardTop}>
              <View style={profileStyles.avatar}>
                {userData.profilePhotoUri ? (
                  <Image
                    source={{ uri: userData.profilePhotoUri }}
                    style={profileStyles.avatarImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={profileStyles.avatarFallback}>
                    <Text variant="h3" color={Theme.colors.primaryMedium} style={profileStyles.avatarInitials}>
                      {userInitials}
                    </Text>
                  </View>
                )}
              </View>
              <View style={profileStyles.riderInfo}>
                <Text variant="h3" color={Theme.colors.textDark} style={profileStyles.riderName}>
                  {riderData.name}
                </Text>
                <Text variant="bodySm" color={Theme.colors.textGrey} style={profileStyles.riderId}>
                  Rider ID: {riderData.riderId}
                </Text>
                {/* Stats Pills */}
                <View style={profileStyles.riderStats}>
                  <View style={profileStyles.statPill}>
                    <StarIcon size={scale(12)} color="#FFB800" filled />
                    <Text variant="bodySm" color={Theme.colors.textDark} style={profileStyles.statText}>
                      {riderData.rating}
                    </Text>
                  </View>
                  <View style={profileStyles.statPill}>
                    <Text variant="bodySm" color={Theme.colors.textDark} style={profileStyles.statText}>
                      {riderData.deliveries} deliveries
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={profileStyles.contactDivider} />

            {/* Contact Info */}
            <View style={profileStyles.contactSection}>
              {riderData.loginMethod !== 'email' ? (
                <View style={profileStyles.contactRow}>
                  <PhoneIcon size={scale(16)} color={Theme.colors.primaryMedium} />
                  <Text variant="bodySm" color={Theme.colors.textGrey} style={profileStyles.contactText}>
                    {riderData.loginMethod === 'whatsapp' ? `WhatsApp: ${riderData.phone}` : riderData.phone}
                  </Text>
                </View>
              ) : null}
              {riderData.loginMethod === 'email' || (riderData.email && riderData.email !== '—') ? (
                <View style={profileStyles.contactRow}>
                  <EmailIcon size={scale(16)} color={Theme.colors.primaryMedium} />
                  <Text variant="bodySm" color={Theme.colors.textGrey} style={profileStyles.contactText}>
                    {riderData.loginMethod === 'email' ? riderData.email : riderData.email}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Settings / Options List */}
        <View style={profileStyles.settingsSection}>
          <ProfileRow
            icon={<EditIcon size={scale(18)} color="#6A7282" />}
            label="Edit Profile"
            onPress={handleEditProfile}
          />

          <ProfileRow
            icon={<ClockIcon size={scale(18)} color="#6A7282" />}
            label="My Shifts"
            onPress={handleMyShifts}
          />

          <ProfileRow
            icon={<DocumentIcon size={scale(18)} color="#6A7282" />}
            label="My Documents"
            onPress={handleMyDocuments}
            rightBadge={documentsStatusBadge}
          />

          <ProfileRow
            icon={<BankIcon size={scale(18)} color="#6A7282" />}
            label="Bank Details"
            onPress={handleBankDetails}
          />

          <ProfileRow
            icon={<RupeeIcon size={scale(18)} color="#6A7282" />}
            label="Floating Cash"
            onPress={handleFloatingCash}
            rightBadge={
              <View style={profileStyles.floatingCashBadge}>
                <Text variant="caption" style={profileStyles.floatingCashText}>
                  ₹{riderData.floatingCash}
                </Text>
              </View>
            }
          />

          <ProfileRow
            icon={<HelpIcon size={scale(18)} color="#6A7282" />}
            label="Help & Support"
            onPress={handleHelpSupport}
          />

          <ProfileRow
            icon={<DocumentTextIcon size={scale(18)} color="#6A7282" />}
            label="Terms & Conditions"
            onPress={handleTermsConditions}
          />

          <ProfileRow
            icon={<DocumentTextIcon size={scale(18)} color="#6A7282" />}
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />

          <ProfileRow
            icon={<LogoutIcon size={scale(18)} color="#B91C1C" />}
            label="Delete account"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* Performance Stats Section */}
        <View style={profileStyles.statsSection}>
          <Text variant="h3" color="#101828" style={profileStyles.statsSectionTitle}>
            Performance Stats
          </Text>
          <View style={profileStyles.statsGrid}>
            <View style={profileStyles.statsRow}>
              <View style={profileStyles.statCard}>
                <Text variant="h2" color="#237227" style={profileStyles.statValue}>
                  {riderData.stats.acceptanceRate}
                </Text>
                <Text variant="bodySm" color="#6A7282" style={profileStyles.statLabel}>
                  Acceptance Rate
                </Text>
              </View>
              <View style={profileStyles.statCard}>
                <Text variant="h2" color="#237227" style={profileStyles.statValue}>
                  {riderData.stats.onTimeDelivery}
                </Text>
                <Text variant="bodySm" color="#6A7282" style={profileStyles.statLabel}>
                  On-time Delivery
                </Text>
              </View>
            </View>
            <View style={profileStyles.statsRow}>
              <View style={profileStyles.statCard}>
                <Text variant="h2" color="#237227" style={profileStyles.statValue}>
                  {riderData.stats.totalOnlineTime}
                </Text>
                <Text variant="bodySm" color="#6A7282" style={profileStyles.statLabel}>
                  Total Online Time
                </Text>
              </View>
              <View style={profileStyles.statCard}>
                <Text variant="h2" color="#237227" style={profileStyles.statValue}>
                  {riderData.stats.lifetimeEarnings}
                </Text>
                <Text variant="bodySm" color="#6A7282" style={profileStyles.statLabel}>
                  Lifetime Earnings
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={profileStyles.logoutSection}>
          <TouchableOpacity
            style={profileStyles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogoutIcon size={scale(14)} color="#E7000B" />
            <Text variant="bodySm" style={profileStyles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={profileStyles.footer}>
          <Text variant="bodySm" style={profileStyles.footerText}>
            QuickRider Partner v1.0.0
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={logoutDialogVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={confirmLogout}
      />
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete account"
        message="Your account will be closed and personal details removed from the app. You must finish or cancel any active deliveries first. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onCancel={() => setDeleteDialogVisible(false)}
        onConfirm={confirmDeleteAccount}
      />

      {/* Bottom Tab Bar */}
    </SafeAreaView>
  );
}
