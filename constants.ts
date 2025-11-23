
import { Camp, EventItem, Shift, Task, User, UserRole, Transaction, Incident, Department, LNTTask, MapLayer, MapPin, CampMember, CampAsset, CampTeam } from "./types";

// Dynamic Context: Users now have memberships instead of a single static role
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Alice',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    memberships: [
      {
        id: 'm1', entityId: 'e1', entityName: 'MN Regional Burn', entityType: 'EVENT', role: UserRole.EVENT_ORGANIZER,
        permissions: ['VIEW_DASHBOARD', 'MANAGE_EVENT_BUDGET', 'VIEW_VOLUNTEER_DATA', 'ACCESS_SAFETY_DASHBOARD', 'MANAGE_MAP', 'MANAGE_ALL_EVENTS']
      }
    ]
  },
  {
    id: 'u3',
    name: 'Sparky',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sparky',
    memberships: [
      {
        id: 'm3_1', entityId: 'c1', entityName: 'Camp Entropy', entityType: 'CAMP', role: UserRole.CAMP_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_CAMP_FINANCES', 'MANAGE_CAMP_FINANCES', 'MANAGE_CAMP_ROSTER', 'EDIT_CAMP_DETAILS', 'MANAGE_SUB_TEAMS', 'MANAGE_OWN_EVENTS']
      },
      {
        id: 'm3_2', entityId: 'd1', entityName: 'Rangers', entityType: 'DEPARTMENT', role: UserRole.VOLUNTEER,
        permissions: ['VIEW_DASHBOARD', 'ACCESS_SAFETY_DASHBOARD']
      },
      {
        id: 'm3_3', entityId: 'e1', entityName: 'MN Regional Burn', entityType: 'EVENT', role: UserRole.PARTICIPANT,
        permissions: ['VIEW_DASHBOARD']
      }
    ]
  },
  {
    id: 'u2',
    name: 'Ranger Rick',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rick',
    memberships: [
      {
        id: 'm2', entityId: 'd1', entityName: 'Rangers', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  },
  {
    id: 'u_doc',
    name: 'Doc Holliday',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doc',
    memberships: [
      {
        id: 'm_doc', entityId: 'd3', entityName: 'ESD (Medical)', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  },
  {
    id: 'u_sage',
    name: 'Sage',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    memberships: [
      {
        id: 'm_sage', entityId: 'd8', entityName: 'Sanctuary', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  },
  {
    id: 'u_dusty',
    name: 'Dusty Roads',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty',
    memberships: [
      {
        id: 'm_dusty', entityId: 'd2', entityName: 'Gate & Perimeter', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS']
      }
    ]
  },
  {
    id: 'u_sledge',
    name: 'Sledge',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sledge',
    memberships: [
      {
        id: 'm_sledge', entityId: 'd4', entityName: 'Site Ops (DPW)', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  },
  {
    id: 'u_blaze',
    name: 'Blaze',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blaze',
    memberships: [
      {
        id: 'm_blaze', entityId: 'd5', entityName: 'FAST (Fire Safety)', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  },
  {
    id: 'u_gearhead',
    name: 'Gearhead',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gearhead',
    memberships: [
      {
        id: 'm_gearhead', entityId: 'd6', entityName: 'DMV (Mutant Vehicles)', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_DEPARTMENT_SHIFTS']
      }
    ]
  },
  {
    id: 'u_mapit',
    name: 'Mapper Mary',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mary',
    memberships: [
      {
        id: 'm_mapit', entityId: 'd7', entityName: 'Placement', entityType: 'DEPARTMENT', role: UserRole.DEPARTMENT_LEAD,
        permissions: ['VIEW_DASHBOARD', 'VIEW_VOLUNTEER_DATA', 'MANAGE_MAP', 'MANAGE_DEPARTMENT_SHIFTS']
      }
    ]
  },
  {
    id: 'u_medic_mike',
    name: 'Medic Mike',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    memberships: [
      {
        id: 'm_medic_1', entityId: 'e1', entityName: 'MN Regional Burn', entityType: 'EVENT', role: UserRole.PARTICIPANT,
        permissions: ['VIEW_DASHBOARD']
      },
      {
        id: 'm_medic_2', entityId: 'd3', entityName: 'ESD (Medical)', entityType: 'DEPARTMENT', role: UserRole.VOLUNTEER,
        permissions: ['VIEW_DASHBOARD', 'ACCESS_SAFETY_DASHBOARD']
      }
    ]
  }
];

export const MOCK_CAMPS: Camp[] = [
  { id: 'c1', name: 'Camp Entropy', description: 'Serving chaos and coffee daily.', location: '4:30 & B', members: 45, budgetSpent: 3500, budgetTotal: 5000, moopScore: 85 },
  { id: 'c2', name: 'Bass Haven', description: 'Low frequencies, high spirits.', location: '10:00 & Inner Circle', members: 120, budgetSpent: 12000, budgetTotal: 15000, moopScore: 92 },
  { id: 'c3', name: 'The Library', description: 'Shhh. Just kidding, we have karaoke.', location: '3:00 & C', members: 20, budgetSpent: 800, budgetTotal: 2000, moopScore: 60 },
];

export const MOCK_CAMP_TEAMS: CampTeam[] = [
  { id: 'ct1', campId: 'c1', name: 'Kitchen Krew', description: 'Feeding the masses.', leadId: 'm2', memberCount: 12, nextMeeting: 'Tue 10am' },
  { id: 'ct2', campId: 'c1', name: 'Build Team', description: 'Structure and shade.', leadId: 'm3', memberCount: 8, nextMeeting: 'Mon 9am' },
  { id: 'ct3', campId: 'c1', name: 'Strike Team', description: 'LNT and Tear down.', leadId: 'm4', memberCount: 15 },
  { id: 'ct4', campId: 'c1', name: 'Vibe Maintenance', description: 'Decor and lighting.', leadId: 'm1', memberCount: 4 },
];

export const MOCK_CAMP_MEMBERS: CampMember[] = [
  { id: 'm1', name: 'Alex "Sparky" Miller', role: 'LEAD', campTeam: 'GENERAL', assignedTeamIds: ['ct2', 'ct4'], status: 'ARRIVED', email: 'sparky@example.com' },
  { id: 'm2', name: 'Sarah Jenkins', role: 'MEMBER', campTeam: 'KITCHEN', assignedTeamIds: ['ct1'], status: 'ARRIVED', email: 'sarah@example.com' },
  { id: 'm3', name: 'Mike Ross', role: 'MEMBER', campTeam: 'BUILD', assignedTeamIds: ['ct2'], status: 'CONFIRMED', email: 'mike@example.com' },
  { id: 'm4', name: 'Jessica Pearson', role: 'MEMBER', campTeam: 'STRIKE', assignedTeamIds: ['ct3'], status: 'PENDING', email: 'jessica@example.com' },
  { id: 'm5', name: 'Louis Litt', role: 'NEWBIE', campTeam: 'GENERAL', assignedTeamIds: ['ct1'], status: 'CONFIRMED', email: 'louis@example.com' },
];

export const MOCK_CAMP_ASSETS: CampAsset[] = [
  { id: 'a1', name: 'Honda 2000i Generator', category: 'POWER', condition: 'GOOD', value: 1200, assignedTo: 'Mike Ross' },
  { id: 'a2', name: 'Shade Structure (30x30)', category: 'INFRASTRUCTURE', condition: 'GOOD', value: 2500 },
  { id: 'a3', name: 'Propane Stove (3-Burner)', category: 'KITCHEN', condition: 'DAMAGED', value: 150, assignedTo: 'Sarah Jenkins' },
  { id: 'a4', name: 'JBL Sound System', category: 'SOUND', condition: 'GOOD', value: 800 },
];

export const MOCK_EVENTS: EventItem[] = [
  { id: 'e1', title: 'Sunset Yoga', description: 'Beginner friendly yoga session to welcome the night.', host: 'Camp Serenity', campId: 'c99', startTime: '2026-10-02T18:00:00', endTime: '2026-10-02T19:00:00', location: 'Temple Grounds', type: 'WORKSHOP' },
  { id: 'e2', title: 'Midnight Poutine', description: 'Bring your own bowl!', host: 'Camp Maple', campId: 'c98', startTime: '2026-10-02T23:59:00', endTime: '2026-10-03T02:00:00', location: '4:30 & B', type: 'FOOD' },
  { id: 'e3', title: 'Bass Drop Ritual', description: 'High fidelity low frequency worship.', host: 'Bass Haven', campId: 'c2', startTime: '2026-10-03T01:00:00', endTime: '2026-10-03T04:00:00', location: '10:00 & Inner Circle', type: 'MUSIC' },
  { id: 'e4', title: 'Fire Spinning 101', description: 'Learn the basics of poi and staff.', host: 'Pyro Guild', campId: 'c97', startTime: '2026-10-03T20:00:00', endTime: '2026-10-03T21:30:00', location: 'Center Village', type: 'PERFORMANCE' },
  { id: 'e5', title: 'Camp Entropy Happy Hour', description: 'Chaos and cocktails.', host: 'Camp Entropy', campId: 'c1', startTime: '2026-10-03T16:00:00', endTime: '2026-10-03T18:00:00', location: '4:30 & B', type: 'FOOD' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Secure Generator Rental', assignee: 'Sparky', status: 'DONE', priority: 'HIGH', teamId: 'ct2' },
  { id: 't2', title: 'Menu Planning - Tuesday Dinner', assignee: 'Chef Mike', status: 'IN_PROGRESS', priority: 'MEDIUM', teamId: 'ct1' },
  { id: 't3', title: 'MOOP Sweep Schedule', assignee: 'Unassigned', status: 'TODO', priority: 'HIGH', teamId: 'ct3' },
  { id: 't4', title: 'Decorate Frontage', assignee: 'Art Team', status: 'TODO', priority: 'LOW', teamId: 'ct4' },
];

export const MOCK_SHIFTS: Shift[] = [
  { id: 's1', departmentId: 'd1', role: 'Ranger (Shift Lead)', time: 'Wed 12:00 PM - 4:00 PM', filled: true, volunteerName: 'Sarah', requiredSkills: ['Conflict Resolution'] },
  { id: 's2', departmentId: 'd1', role: 'Ranger (Patrol)', time: 'Thu 09:00 AM - 12:00 PM', filled: false, requiredSkills: ['CPR'] },
  { id: 's3', departmentId: 'd2', role: 'Gate Perimeter', time: 'Thu 08:00 PM - 12:00 AM', filled: true, volunteerName: 'Dave' },
  { id: 's4', departmentId: 'd3', role: 'Medical Triage', time: 'Sat 08:00 PM - 12:00 AM', filled: true, volunteerName: 'Medic Mike', requiredSkills: ['EMT'] },
  { id: 's5', departmentId: 'd1', role: 'Ranger (Patrol)', time: 'Fri 02:00 PM - 06:00 PM', filled: false, requiredSkills: ['CPR'] },
  { id: 's6', departmentId: 'd2', role: 'Greeter', time: 'Wed 10:00 AM - 02:00 PM', filled: false },
  { id: 's7', departmentId: 'd4', role: 'Power Grid Check', time: 'Thu 01:00 PM - 04:00 PM', filled: true, volunteerName: 'Sledge' },
  { id: 's8', departmentId: 'd3', role: 'Hydration Station', time: 'Sat 02:00 PM - 06:00 PM', filled: true, volunteerName: 'Medic Mike' },
  // FAST Shifts
  { id: 's9', departmentId: 'd5', role: 'Effigy Perimeter', time: 'Sat 09:00 PM - 12:00 AM', filled: false, requiredSkills: ['Flame Safety'] },
  { id: 's10', departmentId: 'd5', role: 'Flame Effect Inspection', time: 'Thu 02:00 PM - 06:00 PM', filled: true, volunteerName: 'Blaze' },
  // DMV Shifts
  { id: 's11', departmentId: 'd6', role: 'Vehicle Inspector', time: 'Wed 10:00 AM - 02:00 PM', filled: true, volunteerName: 'Gearhead' },
  { id: 's12', departmentId: 'd6', role: 'Line Management', time: 'Wed 10:00 AM - 02:00 PM', filled: false },
  // Sanctuary Shifts
  { id: 's13', departmentId: 'd8', role: 'Sitter', time: 'Fri 10:00 PM - 02:00 AM', filled: false, requiredSkills: ['Green Dot Training'] },
  { id: 's14', departmentId: 'd8', role: 'Shift Lead', time: 'Fri 10:00 PM - 02:00 AM', filled: true, volunteerName: 'Sage' },
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
  { 
    id: 'd1', name: 'Event Rangers', type: 'RANGERS', lead: 'Ranger Rick', volunteerCount: 450, shiftFillRate: 85, icon: 'Shield',
    stats: [
        { label: 'Active Patrols', value: '12', status: 'good' },
        { label: 'Open Incidents', value: '3', status: 'warning' }
    ]
  },
  { 
    id: 'd2', name: 'Gate & Perimeter', type: 'GATE', lead: 'Dusty Roads', volunteerCount: 300, shiftFillRate: 92, icon: 'DoorOpen',
    stats: [
        { label: 'Vehicles / Hr', value: '142', status: 'good' },
        { label: 'Wait Time', value: '45m', status: 'warning' },
        { label: 'Lane 1 Status', value: 'OPEN', status: 'good' }
    ]
  },
  { 
    id: 'd3', name: 'ESD (Medical)', type: 'MEDICAL', lead: 'Doc Holliday', volunteerCount: 150, shiftFillRate: 78, icon: 'HeartPulse',
    stats: [
        { label: 'Bed Capacity', value: '4/12', status: 'good' },
        { label: 'Triage Queue', value: '0', status: 'good' },
        { label: 'Critical Supply', value: 'O2', status: 'critical' }
    ]
  },
  { 
    id: 'd4', name: 'Site Ops (DPW)', type: 'LOGISTICS', lead: 'Sledge', volunteerCount: 600, shiftFillRate: 98, icon: 'Hammer',
    stats: [
        { label: 'Fuel Level', value: '68%', status: 'warning' },
        { label: 'Grid Load', value: '82%', status: 'good' },
        { label: 'Work Tickets', value: '15', status: 'critical' }
    ]
  },
  { 
    id: 'd5', name: 'FAST (Fire Safety)', type: 'FIRE', lead: 'Blaze', volunteerCount: 80, shiftFillRate: 95, icon: 'Flame',
    stats: [
        { label: 'Inspections', value: '42/50', status: 'good' },
        { label: 'Perimeter', value: 'SECURE', status: 'good' },
        { label: 'Red Tags', value: '2', status: 'warning' }
    ]
  },
  { 
    id: 'd6', name: 'DMV (Mutant Vehicles)', type: 'DMV', lead: 'Gearhead', volunteerCount: 60, shiftFillRate: 88, icon: 'Truck',
    stats: [
        { label: 'Day Licenses', value: '125', status: 'good' },
        { label: 'Night Licenses', value: '84', status: 'good' },
        { label: 'Inspection Q', value: '5', status: 'warning' }
    ]
  },
  { 
    id: 'd7', name: 'Placement', type: 'PLACEMENT', lead: 'Mapper Mary', volunteerCount: 40, shiftFillRate: 100, icon: 'Map',
    stats: [
        { label: 'Camps Placed', value: '100%', status: 'good' },
        { label: 'Disputes', value: '1', status: 'warning' },
        { label: 'Land Grabs', value: '0', status: 'good' }
    ]
  },
  { 
    id: 'd8', name: 'Sanctuary', type: 'SANCTUARY', lead: 'Sage', volunteerCount: 120, shiftFillRate: 82, icon: 'Moon',
    stats: [
        { label: 'Capacity', value: '3/20', status: 'good' },
        { label: 'Sitters', value: '8', status: 'good' },
        { label: 'Intake', value: 'OPEN', status: 'good' }
    ]
  }
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
  { id: 'p1', type: 'camp', x: 30, y: 40, lat: 44.9778, lng: -93.2650, name: 'Camp Entropy', description: 'Sector 4, serving chaos', campId: 'c1' },
  { id: 'p2', type: 'art', x: 50, y: 50, lat: 44.9780, lng: -93.2660, name: 'The Effigy', description: 'Main Field' },
  { id: 'p3', type: 'medical', x: 20, y: 80, lat: 44.9750, lng: -93.2700, name: 'Ranger Station 3', description: 'South Road' },
  { id: 'p4', type: 'camp', x: 70, y: 30, lat: 44.9800, lng: -93.2600, name: 'Bass Haven', description: 'Deep Woods', campId: 'c2' },
  { id: 'p5', type: 'art', x: 80, y: 60, lat: 44.9790, lng: -93.2550, name: 'Temple of Atonement', description: 'North Field' },
];
