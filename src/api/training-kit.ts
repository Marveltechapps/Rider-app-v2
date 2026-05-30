import { apiRequest } from './client';

export interface KitItem {
  id: string;
  label: string;
  iconName: 'tshirt' | 'delivery_bag' | 'id_card' | 'other';
  isActive: boolean;
  order: number;
}

export interface KitConfig {
  title: string;
  description: string;
  items: KitItem[];
  isActive: boolean;
}

export interface TrainingVideo {
  _id: string;
  videoId: string;
  title: string;
  description?: string;
  duration: number;
  durationDisplay: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order: number;
  minimumWatchPercentage?: number;
  isActive: boolean;
}

/**
 * Fetch kit configuration from the backend (public endpoint, no auth needed)
 */
export async function getKitConfig(): Promise<KitConfig> {
  const res = await apiRequest<{ success: boolean; data: KitConfig }>(
    'GET',
    '/api/v1/rider/kit/config',
    undefined,
    true,
  );
  return res.data;
}

/**
 * Fetch active training videos (public endpoint, no auth needed)
 */
export async function getTrainingVideos(): Promise<TrainingVideo[]> {
  const res = await apiRequest<{ success: boolean; data: TrainingVideo[] }>(
    'GET',
    '/api/v1/rider/kit/training-videos',
    undefined,
    true,
  );
  return res.data;
}
