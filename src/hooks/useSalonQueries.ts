import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salonService } from '@/services/salonService';
import { queryKeys } from './queryKeys';

// ─── Customer: Salon Queries ──────────────────────────────────────────────────

export const useNearBySalons = (
  latitude: number,
  longitude: number,
  maxDistance = 50000,
  page = 1,
) =>
  useQuery({
    queryKey: queryKeys.salons.nearby(latitude, longitude, maxDistance, page),
    queryFn: () => salonService.getNearBySalons(latitude, longitude, maxDistance, page),
    enabled: !!latitude && !!longitude,
  });

export const useSalonsByService = (
  serviceName: string,
  latitude: number,
  longitude: number,
  page = 1,
) =>
  useQuery({
    queryKey: queryKeys.salons.byService(serviceName, latitude, longitude, page),
    queryFn: () =>
      salonService.getSalonsByService(serviceName, latitude, longitude, page),
    enabled: !!serviceName && !!latitude && !!longitude,
  });

export const useSearchSalons = (keyword: string, page = 1) =>
  useQuery({
    queryKey: queryKeys.salons.search(keyword, page),
    queryFn: () => salonService.searchSalons(keyword, page),
    enabled: keyword.trim().length > 0,
  });

export const useSalonById = (salonId: string) =>
  useQuery({
    queryKey: queryKeys.salons.byId(salonId),
    queryFn: () => salonService.getSalonById(salonId),
    enabled: !!salonId,
  });

export const useSalonServices = (salonId: string, page = 1, limit = 100) =>
  useQuery({
    queryKey: queryKeys.salons.services(salonId, page),
    queryFn: () => salonService.getSalonServices(salonId, page, limit),
    enabled: !!salonId,
  });

export const useSalonStylists = (salonId: string) =>
  useQuery({
    queryKey: queryKeys.salons.stylists(salonId),
    queryFn: () => salonService.getSalonStylists(salonId),
    enabled: !!salonId,
  });

export const useTimeSlots = (
  salonId: string,
  stylistId: string,
  date: string,
  serviceId: string,
) =>
  useQuery({
    queryKey: queryKeys.salons.timeSlots(salonId, stylistId, date, serviceId),
    queryFn: () => salonService.getTimeSlots(salonId, stylistId, date, serviceId),
    enabled: !!salonId && !!stylistId && !!date && !!serviceId,
    staleTime: 30_000, // Time slots change often — shorter stale time
  });

// ─── Partner: Salon Queries ───────────────────────────────────────────────────

export const usePartnerSalon = () =>
  useQuery({
    queryKey: queryKeys.partner.salon,
    queryFn: () => salonService.getPartnerSalon(),
  });

export const useSalonPreview = () =>
  useQuery({
    queryKey: queryKeys.partner.salonPreview,
    queryFn: () => salonService.getSalonPreview(),
  });

// ─── Partner: Stylists ────────────────────────────────────────────────────────

export const usePartnerStylists = () =>
  useQuery({
    queryKey: queryKeys.partner.stylists,
    queryFn: () => salonService.getPartnerStylists(),
  });

export const useCreateStylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => salonService.createStylist(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.stylists });
    },
  });
};

export const useUpdateStylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stylistId, formData }: { stylistId: string; formData: FormData }) =>
      salonService.updateStylist(stylistId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.stylists });
    },
  });
};

export const useDeleteStylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stylistId: string) => salonService.deleteStylist(stylistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.stylists });
    },
  });
};

// ─── Partner: Services ────────────────────────────────────────────────────────

export const usePartnerServices = () =>
  useQuery({
    queryKey: queryKeys.partner.services,
    queryFn: () => salonService.getPartnerServices(),
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceData: any) => salonService.createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.services });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, serviceData }: { serviceId: string; serviceData: any }) =>
      salonService.updateService(serviceId, serviceData),
    onSuccess: (_data, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.services });
      queryClient.invalidateQueries({ queryKey: ['partner', 'services', serviceId] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) => salonService.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.services });
    },
  });
};

// ─── Partner: Bookings ────────────────────────────────────────────────────────

export const usePartnerBookings = (page = 1, limit = 10) =>
  useQuery({
    queryKey: queryKeys.partner.bookings(page),
    queryFn: () => salonService.getPartnerBookings(page, limit),
  });

export const usePartnerBookingDetail = (bookingId: string) =>
  useQuery({
    queryKey: queryKeys.partner.bookingDetail(bookingId),
    queryFn: () => salonService.getBookingDetail(bookingId),
    enabled: !!bookingId,
  });

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: 'confirmed' | 'cancelled' | 'completed';
    }) => salonService.updateBookingStatus(bookingId, status),
    onSuccess: (_data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'bookings'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.partner.bookingDetail(bookingId),
      });
    },
  });
};

// ─── Partner: Dashboard ───────────────────────────────────────────────────────

export const useDashboard = (range: '7d' | '30d' = '7d') =>
  useQuery({
    queryKey: queryKeys.partner.dashboard(range),
    queryFn: () => salonService.getDashboardData(range),
    staleTime: 2 * 60_000, // Dashboard data changes less frequently
  });

export const useUpcomingBookings = () =>
  useQuery({
    queryKey: queryKeys.partner.upcomingBookings,
    queryFn: () => salonService.getUpcomingBookings(),
  });
