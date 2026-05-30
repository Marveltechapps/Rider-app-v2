/**
 * Training & Kit Screen Component
 * Pixel-perfect onboarding screen matching Figma design exactly
 * 
 * @component
 * @example
 * <TrainingKitScreen />
 */

import { useRouter } from 'expo-router';
import { goBackOrReplace } from '../utils/navigation/safeBack';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import ChecklistItem from '../components/features/ChecklistItem';
import InfoBanner from '../components/features/InfoBanner';
import StatusPill from '../components/features/StatusPill';
import TrainingCard from '../components/features/TrainingCard';
import ArrowRightWhiteIcon from '../components/icons/ArrowRightWhiteIcon';
import DeliveryBagIcon from '../components/icons/DeliveryBagIcon';
import IDCardIcon from '../components/icons/IDCardIcon';
import KitCheckmarkIcon from '../components/icons/KitCheckmarkIcon';
import PackageIcon from '../components/icons/PackageIcon';
import TShirtIcon from '../components/icons/TShirtIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { useUser } from '../contexts';
import { scale, verticalScale } from '../utils/responsive';
import { getKitConfig, getTrainingVideos, type TrainingVideo, type KitConfig, type KitItem as ApiKitItem } from '../api/training-kit';

interface KitItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
}

export default function TrainingKitScreen() {
  const router = useRouter();
  const { userData, updateUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [kitConfig, setKitConfig] = useState<any>(null);
  const [kitItems, setKitItems] = useState<KitItem[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      const [vData, kData] = await Promise.all([
        getTrainingVideos().catch(err => {
          console.warn('[TrainingKit] Failed to fetch training videos:', err?.message ?? err);
          return null;
        }),
        getKitConfig().catch(err => {
          console.warn('[TrainingKit] Failed to fetch kit config:', err?.message ?? err);
          return null;
        })
      ]);

      console.log('[TrainingKit] Videos response:', vData ? `${Array.isArray(vData) ? vData.length : 'not-array'} items` : 'null');
      console.log('[TrainingKit] Kit config response:', kData ? JSON.stringify(kData).slice(0, 200) : 'null');

      const rawVideos = vData && Array.isArray(vData) ? vData : [];
      const activeVideos = rawVideos.filter((vv: TrainingVideo) => vv.isActive !== false);
      setVideos(activeVideos);
      if (activeVideos.length > 0) {
        const primary =
          activeVideos.find((vv: TrainingVideo) => Number(vv.order) === 1) ?? activeVideos[0] ?? null;
        setSelectedVideo(primary);
        console.log('[TrainingKit] Selected video:', primary?.title ?? 'none');
      } else {
        setSelectedVideo(null);
        console.log('[TrainingKit] No active training videos from API');
      }

      if (kData) {
        setKitConfig(kData);
      }

      let serverTrainingComplete = false;

      // Fetch authenticated data separately
      try {
        const { getOnboardingState } = await import('@/api/auth');
        const oData = await getOnboardingState();

        if (oData) {
          if (oData.success !== false) {
            // Handle both {success:true, ...} and raw state
            serverTrainingComplete = !!oData.trainingCompleted;

            // Map kit items with checked status
            if (kData) {
              const checkedIds = oData.checkedKitItems || [];
              const items = (kData.items || [])
                .filter((i: ApiKitItem) => i.isActive)
                .map((item: ApiKitItem) => ({
                  id: item.id,
                  label: item.label,
                  icon: getIcon(item.iconName),
                  checked: checkedIds.includes(item.id),
                }));
              setKitItems(items);
            }
          }
        }
      } catch (authError) {
        console.warn('Failed to fetch onboarding state (user might not be authenticated):', authError);

        // Even if auth fails, still show kit items from config (unchecked)
        if (kData) {
          const items = (kData.items || [])
            .filter((i: ApiKitItem) => i.isActive)
            .map((item: ApiKitItem) => ({
              id: item.id,
              label: item.label,
              icon: getIcon(item.iconName),
              checked: false,
            }));
          setKitItems(items);
        }
      }

      // No videos in CMS (or fetch failed): do not dead-end — sync training on backend and unlock kit checklist.
      if (activeVideos.length === 0) {
        if (!serverTrainingComplete) {
          try {
            const { completeTraining } = await import('@/api/auth');
            await completeTraining();
            serverTrainingComplete = true;
          } catch (e) {
            console.warn('[TrainingKit] completeTraining for empty video catalog failed:', e);
            serverTrainingComplete = true;
          }
        }
        setTrainingCompleted(serverTrainingComplete);
        setVideoWatched(true);
      } else {
        setTrainingCompleted(serverTrainingComplete);
        setVideoWatched(serverTrainingComplete);
      }

      // store fetched data in rider profile context
      try {
        updateUserData({
          trainingVideos: vData || [],
          kitConfig: kData || null,
        } as any);
      } catch (e) {
        console.warn('Unable to persist training/kit into user profile:', e);
      }
    } catch (error) {
      console.error('Failed to load training/kit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'tshirt': return <TShirtIcon size={scale(28)} color="#4A5565" />;
      case 'delivery_bag': return <DeliveryBagIcon size={scale(28)} color="#4A5565" />;
      case 'id_card': return <IDCardIcon size={scale(28)} color="#4A5565" />;
      default: return <PackageIcon size={scale(28)} color="#4A5565" />;
    }
  };

  const handleBack = () => {
    goBackOrReplace(router, '/verification');
  };

  const handleVideoComplete = async () => {
    try {
      if (!trainingCompleted) {
        const { completeTraining } = await import('@/api/auth');
        await completeTraining();
        setTrainingCompleted(true);
        setVideoWatched(true);
        console.log('Training marked as completed locally and on backend.');
        console.log('Video training completed on backend');
      }
    } catch (error) {
      console.error('Failed to mark training as completed on backend:', error);
      // Still allow UI progress
      setTrainingCompleted(true);
      setVideoWatched(true);
    }
  };

  const handleToggleItem = async (id: string) => {
    // Only allow toggling if video is watched
    if (!videoWatched) {
      return;
    }
    
    const newItems = kitItems.map(item => (item.id === id ? { ...item, checked: !item.checked } : item));
    setKitItems(newItems);

    try {
      const checkedIds = newItems.filter(i => i.checked).map(i => i.id);
      const { updateKitStatus } = await import('@/api/auth');
      await updateKitStatus(checkedIds);
      console.log('Kit status updated on backend:', checkedIds);
    } catch (error) {
      console.error('Failed to update kit status on backend:', error);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      const { completeTraining } = await import('@/api/auth');
      await completeTraining();
      
      // Save onboarding status to local context
      updateUserData({ onboardingComplete: true });
      // Clear stored onboarding step and navigate to home screen after completing onboarding
      const { clearStoredOnboardingStep } = await import('@/api/storage');
      await clearStoredOnboardingStep();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding on backend:', error);
      // Fallback: still update local state so user can proceed if they really are done
      updateUserData({ onboardingComplete: true });
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const allItemsChecked = kitItems.every(item => item.checked);
  const canCompleteOnboarding = trainingCompleted && videoWatched && allItemsChecked;
  const showBanner = allItemsChecked && videoWatched;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Training & Kit"
          subtitle="Get ready to start delivering"
          onBack={handleBack}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Rider Training */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="loginButton" color={Theme.colors.textDark} style={styles.sectionTitle}>
                Rider Training
              </Text>
              {trainingCompleted && <StatusPill />}
            </View>

            {/* Training Card - plays video inline when tapped */}
            {selectedVideo ? (
              <TrainingCard
                key={selectedVideo._id}
                title={selectedVideo.title}
                duration={selectedVideo.durationDisplay}
                thumbnailUrl={selectedVideo.thumbnailUrl}
                videoUrl={selectedVideo.videoUrl}
                completed={trainingCompleted}
                onVideoComplete={handleVideoComplete}
                style={styles.trainingCard}
              />
            ) : videos.length > 0 ? (
              <TrainingCard
                key={videos[0]._id}
                title={videos[0].title}
                duration={videos[0].durationDisplay}
                thumbnailUrl={videos[0].thumbnailUrl}
                videoUrl={videos[0].videoUrl}
                completed={trainingCompleted}
                onVideoComplete={handleVideoComplete}
                style={styles.trainingCard}
              />
            ) : (
              <View style={styles.noVideoCard}>
                <Text variant="loginButton" color={Theme.colors.textDark} style={styles.noVideoTitle}>
                  Training video unavailable
                </Text>
                <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.noVideoBody}>
                  There is no active training video configured. You can continue with kit collection below. If this
                  looks wrong, ask your hub admin to publish a video in the dashboard.
                </Text>
              </View>
            )}
          </View>

          {/* Section 2: Collect Rider Kit */}
          <View style={styles.section}>
            <View style={styles.kitCard}>
              {/* Header with Icon */}
              <View style={styles.kitCardHeader}>
                <View style={styles.kitIconContainer}>
                  <KitCheckmarkIcon size={scale(35)} />
                </View>
                <View style={styles.kitCardHeaderText}>
                  <Text variant="loginButton" color={Theme.colors.textDark} style={styles.kitCardTitle}>
                    {kitConfig?.title || 'Collect Rider Kit'}
                  </Text>
                  <View style={styles.kitCardDescription}>
                    <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.kitCardText}>
                      {kitConfig?.description?.split('your assigned hub')[0] || 'Please collect your assets from '}
                      <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.kitCardBold}>
                        {userData.hubName || 'Koramangala Hub'}
                      </Text>
                      {kitConfig?.description?.split('your assigned hub')[1] || ' to start delivering.'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Checklist Items */}
              <View style={styles.checklistContainer}>
                {kitItems.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    checked={item.checked}
                    onToggle={() => handleToggleItem(item.id)}
                    disabled={!videoWatched}
                  />
                ))}
              </View>
              
              {/* Helper text when video not watched */}
              {!videoWatched && (
                <Text style={styles.helperText}>
                  Complete the training video above to unlock kit collection
                </Text>
              )}
            </View>

            {/* Info Banner (shown when all items checked) */}
            {showBanner ? (
              <View style={styles.infoBannerContainer}>
                <InfoBanner message="Assets Verified! You are ready to start." />
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Complete Onboarding"
            onPress={handleCompleteOnboarding}
            variant="primary"
            size="medium"
            disabled={!canCompleteOnboarding}
            icon={<ArrowRightWhiteIcon size={scale(14)} />}
            iconPosition="right"
            style={!canCompleteOnboarding ? styles.completeButtonDisabled : styles.completeButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(21),
    gap: verticalScale(21), // Figma: gap: 21px
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10.5), // Gap to card
  },
  sectionTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
  },
  trainingCard: {
    marginBottom: verticalScale(12),
  },
  kitCard: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Exact Figma color
    borderRadius: scale(8),
    padding: scale(20),
    paddingVertical: scale(20),
    paddingHorizontal: scale(12),
    gap: verticalScale(12), // Figma: gap: 12px
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  kitCardHeader: {
    flexDirection: 'row',
    gap: scale(8), // Figma: gap: 8px
    marginBottom: verticalScale(7), // Gap to checklist
  },
  kitIconContainer: {
    width: scale(35),
    height: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitCardHeaderText: {
    flex: 1,
    gap: scale(3.5), // Figma: gap: 3.5px
  },
  kitCardTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(23.63), // 15.75 * 1.5
    fontWeight: '700',
    color: Theme.colors.textDark,
  },
  kitCardDescription: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  kitCardText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '400',
    color: Theme.colors.textGrey,
  },
  kitCardBold: {
    fontWeight: '700',
  },
  checklistContainer: {
    gap: verticalScale(8), // Figma: gap: 10.5px
    paddingTop: scale(7), // Figma: padding: 7px 0px 0px
  },
  infoBannerContainer: {
    marginTop: verticalScale(26), // Figma: margin: 8px 0px 0px
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Exact Figma color
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  completeButton: {
    backgroundColor: Theme.colors.primaryMedium, // #32C96A
    // Shadow: 0px 4px 6px -4px rgba(50, 201, 106, 0.2), 0px 10px 15px -3px rgba(50, 201, 106, 0.2)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  completeButtonDisabled: {
    backgroundColor: '#E5E7EB',
    // Opacity only on Button's disabled style — avoid stacking with Theme (was nearly invisible).
  },
  noVideoCard: {
    width: '100%',
    minHeight: scale(120),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: scale(16),
    justifyContent: 'center',
  },
  noVideoTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  noVideoBody: {
    fontSize: scale(12.25),
    lineHeight: scale(18),
  },
  helperText: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.body.fontFamily,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});
