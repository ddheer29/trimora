import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import theme from '../../utils/Theme';
import { Calendar } from 'react-native-calendars';
import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
import { salonService } from '@/services/salonService';
import { CustomerBooking } from '@/types';

interface RescheduleModalProps {
  visible: boolean;
  booking: CustomerBooking | null;
  onClose: () => void;
  onReschedule: (bookingId: string, newDate: string, newTime: string) => Promise<void>;
  loading?: boolean;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  visible,
  booking,
  onClose,
  onReschedule,
  loading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (visible && booking) {
      setSelectedDate(booking.bookingDate);
      setSelectedTime(booking.bookingTime);
      fetchSlots(booking.bookingDate);
    }
  }, [visible, booking]);

  const fetchSlots = async (date: string) => {
    if (!booking) return;
    try {
      setLoadingSlots(true);
      const res = await salonService.getTimeSlots(
        booking.salonId,
        booking.stylistId,
        date,
        booking.serviceId,
      );
      if (res.status === 'success') {
        setTimeSlots(res.data.slots);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setSelectedTime('');
    fetchSlots(day.dateString);
  };

  const handleReschedule = () => {
    if (booking && selectedDate && selectedTime) {
      onReschedule(booking.bookingId, selectedDate, selectedTime);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reschedule Booking</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Icon name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Calendar
              onDayPress={onDateSelect}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: theme.colors.primaryDark,
                },
              }}
              minDate={dayjs().format('YYYY-MM-DD')}
              theme={{
                todayTextColor: theme.colors.primaryDark,
                selectedDayBackgroundColor: theme.colors.primaryDark,
                arrowColor: theme.colors.primaryDark,
              }}
              renderArrow={(direction) => (
                <Icon
                  name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                  size={20}
                  color={theme.colors.primaryDark}
                />
              )}
            />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Available Slots</Text>
            {loadingSlots ? (
              <ActivityIndicator color={theme.colors.primaryDark} style={{ margin: 20 }} />
            ) : (
              <View style={styles.slotsContainer}>
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      disabled={!slot.available}
                      style={[
                        styles.slotButton,
                        !slot.available && styles.disabledSlot,
                        selectedTime === slot.time && styles.selectedSlot,
                      ]}
                      onPress={() => setSelectedTime(slot.time)}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          !slot.available && styles.disabledSlotText,
                          selectedTime === slot.time && styles.selectedSlotText,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptySlots}>No slots available for this date</Text>
                )}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedTime || loading) && styles.disabledButton,
            ]}
            onPress={handleReschedule}
            disabled={!selectedTime || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Confirm Reschedule</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RescheduleModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
  },
  disabledSlot: {
    backgroundColor: theme.colors.border + '50',
    borderColor: 'transparent',
  },
  slotText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  selectedSlotText: {
    color: '#fff',
    fontFamily: theme.fonts.subheading,
  },
  disabledSlotText: {
    color: theme.colors.textDisabled,
  },
  emptySlots: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    width: '100%',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
  },
});
