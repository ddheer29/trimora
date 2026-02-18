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
// types/salon.ts

// Location type
export interface Location {
  latitude: number;
  longitude: number;
}

// Contact type
export interface Contact {
  phone: string;
  email: string;
  website: string;
}

// Service type
export interface Service {
  id: string;
  title: string;
  price: string;
  duration: number;
  description: string;
  _id: string;
}

// Service Category type
export interface ServiceCategory {
  name: string;
  services: Service[];
  icon: string;
  isActive: boolean;
  _id: string;
}

// Stylist type
export interface Stylist {
  profilePhoto: string;
  name: string;
  rating: number;
  specialization: string[];
  experience: string;
  isActive: boolean;
  _id: string;
}

// Review type (if you have reviews in the future)
export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Main Salon type
export interface Salon {
  _id: string;
  name: string;
  images: string[];
  locationName: string;
  description: string;
  rating: number;
  numberOfReviews: number;
  averagePrice: string;
  location: Location;
  contact: Contact;
  serviceCategories: ServiceCategory[];
  stylists: Stylist[];
  amenities: string[];
  reviews: Review[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API Response type
export interface SalonApiResponse {
  success: boolean;
  data: Salon;
}

// Transformed Service Data for UI
export interface TransformedService {
  id: string;
  title: string;
  price: string;
  duration?: number;
  description?: string;
}

export interface ServicesData {
  [category: string]: TransformedService[];
}

// Props for the component
export interface SalonDetailsScreenProps {
  route: {
    params: {
      salonId: string;
    };
  };
  navigation?: any; // You can use proper navigation type from @react-navigation/native
}

// Props for render functions
export interface ImageCarouselItem {
  item: string;
  index: number;
}

export interface ServiceItemProps {
  item: TransformedService;
}

export interface StylistCardProps {
  stylist: Stylist;
}
