import api from './apiConfig';

export const salonService = {
  // Create a new salon
  createSalon: async salonData => {
    const response = await api.post('/salons', salonData);
    return response.data;
  },

  // Get all salons
  getAllSalons: async () => {
    const response = await api.get('/salons');
    return response.data;
  },

  // Get nearby salons
  getNearBySalons: async (latitude: number, longitude: number, radius = 5) => {
    const response = await api.get(`/salons/nearby`, {
      params: {
        latitude,
        longitude,
        radius,
      },
    });
    return response.data;
  },

  // Get salon by ID
  getSalonById: async id => {
    const response = await api.get(`/salons/${id}`);
    return response.data;
  },

  // Update salon
  updateSalon: async (id, updateData) => {
    const response = await api.put(`/salons/${id}`, updateData);
    return response.data;
  },

  // Delete salon
  deleteSalon: async id => {
    const response = await api.delete(`/salons/${id}`);
    return response.data;
  },

  // Search salons
  searchSalons: async query => {
    const response = await api.get(
      `/salons/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
};
