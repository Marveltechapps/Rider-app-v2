/**
 * Verification Screen Component
 * Document verification process screen matching Figma design
 * 
 * @component
 * @example
 * <VerificationScreen />
 */

import { useRouter } from 'expo-router';
import { goBackOrReplace } from '../utils/navigation/safeBack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import CheckmarkIcon from '../components/icons/CheckmarkIcon';
import CheckmarkSmallIcon from '../components/icons/CheckmarkSmallIcon';
import LoadingSpinnerIcon from '../components/icons/LoadingSpinnerIcon';
import Header from '../components/layout/Header';
import { getKycStatus, type KycStatusItem } from '../api/kyc';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DocumentCardProps {
  label: string;
  verified: boolean;
  verifying: boolean;
}

function DocumentCard({ label, verified, verifying }: DocumentCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (verified) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [verified, fadeAnim]);

  return (
    <View style={styles.documentCard}>
      <Text variant="loginInfo" color="#4A5565" style={styles.documentLabel}>
        {label}
      </Text>
      {verified ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <CheckCircleIcon size={scale(27.31)} color={Theme.colors.primaryMedium} />
        </Animated.View>
      ) : verifying ? (
        <ActivityIndicator 
          size="small" 
          color={Theme.colors.primaryMedium} 
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.placeholderIcon} />
      )}
    </View>
  );
}

export default function VerificationScreen() {
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;
  const [documents, setDocuments] = useState([
    { label: 'Aadhar Card', verified: false, verifying: true },
    { label: 'PAN Card', verified: false, verifying: false },
    { label: 'Driving License', verified: false, verifying: false },
  ]);
  const [allVerified, setAllVerified] = useState(false);

  useEffect(() => {
    // Animate loading spinner
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let pollAttempts = 0;
    const MAX_POLL_ATTEMPTS = 8;

    const pollKyc = async () => {
      try {
        const res = await getKycStatus();
        if (cancelled) return;
        const docs = res.documents ?? [];
        if (docs.length === 0) {
          pollAttempts += 1;
          if (pollAttempts < MAX_POLL_ATTEMPTS) {
            pollTimer = setTimeout(pollKyc, 3000);
          } else {
            setAllVerified(true);
          }
          return;
        }
        setDocuments(
          docs.map((d: KycStatusItem) => ({
            label: d.label,
            verified: d.status === 'verified',
            verifying: d.status === 'pending',
          }))
        );
        const required = docs.filter((d) => d.required !== false);
        const scope = required.length ? required : docs;
        const allRequiredSubmitted = scope.every(
          (d) => d.status === 'verified' || d.status === 'pending' || d.status === 'failed'
        );
        const allDone = docs.every((d) => d.status === 'verified' || d.status === 'failed');
        if (allRequiredSubmitted || allDone) {
          setAllVerified(true);
        } else {
          pollAttempts += 1;
          if (pollAttempts < MAX_POLL_ATTEMPTS) {
            pollTimer = setTimeout(pollKyc, 3000);
          } else {
            setAllVerified(true);
          }
        }
      } catch {
        if (cancelled) return;
        pollAttempts += 1;
        if (pollAttempts < MAX_POLL_ATTEMPTS) {
          pollTimer = setTimeout(pollKyc, 5000);
        } else {
          setAllVerified(true);
        }
      }
    };

    pollKyc();
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleBack = () => {
    goBackOrReplace(router, '/kyc-upload');
  };

  const handleStartTraining = () => {
    if (allVerified) {
      // Navigate to training & kit screen
      router.push('/training-kit');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Verification"
          subtitle={allVerified ? "Documents Submitted" : "Submitting your documents"}
          onBack={handleBack}
        />

        {/* Main Content */}
        <View style={styles.content}>
          {allVerified ? (
            <View style={styles.centeredContentSuccess}>
              {/* Success Checkmark Icon */}
              <View style={styles.checkmarkContainer}>
                <View style={styles.checkmarkCircle}>
                  <CheckmarkIcon size={scale(42)} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text variant="loginTitle" color={Theme.colors.textDark} style={styles.title}>
                Submission Successful!
              </Text>

              {/* Subtitle */}
              <Text variant="loginSubtitle" color={Theme.colors.textGrey} style={styles.subtitle}>
                Your documents have been successfully submitted for review. You can proceed to training while we verify them.
              </Text>

              {/* Success Card */}
              <View style={styles.successCard}>
                {/* Checkmark Icon */}
                <View style={styles.successCardIcon}>
                  <View style={styles.successCardIconBackground}>
                    <CheckmarkSmallIcon size={scale(17.5)} color="#00A63E" />
                  </View>
                </View>

                {/* Text Content */}
                <View style={styles.successCardContent}>
                  <Text variant="loginInfo" color={Theme.colors.textDark} style={styles.successCardTitle}>
                    Documents Under Review
                  </Text>
                  <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.successCardSubtitle}>
                    Pending admin approval
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.centeredContent}>
              {/* Loading Spinner - Positioned at top of container */}
              <View style={styles.spinnerContainer}>
                {/* Outer glow circle (168x168, centered behind spinner) */}
                <View style={styles.glowCircle} />
                
                {/* Loading Spinner */}
                <Animated.View
                  style={[
                    styles.spinnerWrapper,
                    { transform: [{ rotate: spin }] },
                  ]}
                >
                  <LoadingSpinnerIcon size={scale(68.28)} color={Theme.colors.primaryMedium} />
                </Animated.View>
              </View>

              {/* Title */}
              <Text variant="loginTitle" color={Theme.colors.textDark} style={styles.title}>
                Submitting Details
              </Text>

              {/* Subtitle */}
              <Text variant="loginSubtitle" color={Theme.colors.textGrey} style={styles.subtitle}>
                Your documents are being submitted for review. This will just take a moment...
              </Text>

              {/* Document Status Cards */}
              <View style={styles.documentCardsContainer}>
                {documents.map((doc, index) => (
                  <DocumentCard
                    key={index}
                    label={doc.label}
                    verified={doc.verified}
                    verifying={doc.verifying}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Start Training"
            onPress={handleStartTraining}
            variant={allVerified ? "primary" : "secondary"}
            size="medium"
            disabled={!allVerified}
            icon={<ArrowRightIcon size={scale(14)} color={allVerified ? Theme.colors.white : Theme.colors.textLight} />}
            iconPosition="right"
            style={
              allVerified ? styles.startTrainingButtonEnabled : styles.startTrainingButton
            }
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
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(61), // Using scale(61) from success screen as base
    paddingTop: verticalScale(150), // Using verticalScale(150) from success screen as base
  },
  centeredContent: {
    width: scale(250), // Figma: width: 250
    alignItems: 'center',
    position: 'relative',
  },
  centeredContentSuccess: {
    width: scale(280), // Figma: width: 280
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: scale(84),
    height: scale(84),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(21), // Gap to title (105 - 84 = 21px)
  },
  checkmarkCircle: {
    width: scale(84),
    height: scale(84),
    borderRadius: scale(42),
    backgroundColor: Theme.colors.primaryMedium, // #237227
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow: 0px 8px 10px -6px rgba(35, 114, 39, 0.3), 0px 20px 25px -5px rgba(35, 114, 39, 0.3)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  spinnerContainer: {
    width: scale(84),
    height: scale(84),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: scale(168),
    height: scale(168),
    borderRadius: scale(84),
    backgroundColor: 'rgba(35, 114, 39, 0.2)', // Figma: rgba(35, 114, 39, 0.2)
    opacity: 0, // Figma shows opacity: 0
    top: scale(-42), // Center the 168px circle behind 84px spinner
    left: scale(-42),
  },
  spinnerWrapper: {
    width: scale(84),
    height: scale(84),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: scale(42),
    borderWidth: 4,
    borderColor: 'rgba(35, 114, 39, 0.1)', // Figma: rgba(35, 114, 39, 0.1)
    ...Theme.shadows.medium,
  },
  title: {
    marginTop: verticalScale(28), // Default for verification
    marginBottom: verticalScale(7), // Gap to subtitle (147 - 112 - 28 = 7px)
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(28), // Gap to document cards (217 - 147 - 42 = 28px)
    width: '100%',
  },
  documentCardsContainer: {
    width: '100%',
    gap: verticalScale(10.5), // Figma: gap: 10.5px
    marginTop: verticalScale(28), // Figma: y: 217 relative to container (217 - 147 - 42 = 28)
  },
  documentCard: {
    width: '100%',
    height: scale(44), // Approximate height based on padding
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6', // Exact Figma color
    borderRadius: scale(12.75), // Figma: 12.75px
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(10.5),
    paddingVertical: scale(13.25), // Calculated to center content
  },
  documentLabel: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    color: '#4A5565', // Exact Figma color
  },
  loadingIndicator: {
    width: scale(27.31),
    height: scale(27.31),
  },
  placeholderIcon: {
    width: scale(27.31),
    height: scale(27.31),
  },
  successCard: {
    width: '100%',
    height: scale(65),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#DCFCE7', // Exact Figma color
    borderRadius: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14), // Figma: gap: 14px
    paddingLeft: scale(14), // Figma: padding: 0px 0px 0px 14px
    paddingRight: scale(14),
    // Shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  successCardIcon: {
    width: scale(35),
    height: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCardIconBackground: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(17.5),
    backgroundColor: '#F0FDF4', // Exact Figma color
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCardContent: {
    flex: 1,
    gap: 0,
  },
  successCardTitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    fontWeight: '700',
    color: Theme.colors.textDark,
    marginBottom: scale(0),
  },
  successCardSubtitle: {
    fontSize: scale(10.5),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    fontWeight: '400',
    color: Theme.colors.textGrey,
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
  startTrainingButton: {
    backgroundColor: '#E5E7EB', // Exact Figma disabled button color
    opacity: 0.5, // Figma: opacity: 0.5
  },
  startTrainingButtonEnabled: {
    backgroundColor: Theme.colors.primaryMedium, // #237227
    opacity: 1,
    // Shadow: 0px 4px 6px -4px rgba(35, 114, 39, 0.2), 0px 10px 15px -3px rgba(35, 114, 39, 0.2)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

