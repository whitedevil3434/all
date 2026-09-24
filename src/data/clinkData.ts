export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export const PARTICIPANTS: Participant[] = [
  {
    id: 'p1',
    name: 'Karim',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Local Supplier',
  },
  {
    id: 'p2',
    name: 'Rahim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Farmer / Supplier',
  },
  {
    id: 'p3',
    name: 'Mina',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Candidate Supplier',
  },
  {
    id: 'p4',
    name: 'Sabbir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Workspace Lead',
  },
];

export const TIMELINE_EVENTS = [
  {
    time: '09:12',
    title: 'Want created',
    subtitle: '50kg rice (office, tomorrow)',
    type: 'want',
  },
  {
    time: '09:24',
    title: 'Rahim offered 30kg',
    subtitle: 'Committed',
    type: 'commit',
  },
  {
    time: '10:19',
    title: 'Karim found',
    subtitle: 'Offered 20kg',
    type: 'offer',
  },
  {
    time: '10:25',
    title: 'Karim committed',
    subtitle: '20kg',
    type: 'commit',
  },
  {
    time: '11:05',
    title: 'Transport pending',
    subtitle: 'Waiting for driver',
    type: 'pending',
  },
];
