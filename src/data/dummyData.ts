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
];
