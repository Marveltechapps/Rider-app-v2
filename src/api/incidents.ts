/**
 * Incidents API – SOS and delivery issues
 */

import { api } from './client';

export type IncidentType =
  | 'accident'
  | 'customer_issue'
  | 'vehicle_breakdown'
  | 'safety_concern'
  | 'other';

export type IncidentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateIncidentRequest {
  type: IncidentType;
  description: string;
  location?: { lat: number; lng: number; address?: string };
  priority?: IncidentPriority;
}

export interface IncidentItem {
  _id: string;
  incidentNumber: string;
  type: IncidentType;
  description: string;
  status?: string;
  priority?: IncidentPriority;
  createdAt?: string;
}

export async function createIncident(body: CreateIncidentRequest): Promise<{ incident: IncidentItem }> {
  return api.post<{ incident: IncidentItem }>('/api/v1/incidents', body);
}

export async function listIncidents(limit = 20): Promise<{ incidents: IncidentItem[] }> {
  return api.get<{ incidents: IncidentItem[] }>(`/api/v1/incidents?limit=${limit}`);
}
