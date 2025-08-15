import React, { useMemo, useState } from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import dayjs from 'dayjs';
import { Booking } from '../../types';
import { dummyBookings } from '../../data/dummyData';
import { YMD } from '../../utils/dateUtils';
import CalendarMonthView from '../../components/Calendar/CalendarMonthView';
import CalendarDayView from '../../components/Calendar/CalendarDayView';
import CommonContainer from '../../components/CommonContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../utils/Theme';

type ViewMode = 'month' | 'day';

export default function BookingCalendarScreen({ navigation }: any) {
  const [view, setView] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(dayjs().format(YMD));
  const [bookings, setBookings] = useState<Booking[]>(dummyBookings);

  const bookingsForSelectedDay = useMemo(
    () => bookings.filter(b => dayjs(b.start).format(YMD) === selectedDate),
    [bookings, selectedDate],
  );

  const openActions = (booking: Booking) => {
    const edit = () => navigation.navigate('EditBooking', { id: booking.id });
    const del = () =>
      Alert.alert('Delete booking?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setBookings(prev => prev.filter(b => b.id !== booking.id)),
        },
      ]);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        idx => {
          if (idx === 1) edit();
          if (idx === 2) del();
        },
      );
    } else {
      Alert.alert('Booking', `${booking.serviceName}`, [
        { text: 'Edit', onPress: edit },
        { text: 'Delete', onPress: del, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const goAddOrEdit = () =>
    navigation.navigate('EditBooking', { date: selectedDate });

  return (
    <CommonContainer scrollable>
      <View style={{ flex: 1 }}>
        {view === 'month' ? (
          <CalendarMonthView
            selectedDate={selectedDate}
            onSelectDate={ymd => {
              setSelectedDate(ymd);
              setView('day');
            }}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setView('month')}
              style={{
                padding: 10,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.primaryDark}
              />
            </TouchableOpacity>
            <Text
              style={{
                paddingHorizontal: 12,
                paddingBottom: 8,
                fontWeight: '600',
              }}
            >
              {dayjs(selectedDate).format('MMM D, YYYY')}
            </Text>
            <CalendarDayView
              dateYmd={selectedDate}
              bookings={bookingsForSelectedDay}
              onLongPressBooking={openActions}
            />

            {/* Floating Save Button (bottom-right) */}
            <TouchableOpacity
              onPress={goAddOrEdit}
              style={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderRadius: 28,
                backgroundColor: '#2563eb',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </CommonContainer>
  );
}
