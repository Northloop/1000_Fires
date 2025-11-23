import { UserRole, Permission, User } from '../types';

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
    'EDIT_CAMP_DETAILS'
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

export const hasPermission = (user: User, permission: Permission): boolean => {
  if (!user || !user.role) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
};

export const canEditCamp = (user: User): boolean => hasPermission(user, 'EDIT_CAMP_DETAILS');
export const canManageFinances = (user: User): boolean => hasPermission(user, 'MANAGE_CAMP_FINANCES');
export const canViewFinances = (user: User): boolean => hasPermission(user, 'VIEW_CAMP_FINANCES');