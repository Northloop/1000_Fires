
import { UserRole, Permission, Membership } from '../types';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.EVENT_ORGANIZER]: [
    'VIEW_DASHBOARD',
    'VIEW_CAMP_FINANCES',
    'MANAGE_CAMP_FINANCES',
    'MANAGE_CAMP_ROSTER',
    'EDIT_CAMP_DETAILS',
    'MANAGE_EVENT_BUDGET',
    'VIEW_VOLUNTEER_DATA'
  ],
  [UserRole.DEPARTMENT_LEAD]: [
    'VIEW_DASHBOARD',
    'VIEW_VOLUNTEER_DATA',
    'MANAGE_EVENT_BUDGET'
  ],
  [UserRole.CAMP_LEAD]: [
    'VIEW_DASHBOARD',
    'VIEW_CAMP_FINANCES',
    'MANAGE_CAMP_FINANCES',
    'MANAGE_CAMP_ROSTER',
    'EDIT_CAMP_DETAILS',
    'MANAGE_SUB_TEAMS'
  ],
  [UserRole.TEAM_LEAD]: [
    'VIEW_DASHBOARD',
    'VIEW_CAMP_FINANCES',
    'MANAGE_CAMP_ROSTER'
  ],
  [UserRole.VOLUNTEER]: [
    'VIEW_DASHBOARD'
  ],
  [UserRole.PARTICIPANT]: [
    'VIEW_DASHBOARD'
  ]
};

export const hasPermission = (membership: Membership | null, permission: Permission): boolean => {
  if (!membership || !membership.role) return false;
  return ROLE_PERMISSIONS[membership.role]?.includes(permission) || false;
};

export const canEditCamp = (membership: Membership | null): boolean => hasPermission(membership, 'EDIT_CAMP_DETAILS');
export const canManageFinances = (membership: Membership | null): boolean => hasPermission(membership, 'MANAGE_CAMP_FINANCES');
export const canViewFinances = (membership: Membership | null): boolean => hasPermission(membership, 'VIEW_CAMP_FINANCES');
