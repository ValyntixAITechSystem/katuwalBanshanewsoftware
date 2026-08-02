export const APP_NAME = 'Katuwal Bansha Batika';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'NDS Software';

export const RELATIONSHIP_TYPES = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'aunt_uncle', label: 'Aunt/Uncle' },
  { value: 'cousin', label: 'Cousin' },
  { value: 'other', label: 'Other' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const DONATION_PURPOSES = [
  { value: 'general', label: 'General' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];

export const DOCUMENT_TYPES = [
  { value: 'citizenship', label: 'Citizenship' },
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'marriage_certificate', label: 'Marriage Certificate' },
  { value: 'death_certificate', label: 'Death Certificate' },
  { value: 'migration_certificate', label: 'Migration Certificate' },
  { value: 'educational_certificate', label: 'Educational Certificate' },
  { value: 'passport', label: 'Passport' },
  { value: 'photo_album', label: 'Photo Album' },
  { value: 'other', label: 'Other' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'other', label: 'Other' },
];

export const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'unknown', label: 'Unknown' },
];

export const RELATION_OPTIONS = [
  { value: 'member', label: 'Member' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'other', label: 'Other' },
];

export const PAGINATION_OPTIONS = [10, 25, 50, 100];

export const CHAT_ROOMS = [
  { id: 'general', label: 'General' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'family_discussion', label: 'Family Discussion' },
  { id: 'events', label: 'Events' },
  { id: 'genealogy_help', label: 'Genealogy Help' },
];

export const NOTIFICATION_TYPES = {
  MEMBER_ADDED: 'member_added',
  MEMBER_UPDATED: 'member_updated',
  MEMBER_DELETED: 'member_deleted',
  DONATION_ADDED: 'donation_added',
  DOCUMENT_UPLOADED: 'document_uploaded',
  REPORT_GENERATED: 'report_generated',
  FAMILY_ADDED: 'family_added',
  FAMILY_UPDATED: 'family_updated',
  GENERAL: 'general',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';