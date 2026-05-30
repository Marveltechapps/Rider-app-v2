/**
 * Profile Types
 * Type definitions for user profile
 */

export type Profile = {
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUri?: string | null;
};

export const INITIAL_PROFILE: Profile = {
  fullName: 'Rajesh Kumar',
  phoneNumber: '+91 8896556526',
  email: 'rajesh.kumar@quickrider.com',
  avatarUri: null,
};

