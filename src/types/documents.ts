/**
 * Document Types
 * Type definitions for rider documents
 */

export type DocumentStatus = 'verified' | 'pending' | 'expired';

export interface RiderDocument {
  id: string;
  name: string;          // e.g. "Aadhar Card"
  status: DocumentStatus;
  updatedOn: string;     // human-readable date, e.g. "20 Nov 2024"
  fileName: string;      // e.g. "aadhar_card_front_back.pdf"
}

// Mock document data
export const DOCUMENTS: RiderDocument[] = [
  {
    id: '1',
    name: 'Aadhar Card',
    status: 'verified',
    updatedOn: '20 Nov 2024',
    fileName: 'aadhar_card_front_back.pdf',
  },
  {
    id: '2',
    name: 'PAN Card',
    status: 'verified',
    updatedOn: '20 Nov 2024',
    fileName: 'pan_card.jpg',
  },
  {
    id: '3',
    name: 'Driving License',
    status: 'verified',
    updatedOn: '20 Nov 2024',
    fileName: 'driving_license.pdf',
  },
  {
    id: '4',
    name: 'Vehicle RC',
    status: 'pending',
    updatedOn: 'Today',
    fileName: 'vehicle_rc.pdf',
  },
  {
    id: '5',
    name: 'Vehicle Insurance',
    status: 'expired',
    updatedOn: '10 Oct 2023',
    fileName: 'insurance_policy.pdf',
  },
];

// Get document counts by status
export const getDocumentCounts = (documents: RiderDocument[]) => {
  return {
    verified: documents.filter(d => d.status === 'verified').length,
    pending: documents.filter(d => d.status === 'pending').length,
    expired: documents.filter(d => d.status === 'expired').length,
  };
};

// Get documents by status
export const getDocumentsByStatus = (documents: RiderDocument[], status: DocumentStatus) => {
  return documents.filter(d => d.status === status);
};

