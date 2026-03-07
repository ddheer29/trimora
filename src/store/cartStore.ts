import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkvStorage';
import { Service, Stylist } from '../types';

export interface CartState {
  salonId: string | null;
  salonName: string | null;
  services: Service[];
  stylist: Stylist | null;
  bookingDate: string | null;
  startTime: string | null;
  serviceLocation: 'salon' | 'home';
  serviceAddress?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  paymentMethod: 'online' | 'cash';
  forSelf: boolean;
  guestName?: string;
  guestPhone?: string;

  // Actions
  setSalon: (salonId: string, salonName: string) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearCart: () => void;
  setStylist: (stylist: Stylist | null) => void;
  setBookingDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setServiceLocation: (location: 'salon' | 'home', address?: CartState['serviceAddress']) => void;
  setPaymentMethod: (method: 'online' | 'cash') => void;
  setBookingFor: (forSelf: boolean, guestName?: string, guestPhone?: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      salonId: null,
      salonName: null,
      services: [],
      stylist: null,
      bookingDate: null,
      startTime: null,
      serviceLocation: 'salon',
      paymentMethod: 'online',
      forSelf: true,

      setSalon: (salonId, salonName) => set({ salonId, salonName, services: [], stylist: null, bookingDate: null, startTime: null }),
      addService: (service) => set((state) => {
        if (state.services.find(s => s._id === service._id)) return state;
        return { services: [...state.services, service] };
      }),
      removeService: (serviceId) => set((state) => ({
        services: state.services.filter(s => s._id !== serviceId)
      })),
      clearCart: () => set({
        salonId: null,
        salonName: null,
        services: [],
        stylist: null,
        bookingDate: null,
        startTime: null,
        serviceLocation: 'salon',
        paymentMethod: 'online',
        forSelf: true,
        guestName: undefined,
        guestPhone: undefined,
        serviceAddress: undefined
      }),
      setStylist: (stylist) => set({ stylist }),
      setBookingDate: (bookingDate) => set({ bookingDate }),
      setStartTime: (startTime) => set({ startTime }),
      setServiceLocation: (serviceLocation, serviceAddress) => set({ serviceLocation, serviceAddress }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setBookingFor: (forSelf, guestName, guestPhone) => set({ forSelf, guestName, guestPhone }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
