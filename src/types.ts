export type Booking = {
  id: string;
  customer: { id: string; name: string; avatarUrl?: string };
  serviceName: string;
  start: string; // ISO string
  end: string; // ISO string
  price?: number;
  description?: string;
};
