import api from './apiConfig';
import { SalonsApiResponse, SalonApiResponse } from '../types';

export const salonService = {
  // Get nearby salons
  getNearBySalons: async (latitude: number, longitude: number, maxDistance = 50000, page = 1, limit = 10): Promise<SalonsApiResponse> => {
    const response = await api.get('/customers/salons/nearby', {
      params: { latitude, longitude, maxDistance, page, limit },
    });
    return response.data;
  },

  // Get salons by service
  getSalonsByService: async (serviceName: string, latitude: number, longitude: number, page = 1, limit = 10): Promise<SalonsApiResponse> => {
    const response = await api.get('/customers/salons/services', {
      params: { serviceName, latitude, longitude, page, limit },
    });
    return response.data;
  },

  // Search salons
  searchSalons: async (keyword: string, page = 1, limit = 10): Promise<SalonsApiResponse> => {
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
  getSalonServices: async (salonId: string, page = 1, limit = 20) => {
    const response = await api.get(`/customers/salons/${salonId}/services`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get salon stylists
  getSalonStylists: async (salonId: string) => {
    const response = await api.get(`/customers/salons/${salonId}/stylists`);
    return response.data;
  },

  // Get available time slots
  getTimeSlots: async (salonId: string, stylistId: string, date: string, serviceId: string) => {
    const response = await api.get(`/customers/salons/${salonId}/stylists/${stylistId}/timeslots`, {
      params: { date, serviceId },
    });
    return response.data;
  },
};
