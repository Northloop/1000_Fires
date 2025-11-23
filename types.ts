
export enum UserRole {
  EVENT_ORGANIZER = 'EVENT_ORGANIZER',
  DEPARTMENT_LEAD = 'DEPARTMENT_LEAD',
  CAMP_LEAD = 'CAMP_LEAD',
  TEAM_LEAD = 'TEAM_LEAD',
  VOLUNTEER = 'VOLUNTEER',
  PARTICIPANT = 'PARTICIPANT'
}

export type EntityType = 'EVENT' | 'CAMP' | 'DEPARTMENT';

export interface Membership {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  role: UserRole;
  permissions: Permission[];
}

export type Permission = 
  | 'VIEW_DASHBOARD'
  | 'VIEW_CAMP_FINANCES'
  | 'MANAGE_CAMP_FINANCES'
  | 'MANAGE_CAMP_ROSTER'
  | 'EDIT_CAMP_DETAILS'
  | 'MANAGE_EVENT_BUDGET'
  | 'VIEW_VOLUNTEER_DATA'
  | 'ACCESS_SAFETY_DASHBOARD'
  | 'MANAGE_DEPARTMENT_SHIFTS'
  | 'MANAGE_SUB_TEAMS';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  memberships: Membership[];
}

export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  members: number;
  budgetSpent: number;
  budgetTotal: number;
  moopScore?: number; // 1-100 (100 is perfect)
}

export interface CampTeam {
  id: string;
  name: string;
  campId: string;
  description: string;
  leadId: string; // Member ID
  memberCount: number;
  nextMeeting?: string;
}

export interface CampMember {
  id: string;
  name: string;
  role: 'LEAD' | 'MEMBER' | 'NEWBIE';
  campTeam: 'BUILD' | 'KITCHEN' | 'STRIKE' | 'GENERAL'; // Deprecated in favor of CampTeam relation, kept for backward compat
  status: 'CONFIRMED' | 'ARRIVED' | 'PENDING';
  email: string;
  assignedTeamIds: string[]; // New: One member can be on multiple sub-teams
}

export interface CampAsset {
  id: string;
  name: string;
  category: 'INFRASTRUCTURE' | 'KITCHEN' | 'POWER' | 'SOUND';
  condition: 'GOOD' | 'DAMAGED' | 'MISSING';
  assignedTo?: string; // Member Name
  value: number;
}

export interface EventItem {
  id: string;
  title: string;
  host: string;
  startTime: string; // ISO string
  location: string;
  type: 'MUSIC' | 'WORKSHOP' | 'FOOD' | 'PERFORMANCE';
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  teamId?: string; // Linked to specific sub-team
}

export interface Shift {
  id: string;
  departmentId: string;
  role: string;
  time: string;
  filled: boolean;
  volunteerName?: string;
  requiredSkills?: string[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'DUES' | 'EXPENSE' | 'TICKET' | 'REFUND';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  requestedBy: string;
}

export interface Incident {
  id: string;
  type: 'MEDICAL' | 'FIRE' | 'CONFLICT' | 'LOST_CHILD' | 'MOOP';
  status: 'OPEN' | 'DISPATCHED' | 'RESOLVED';
  location: string;
  description: string;
  reportedAt: string;
  reporter: string;
}

export interface Department {
  id: string;
  name: string;
  lead: string;
  volunteerCount: number;
  shiftFillRate: number;
  icon: string; // Lucide icon name
}

export interface LNTTask {
  id: string;
  area: string;
  status: 'CLEAN' | 'DIRTY' | 'IN_PROGRESS';
  assignedTo?: string;
}

// Map Builder Types
export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'SATELLITE' | 'TERRAIN' | 'CUSTOM' | 'VECTOR';
  opacity: number;
  url?: string; // For custom overlays or tile servers
}

export interface MapOverlay {
  id: string;
  name: string;
  imageUrl: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  rotation: number;
}

export interface MapPin {
  id: number;
  type: 'camp' | 'art' | 'medical' | 'infra';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  name: string;
  desc: string;
}
