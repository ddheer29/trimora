import api from './apiConfig';
import {
  SalonsApiResponse,
  SalonApiResponse,
  ServicesApiResponse,
  StylistsApiResponse,
  BookingApiResponse,
  BookingsApiResponse,
} from '../types';

export const salonService = {
  // Get nearby salons
  getNearBySalons: async (
    latitude: number,
    longitude: number,
    maxDistance = 50000,
    page = 1,
    limit = 10,
  ): Promise<SalonsApiResponse> => {
    const response = await api.get('/customers/salons/nearby', {
      params: { latitude, longitude, maxDistance, page, limit },
    });
    return response.data;
  },

  // Get salons by service
  getSalonsByService: async (
    serviceName: string,
    latitude: number,
    longitude: number,
    page = 1,
    limit = 10,
  ): Promise<SalonsApiResponse> => {
    const response = await api.get('/customers/salons/services', {
      params: { serviceName, latitude, longitude, page, limit },
    });
    return response.data;
  },

  // Search salons
  searchSalons: async (
    keyword: string,
    page = 1,
    limit = 10,
  ): Promise<SalonsApiResponse> => {
    const response = await api.get('/customers/salons/search', {
      params: { keyword, page, limit },
    });
    return response.data;
  },

  // Get salon detail
  getSalonById: async (salonId: string): Promise<SalonApiResponse> => {
    const response = await api.get(`/customers/salons/${salonId}`);
    return response.data;
  },

  // Get salon services
  getSalonServices: async (
    salonId: string,
    page = 1,
    limit = 20,
  ): Promise<ServicesApiResponse> => {
    const response = await api.get(`/customers/salons/${salonId}/services`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get salon stylists
  getSalonStylists: async (salonId: string): Promise<StylistsApiResponse> => {
    const response = await api.get(`/customers/salons/${salonId}/stylists`);
    return response.data;
  },

  // Get available time slots
  getTimeSlots: async (
    salonId: string,
    stylistId: string,
    date: string,
    serviceId: string,
  ) => {
    const response = await api.get(
      `/customers/salons/${salonId}/stylists/${stylistId}/timeslots`,
      {
        params: { date, serviceId },
      },
    );
    return response.data;
  },

  // Get partner's salon (Partner)
  getPartnerSalon: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/partner/salon');
    return response.data;
  },

  // Create salon (Partner)
  createSalon: async (formData: FormData): Promise<ApiResponse<any>> => {
    console.log('🚀 -> formData:', formData);
    const response = await api.post('/partner/salon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('🚀 -> response:', response);
    return response.data;
  },

  // Update salon (Partner)
  updateSalon: async (formData: FormData): Promise<ApiResponse<any>> => {
    const response = await api.put('/partner/salon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Stylist APIs (Partner)
  getPartnerStylists: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/partner/stylists');
    return response.data;
  },

  createStylist: async (formData: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post('/partner/stylists', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStylist: async (
    stylistId: string,
    formData: FormData,
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/partner/stylists/${stylistId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteStylist: async (stylistId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/partner/stylists/${stylistId}`);
    return response.data;
  },

  // Service APIs (Partner)
  getPartnerServices: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/partner/services');
    return response.data;
  },

  createService: async (serviceData: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/partner/services', serviceData);
    return response.data;
  },

  updateService: async (
    serviceId: string,
    serviceData: any,
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(
      `/partner/services/${serviceId}`,
      serviceData,
    );
    return response.data;
  },

  deleteService: async (serviceId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/partner/services/${serviceId}`);
    return response.data;
  },

  // Create a new booking
  bookService: async (bookingData: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/customers/bookings', bookingData);
    return response.data;
  },

  // Partner Booking APIs
  getPartnerBookings: async (
    page = 1,
    limit = 10,
  ): Promise<BookingsApiResponse> => {
    const response = await api.get('/partner/bookings', {
      params: { page, limit },
    });
    return response.data;
  },

  getBookingDetail: async (bookingId: string): Promise<BookingApiResponse> => {
    const response = await api.get(`/partner/bookings/${bookingId}`);
    return response.data;
  },

  updateBookingStatus: async (
    bookingId: string,
    status: 'confirmed' | 'cancelled' | 'completed',
  ): Promise<BookingApiResponse> => {
    const response = await api.patch(`/partner/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  },
};

export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  data: T;
  message?: string;
}
