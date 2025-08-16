import { Booking } from '../types';

export const dummyBookings: Booking[] = [
  {
    id: '1',
    customer: {
      id: 'c1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/50?img=1',
    },
    serviceName: 'Haircut',
    start: '2025-08-08T10:00:00',
    end: '2025-08-08T11:00:00',
    price: 500,
    description: 'Basic haircut service',
    color: '#3b82f6',
  },
  {
    id: '2',
    customer: {
      id: 'c2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/50?img=2',
    },
    serviceName: 'Meeting',
    start: '2025-08-08T11:15:00',
    end: '2025-08-08T11:45:00',
    price: 0,
    description: 'Project discussion',
    color: '#22c55e',
  },
  {
    id: '3',
    customer: {
      id: 'c3',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/50?img=3',
    },
    serviceName: 'Spa Session',
    start: '2025-08-08T13:22:00',
    end: '2025-08-08T16:47:00',
    price: 1500,
    description: 'Relaxing spa and massage session',
    color: '#f59e0b',
  },
  // ---------------- Next Day Bookings ----------------
  {
    id: '4',
    customer: {
      id: 'c4',
      name: 'Emily Brown',
      avatar: 'https://i.pravatar.cc/50?img=4',
    },
    serviceName: 'Manicure',
    start: '2025-08-09T09:30:00',
    end: '2025-08-09T10:15:00',
    price: 700,
    description: 'Nail care and polish',
    color: '#ec4899',
  },
  {
    id: '5',
    customer: {
      id: 'c5',
      name: 'Michael Lee',
      avatar: 'https://i.pravatar.cc/50?img=5',
    },
    serviceName: 'Hair Coloring',
    start: '2025-08-09T11:00:00',
    end: '2025-08-09T13:00:00',
    price: 2000,
    description: 'Full hair coloring session',
    color: '#8b5cf6',
  },
  {
    id: '6',
    customer: {
      id: 'c6',
      name: 'Sophia Davis',
      avatar: 'https://i.pravatar.cc/50?img=6',
    },
    serviceName: 'Yoga Class',
    start: '2025-08-09T15:00:00',
    end: '2025-08-09T16:00:00',
    price: 300,
    description: 'Group yoga session',
    color: '#10b981',
  },
];
