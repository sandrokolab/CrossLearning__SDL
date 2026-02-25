export enum ViewState {
  PORTAL_SELECTION = 'PORTAL_SELECTION',
  ONBOARDING_ROLE = 'ONBOARDING_ROLE',
  ONBOARDING_ACADEMY = 'ONBOARDING_ACADEMY',
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  LIVE_TUTOR = 'LIVE_TUTOR',
  CREATOR = 'CREATOR',
  ANALYTICS = 'ANALYTICS',
  MOBILE_APPS = 'MOBILE_APPS',
  SOCIAL = 'SOCIAL',
  ADMIN_PANEL = 'ADMIN_PANEL',
}

export enum UserRole {
  STUDENT = 'Student',
  EDUCATOR = 'Educator',
  CREATOR = 'Content Creator',
  ADMIN = 'Administrator',
}

export interface Academy {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  thumbnail: string;
  students: number;
  stages?: {
    autonomous: boolean;
    guided: boolean;
    practical: boolean;
    interaction: boolean;
  };
}

export interface AnalyticsData {
  name: string;
  value: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedContent {
  title: string;
  body: string;
  tags: string[];
  estimatedDuration?: string;
}