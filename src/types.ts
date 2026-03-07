export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface Booking {
  _id: string;
  id?: string;
  salonId: string | Salon;
  stylistId: string | Stylist;
  serviceId: string | Service;
  bookingDate: string;
  startTime: string;
  serviceLocation: 'salon' | 'home';
  serviceAddress?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  paymentMethod: 'online' | 'cash';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  forSelf: boolean;
  guestName?: string;
  guestPhone?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Service {
  _id: string;
  id?: string;
  category: string;
  subCategory: string;
  name: string;
  price: number;
  duration: number;
  gender: 'Male' | 'Female' | 'Unisex';
  description?: string;
  addons?: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
}

export interface Stylist {
  _id: string;
  id?: string;
  name: string;
  yearsOfExperience: number;
  profilePhoto?: string;
  stylistImage?: string; // API consistency
  rating?: number;
  isActive: boolean;
}

export interface Salon {
  _id: string;
  id?: string;
  name: string;
  locationName: string;
  location: Location;
  averagePrice: number;
  amenities: string[];
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  images: string[];
  rating: number;
  numberOfReviews: number;
  distance?: number; // Added for nearby search
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalonApiResponse {
  status: string;
  data: Salon;
}

export interface SalonsApiResponse {
  status: string;
  data: Salon[];
  pagination: Pagination;
}

export interface TransformedService {
  id: string;
  title: string;
  price: number;
  duration?: number;
  description?: string;
}

export interface ServicesData {
  [category: string]: TransformedService[];
}

export interface SalonDetailsScreenProps {
  route: {
    params: {
      salonId: string;
    };
  };
  navigation?: any;
}
