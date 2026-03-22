import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CommonContainer from '../components/CommonContainer';
import theme from '../utils/Theme';
import { salonService } from '@/services/salonService';
import { Stylist } from '@/types';
import { useCartStore } from '@/store/cartStore';
import dayjs from 'dayjs';
import { Calendar } from 'react-native-calendars';
import Icon from '@react-native-vector-icons/ionicons';

const StylistAndTimeSlotScreen: FC<any> = ({ navigation }) => {
  const {
    salonId,
    services,
    stylist: selectedStylist,
    bookingDate,
    startTime: selectedTime,
    setStylist,
    setBookingDate,
    setStartTime,
  } = useCartStore();

  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (salonId) {
      fetchStylists();
    }
  }, [salonId]);

  useEffect(() => {
    if (selectedStylist && bookingDate && services.length > 0) {
      fetchTimeSlots();
    }
  }, [selectedStylist, bookingDate]);

  const fetchStylists = async () => {
    try {
      setLoadingStylists(true);
      const res = await salonService.getSalonStylists(salonId!);
      console.log('🚀 -> fetchStylists -> res:', res);
      if (res.status === 'success') {
        setStylists(res.data.stylists);
      }
    } catch (error) {
      console.error('Error fetching stylists:', error);
    } finally {
      setLoadingStylists(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setLoadingSlots(true);
      // Using the first service for timeslot calculation as per API spec
      const res = await salonService.getTimeSlots(
        salonId!,
        selectedStylist!._id,
        bookingDate!,
        services[0]._id,
      );
      if (res.status === 'success') {
        setTimeSlots(res.data.slots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onDateSelect = (day: any) => {
    setBookingDate(day.dateString);
    setShowCalendar(false);
    setStartTime(''); // Reset time when date changes
  };

  const handleNext = () => {
    if (selectedStylist && bookingDate && selectedTime) {
      navigation.navigate('BookingForScreen');
    }
  };

  return (
    <CommonContainer
      showBackButton
      hideHeader={false}
      title="Select Stylist & Time"
      noPadding
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.dateText}>
            {bookingDate
              ? dayjs(bookingDate).format('DD MMM YYYY')
              : 'Select Date'}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={onDateSelect}
            markedDates={{
              [bookingDate || '']: {
                selected: true,
                selectedColor: theme.colors.primaryDark,
              },
            }}
            minDate={dayjs().format('YYYY-MM-DD')}
            renderArrow={direction => (
              <Icon
                name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={24}
                color={theme.colors.primaryDark}
              />
            )}
            theme={{
              todayTextColor: theme.colors.primaryDark,
              selectedDayBackgroundColor: theme.colors.primaryDark,
              arrowColor: theme.colors.primaryDark,
            }}
          />
        )}

        {/* Stylist Selection */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Select Stylist
        </Text>
        {loadingStylists ? (
          <ActivityIndicator
            color={theme.colors.primaryDark}
            style={{ margin: 20 }}
          />
        ) : (
          <FlatList
            horizontal
            data={stylists}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stylistCard,
                  selectedStylist?._id === item._id && styles.selectedCard,
                ]}
                onPress={() => setStylist(item)}
              >
                <Image
                  source={{ uri: item.profilePhoto || item.stylistImage }}
                  style={styles.stylistImage}
                />
                <Text style={styles.stylistName}>{item.name}</Text>
                <Text style={styles.stylistExp}>
                  {item.yearsOfExperience}y Exp
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Time Slots */}
        {selectedStylist && bookingDate && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Available Slots
            </Text>
            {loadingSlots ? (
              <ActivityIndicator
                color={theme.colors.primaryDark}
                style={{ margin: 20 }}
              />
            ) : (
              <View style={styles.slotsContainer}>
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={!slot.available}
                    style={[
                      styles.slotButton,
                      !slot.available && styles.disabledSlot,
                      selectedTime === slot.time && styles.selectedSlot,
                    ]}
                    onPress={() => setStartTime(slot.time)}
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
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!selectedStylist || !bookingDate || !selectedTime) &&
            styles.disabledButton,
        ]}
        disabled={!selectedStylist || !bookingDate || !selectedTime}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </CommonContainer>
  );
};

export default StylistAndTimeSlotScreen;

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  dateSelector: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  stylistCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryDark + '10',
  },
  stylistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  stylistName: {
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  stylistExp: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textPrimary,
  },
  selectedSlotText: {
    color: theme.colors.textOnPrimary,
  },
  disabledSlotText: {
    color: theme.colors.textSecondary,
  },
  nextButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  disabledButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  nextButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.subheading,
  },
});
