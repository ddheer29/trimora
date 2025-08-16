export type Booking = {
  id: string;
  customer: { id: string; name: string; avatar?: string };
  serviceName: string;
  start: string; // ISO string
  end: string; // ISO string
  price?: number;
  description?: string;
  color?: string;
};
