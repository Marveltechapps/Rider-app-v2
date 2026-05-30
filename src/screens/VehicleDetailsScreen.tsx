/**
 * Vehicle Details Screen Component
 * Vehicle selection and registration screen matching Figma design
 * 
 * @component
 * @example
 * <VehicleDetailsScreen />
 */

import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import VehicleBikeIcon from '../components/icons/VehicleBikeIcon';
import VehicleCycleIcon from '../components/icons/VehicleCycleIcon';
import VehicleEVIcon from '../components/icons/VehicleEVIcon';
import VehicleScooterIcon from '../components/icons/VehicleScooterIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { useConfigWithDefaults } from '../contexts';
import { useUser } from '../contexts/UserContext';
import { updateRider } from '../api/rider';

type VehicleType = 'bike' | 'scooter' | 'ev' | 'cycle' | 'none';

interface VehicleOption {
  id: VehicleType;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  bike: VehicleBikeIcon,
  scooter: VehicleScooterIcon,
  ev: VehicleEVIcon,
  cycle: VehicleCycleIcon,
};

const DEFAULT_VEHICLES = ['Bike', 'Scooter', 'EV', 'Cycle'];

const FALLBACK_OPTIONS: VehicleOption[] = [
  { id: 'bike', label: 'Bike', icon: VehicleBikeIcon },
  { id: 'scooter', label: 'Scooter', icon: VehicleScooterIcon },
  { id: 'ev', label: 'EV', icon: VehicleEVIcon },
  { id: 'cycle', label: 'Cycle', icon: VehicleCycleIcon },
];

export default function VehicleDetailsScreen() {
  const config = useConfigWithDefaults();
  const { userData, updateUserData } = useUser();
  const vehicleTypes = config.vehicleTypes?.length ? config.vehicleTypes : DEFAULT_VEHICLES;
  const VEHICLE_OPTIONS: VehicleOption[] = (() => {
    const opts = vehicleTypes
      .map((v) => v.toLowerCase())
      .filter((id) => id in ICON_MAP)
      .map((id) => ({
        id: id as VehicleType,
        label: vehicleTypes.find((l) => l.toLowerCase() === id) || id,
        icon: ICON_MAP[id],
      }));
    return opts.length > 0 ? opts : FALLBACK_OPTIONS;
  })();
  const router = useRouter();
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/vehicle-details');
    })();
  }, []);

  // Vehicle number validation: uppercase letters, digits, spaces; length >= 6
  const isValidVehicleNumber = useMemo(() => {
    if (!vehicleNumber.trim()) return false;
    const pattern = /^[A-Z0-9\s]{6,}$/;
    return pattern.test(vehicleNumber.toUpperCase());
  }, [vehicleNumber]);

  // Check if continue button should be enabled
  const isContinueEnabled = useMemo(() => {
    if (isLoading) return false;
    if (!selectedVehicleType) return false;
    
    // For cycle or none, no vehicle number needed
    if (selectedVehicleType === 'cycle' || selectedVehicleType === 'none') {
      return true;
    }
    
    // For bike, scooter, ev, vehicle number is required and must be valid
    return isValidVehicleNumber;
  }, [selectedVehicleType, isValidVehicleNumber, isLoading]);

  // Check if vehicle number field should be visible
  const showVehicleNumberField = useMemo(() => {
    return selectedVehicleType === 'bike' || 
           selectedVehicleType === 'scooter' || 
           selectedVehicleType === 'ev';
  }, [selectedVehicleType]);

  const handleVehicleSelect = (type: VehicleType) => {
    setSelectedVehicleType(type);
    // Clear vehicle number when switching to cycle or none
    if (type === 'cycle' || type === 'none') {
      setVehicleNumber('');
    }
  };

  const handleVehicleNumberChange = (text: string) => {
    // Convert to uppercase and allow only alphanumeric and spaces
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    setVehicleNumber(cleaned);
  };

  const handleContinue = async () => {
    if (!isContinueEnabled || !userData.riderId) return;

    setIsLoading(true);
    try {
      const vType = selectedVehicleType || '';
      const vNumber = showVehicleNumberField ? vehicleNumber : '';

      // Update backend
      await updateRider(userData.riderId, {
        vehicle: {
          type: vType,
          registrationNumber: vNumber,
        },
      });

      // Update local context
      updateUserData({
        vehicleType: vType,
        vehicleNumber: vNumber,
      });

      // Navigate to Profile Photo screen
      router.push({
        pathname: '/profile-photo' as any,
        params: {
          vehicleType: vType,
          vehicleNumber: vNumber,
        },
      });
    } catch (error: any) {
      console.error('[VehicleDetailsScreen] Error updating profile:', error);
      Alert.alert('Error', 'Failed to update vehicle details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Vehicle Details"
          subtitle="Tell us about the vehicle you will use"
          onBack={handleBack}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Select Vehicle Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
              
              {/* 2x2 Grid - Exact Figma Layout */}
              <View style={styles.vehicleGridContainer}>
                {/* Row 1: Bike and Scooter */}
                <View style={styles.vehicleRow}>
                  {VEHICLE_OPTIONS.slice(0, 2).map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedVehicleType === option.id;
                    const isBike = option.id === 'bike';
                    
                    return (
                      <TouchableOpacity
                        key={option.id}
                        testID={`vehicle-${option.id}`}
                        accessibilityLabel={`Select ${option.label}`}
                        style={[
                          styles.vehicleCard,
                          isSelected && styles.vehicleCardSelected,
                          isBike && isSelected && styles.vehicleCardBikeSelected,
                        ]}
                        onPress={() => handleVehicleSelect(option.id)}
                        activeOpacity={0.7}
                      >
                        <IconComponent
                          size={scale(28)}
                          color={isSelected ? Theme.colors.primaryMedium : Theme.colors.textLight}
                        />
                        <Text
                          style={[styles.vehicleLabel, isSelected && styles.vehicleLabelSelected] as any}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                {/* Row 2: EV and Cycle */}
                <View style={styles.vehicleRow}>
                  {VEHICLE_OPTIONS.slice(2, 4).map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedVehicleType === option.id;
                    
                    return (
                      <TouchableOpacity
                        key={option.id}
                        testID={`vehicle-${option.id}`}
                        accessibilityLabel={`Select ${option.label}`}
                        style={[
                          styles.vehicleCard,
                          isSelected && styles.vehicleCardSelected,
                        ]}
                        onPress={() => handleVehicleSelect(option.id)}
                        activeOpacity={0.7}
                      >
                        <IconComponent
                          size={scale(28)}
                          color={isSelected ? Theme.colors.primaryMedium : Theme.colors.textLight}
                        />
                        <Text
                          style={[styles.vehicleLabel, isSelected && styles.vehicleLabelSelected] as any}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Vehicle Number Section - Conditional */}
            {showVehicleNumberField && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehicle Number</Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    testID="vehicle-number-input"
                    accessibilityLabel="Vehicle registration number input"
                    style={styles.input}
                    placeholder="KA 01 AB 1234"
                    placeholderTextColor="#717182"
                    value={vehicleNumber}
                    onChangeText={handleVehicleNumberChange}
                    autoCapitalize="characters"
                    maxLength={20}
                  />
                  {isValidVehicleNumber && (
                    <View style={styles.checkIconContainer}>
                      <CheckCircleIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
                    </View>
                  )}
                </View>
                
                <Text style={styles.helperText}>
                  Enter the registration number as on the number plate
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            testID="continue-button"
            accessibilityLabel="Continue button"
            style={[
              styles.continueButton,
              !isContinueEnabled && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isContinueEnabled}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <>
                <Text
                  variant="loginButton"
                  color={Theme.colors.white}
                  style={styles.continueButtonText}
                >
                  Continue
                </Text>
                <ArrowRightIcon size={scale(14)} color={Theme.colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight, // Exact Figma background
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(21),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
    gap: verticalScale(28),
  },
  section: {
    width: '100%',
    gap: scale(10.5), // Exact Figma gap for section
  },
  sectionTitle: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
  },
  vehicleGridContainer: {
    width: '100%',
    gap: 16, // 16px gap between rows
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 16, // 16px gap between cards
  },
  vehicleCard: {
    flex: 1, // Responsive width - takes equal space
    height: scale(84.5),
    backgroundColor: Theme.colors.white,
    borderWidth: 2,
    borderColor: Theme.colors.gray100,
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(7),
    paddingHorizontal: 16, // 16px horizontal padding
    paddingVertical: 16, // 16px vertical padding
  },
  vehicleCardSelected: {
    borderColor: Theme.colors.primaryMedium,
    borderWidth: 2,
    backgroundColor: Theme.colors.white,
  },
  vehicleCardBikeSelected: {
    backgroundColor: Theme.colors.infoBoxBg, // Exact Figma: rgba(50, 201, 106, 0.1)
  },
  vehicleLabel: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    color: Theme.colors.textLabel,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
    textAlign: 'center',
  },
  vehicleLabelSelected: {
    color: Theme.colors.primaryMedium,
  },
  inputContainer: {
    width: '100%',
    height: scale(56),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    paddingVertical: 0,
    textAlignVertical: 'center',
    alignSelf: 'stretch',
  },
  checkIconContainer: {
    position: 'absolute',
    right: scale(15.75),
    width: scale(17.5),
    height: scale(17.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray100,
    paddingHorizontal: 16,
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButton: {
    height: scale(44),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(7),
    ...Theme.shadows.buttonPrimary,
  },
  continueButtonDisabled: {
    backgroundColor: Theme.colors.gray200,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
    textAlign: 'center',
  },
});

