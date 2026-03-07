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

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
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
  partnerId: string;
  name: string;
  images: string[];
  locationName: string;
  location: GeoJSONPoint;
  rating: number;
  totalReviews: number;
  averagePrice: number;
  amenities: string[];
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  createdAt: string;
  updatedAt: string;
  distance?: number;
  __v?: number;
  id?: string;
}

export interface SalonApiResponse {
  status: string;
  data: {
    salon: Salon;
  };
}

export interface SalonsApiResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    salons: Salon[];
  };
}

export interface ServicesApiResponse {
  status: string;
  data: {
    services: Service[];
  };
}

export interface StylistsApiResponse {
  status: string;
  data: {
    stylists: Stylist[];
  };
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
