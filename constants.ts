
import { Camp, EventItem, Shift, Task, User, UserRole, Transaction, Incident, Department, LNTTask, MapLayer, MapPin } from "./types";

// Removed hardcoded CURRENT_USER in favor of dynamic context

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Alice',
    role: UserRole.EVENT_ORGANIZER,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: 'u2',
    name: 'Ranger Rick',
    role: UserRole.DEPARTMENT_LEAD,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rick',
  },
  {
    id: 'u3',
    name: 'Sparky',
    role: UserRole.CAMP_LEAD,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sparky',
  },
  {
    id: 'u4',
    name: 'Volunteer Val',
    role: UserRole.VOLUNTEER,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Val',
  },
  {
    id: 'u5',
    name: 'Newbie Ned',
    role: UserRole.PARTICIPANT,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ned',
  }
];

export const MOCK_CAMPS: Camp[] = [
  { id: 'c1', name: 'Camp Entropy', description: 'Serving chaos and coffee daily.', location: '4:30 & B', members: 45, budgetSpent: 3500, budgetTotal: 5000, moopScore: 85 },
  { id: 'c2', name: 'Bass Haven', description: 'Low frequencies, high spirits.', location: '10:00 & Inner Circle', members: 120, budgetSpent: 12000, budgetTotal: 15000, moopScore: 92 },
  { id: 'c3', name: 'The Library', description: 'Shhh. Just kidding, we have karaoke.', location: '3:00 & C', members: 20, budgetSpent: 800, budgetTotal: 2000, moopScore: 60 },
];

export const MOCK_EVENTS: EventItem[] = [
  { id: 'e1', title: 'Sunset Yoga', host: 'Camp Serenity', startTime: '2026-10-02T18:00:00', location: 'Temple Grounds', type: 'WORKSHOP' },
  { id: 'e2', title: 'Midnight Poutine', host: 'Camp Maple', startTime: '2026-10-02T23:59:00', location: '4:30 & B', type: 'FOOD' },
  { id: 'e3', title: 'Bass Drop Ritual', host: 'Bass Haven', startTime: '2026-10-03T01:00:00', location: '10:00 & Inner Circle', type: 'MUSIC' },
  { id: 'e4', title: 'Fire Spinning 101', host: 'Pyro Guild', startTime: '2026-10-03T20:00:00', location: 'Center Village', type: 'PERFORMANCE' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Secure Generator Rental', assignee: 'Sparky', status: 'DONE', priority: 'HIGH' },
  { id: 't2', title: 'Menu Planning - Tuesday Dinner', assignee: 'Chef Mike', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: 't3', title: 'MOOP Sweep Schedule', assignee: 'Unassigned', status: 'TODO', priority: 'HIGH' },
  { id: 't4', title: 'Decorate Frontage', assignee: 'Art Team', status: 'TODO', priority: 'LOW' },
];

export const MOCK_SHIFTS: Shift[] = [
  { id: 's1', departmentId: 'd1', role: 'Ranger (Shift Lead)', time: 'Wed 12:00 PM - 4:00 PM', filled: true, volunteerName: 'Sarah', requiredSkills: ['Conflict Resolution'] },
  { id: 's2', departmentId: 'd1', role: 'Ranger (Patrol)', time: 'Thu 09:00 AM - 12:00 PM', filled: false, requiredSkills: ['CPR'] },
  { id: 's3', departmentId: 'd2', role: 'Gate Perimeter', time: 'Thu 08:00 PM - 12:00 AM', filled: true, volunteerName: 'Dave' },
  { id: 's4', departmentId: 'd3', role: 'Medical Triage', time: 'Sat 08:00 PM - 12:00 AM', filled: false, requiredSkills: ['EMT'] },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2026-09-15T10:00:00', amount: 500.00, description: 'Generator Deposit', type: 'EXPENSE', status: 'COMPLETED', requestedBy: 'Sparky' },
  { id: 't2', date: '2026-09-16T14:30:00', amount: 250.00, description: 'Camp Dues - Sarah J.', type: 'DUES', status: 'COMPLETED', requestedBy: 'Sarah J.' },
  { id: 't3', date: '2026-09-18T09:15:00', amount: 1200.00, description: 'Art Grant - First Installment', type: 'REFUND', status: 'COMPLETED', requestedBy: 'Placement Team' },
  { id: 't4', date: '2026-09-20T16:45:00', amount: 75.50, description: 'Kitchen Supplies', type: 'EXPENSE', status: 'PENDING', requestedBy: 'Chef Mike' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', type: 'MEDICAL', status: 'DISPATCHED', location: '3:00 & C', description: 'Participant dehydration, conscious.', reportedAt: '2026-10-02T14:20:00', reporter: 'Ranger Bob' },
  { id: 'i2', type: 'MOOP', status: 'OPEN', location: 'Deep Field Art #42', description: 'Abandoned bicycle pile.', reportedAt: '2026-10-02T10:00:00', reporter: 'LNT Lead' },
  { id: 'i3', type: 'CONFLICT', status: 'RESOLVED', location: 'Camp Entropy', description: 'Noise complaint dispute.', reportedAt: '2026-10-01T23:45:00', reporter: 'Sparky' }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Event Rangers', lead: 'Top Hat', volunteerCount: 450, shiftFillRate: 85, icon: 'Shield' },
  { id: 'd2', name: 'Gate & Perimeter', lead: 'Dusty', volunteerCount: 300, shiftFillRate: 92, icon: 'DoorOpen' },
  { id: 'd3', name: 'ESD (Medical)', lead: 'Doc', volunteerCount: 150, shiftFillRate: 78, icon: 'HeartPulse' },
  { id: 'd4', name: 'Site Ops', lead: 'Sledge', volunteerCount: 600, shiftFillRate: 98, icon: 'Hammer' },
];

export const MOCK_LNT_TASKS: LNTTask[] = [
  { id: 'l1', area: 'Kitchen Greywater', status: 'CLEAN', assignedTo: 'Kitchen Crew' },
  { id: 'l2', area: 'Frontage / Street', status: 'DIRTY', assignedTo: 'Unassigned' },
  { id: 'l3', area: 'Chill Dome', status: 'IN_PROGRESS', assignedTo: 'Sarah' },
  { id: 'l4', area: 'Bike Racks', status: 'CLEAN' },
];

export const MOCK_MAP_LAYERS: MapLayer[] = [
  { id: 'l1', name: 'Satellite Base', visible: true, type: 'SATELLITE', opacity: 1 },
  { id: 'l2', name: 'Roads & Infrastructure', visible: true, type: 'VECTOR', opacity: 0.8 },
  { id: 'l3', name: 'Tree Canopy Overlay', visible: false, type: 'CUSTOM', opacity: 0.6 },
  { id: 'l4', name: 'Camping Zones', visible: true, type: 'VECTOR', opacity: 0.5 },
];

export const MOCK_MAP_PINS: MapPin[] = [
  { id: 1, type: 'camp', x: 30, y: 40, name: 'Camp Entropy', desc: 'Sector 4' },
  { id: 2, type: 'art', x: 50, y: 50, name: 'The Effigy', desc: 'Main Field' },
  { id: 3, type: 'medical', x: 20, y: 80, name: 'Ranger Station 3', desc: 'South Road' },
  { id: 4, type: 'camp', x: 70, y: 30, name: 'Bass Haven', desc: 'Deep Woods' },
  { id: 5, type: 'art', x: 80, y: 60, name: 'Temple of Atonement', desc: 'North Field' },
];
